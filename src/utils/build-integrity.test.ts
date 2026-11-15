/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_SITE } from './seo.ts';

const distDir = path.resolve('dist');

function getAllHtmlFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllHtmlFiles(fullPath));
    } else if (entry.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Auditoria Pós-Build — Integridade de links, imagens e rotas em dist/', () => {
  if (!fs.existsSync(distDir)) {
    it('diretório dist/ não gerado ainda (teste ignorado em ambiente pré-build)', () => {
      assert.ok(true);
    });
    return;
  }

  const htmlFiles = getAllHtmlFiles(distDir);

  it('deve ter gerado o total esperado de páginas estáticas (220 páginas)', () => {
    assert.equal(htmlFiles.length, 220);
  });

  describe('Sitemap e Robots', () => {
    it('dist/sitemap.xml deve conter exatamente 218 URLs canônicas sem 404 ou alias', () => {
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      assert.ok(fs.existsSync(sitemapPath), 'dist/sitemap.xml não encontrado');

      const xml = fs.readFileSync(sitemapPath, 'utf-8');
      const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
      assert.equal(locMatches.length, 218);

      for (const m of locMatches) {
        const url = m[1];
        assert.ok(
          url.startsWith(CANONICAL_SITE),
          `URL do sitemap não utiliza host canônico: ${url}`,
        );
        assert.ok(!url.includes('404'), `404 presente no sitemap: ${url}`);
        assert.ok(
          !url.includes('/open-source/'),
          `Alias /open-source/ presente no sitemap: ${url}`,
        );
      }

      // Confirma que artigo possui lastmod e home não possui
      assert.ok(
        xml.includes(
          `<loc>${CANONICAL_SITE}/artigos/por-que-escolhi-fedora/</loc>\n    <lastmod>`,
        ),
      );
      assert.ok(!xml.includes(`<loc>${CANONICAL_SITE}/</loc>\n    <lastmod>`));
    });

    it('dist/robots.txt deve permitir acesso global e anunciar o sitemap canônico', () => {
      const robotsPath = path.join(distDir, 'robots.txt');
      assert.ok(fs.existsSync(robotsPath), 'dist/robots.txt não encontrado');

      const txt = fs.readFileSync(robotsPath, 'utf-8');
      assert.ok(txt.includes('User-agent: *'));
      assert.ok(txt.includes('Allow: /'));
      assert.ok(txt.includes(`Sitemap: ${CANONICAL_SITE}/sitemap.xml`));
    });
  });

  describe('Links Internos (0 links quebrados)', () => {
    it('todos os links internos relativos devem apontar para rotas existentes em dist/', () => {
      const linkRegex = /<a\s+[^>]*?href="([^"]+)"/gi;
      let checkedLinks = 0;

      for (const htmlFile of htmlFiles) {
        const content = fs.readFileSync(htmlFile, 'utf-8');
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(content)) !== null) {
          const href = match[1];
          if (
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('#')
          ) {
            continue;
          }

          checkedLinks++;
          const cleanPath = href.split('?')[0].split('#')[0].replace(/^\//, '');
          if (!cleanPath) continue;

          // Remove eventual prefixo do GitHub Pages se o build tiver rodado com base
          const stripped = cleanPath.replace(/^guilherme\.dev-blog\/?/, '');
          if (!stripped) continue;

          const targetDir = path.join(distDir, stripped, 'index.html');
          const targetFile = path.join(distDir, stripped);
          const targetHtml = path.join(distDir, `${stripped}.html`);

          const exists =
            fs.existsSync(targetDir) ||
            fs.existsSync(targetFile) ||
            fs.existsSync(targetHtml);

          assert.ok(
            exists,
            `Link quebrado em ${path.relative(distDir, htmlFile)}: href="${href}"`,
          );
        }
      }

      assert.ok(checkedLinks > 3000, 'Mínimo de links internos auditados');
    });
  });

  describe('Imagens Locais (0 imagens quebradas)', () => {
    it('todas as imagens <img src="..."> devem apontar para arquivos existentes em dist/', () => {
      const imgRegex = /<img\s+[^>]*?src="([^"]+)"/gi;
      let checkedImgs = 0;

      for (const htmlFile of htmlFiles) {
        const content = fs.readFileSync(htmlFile, 'utf-8');
        let match: RegExpExecArray | null;

        while ((match = imgRegex.exec(content)) !== null) {
          const src = match[1];
          if (
            src.startsWith('http://') ||
            src.startsWith('https://') ||
            src.startsWith('data:')
          ) {
            continue;
          }

          checkedImgs++;
          const cleanSrc = src.split('?')[0].split('#')[0].replace(/^\//, '');
          const stripped = cleanSrc.replace(/^guilherme\.dev-blog\/?/, '');

          const targetAsset = path.join(distDir, stripped);
          assert.ok(
            fs.existsSync(targetAsset),
            `Imagem ausente em ${path.relative(distDir, htmlFile)}: src="${src}"`,
          );
        }
      }

      assert.ok(checkedImgs > 500, 'Mínimo de imagens auditadas');
    });
  });

  describe('Segurança de Canonicalização e Redirecionamentos', () => {
    it('o alias /open-source/index.html deve conter noindex e canonical para /opensource/', () => {
      const aliasPath = path.join(distDir, 'open-source', 'index.html');
      assert.ok(fs.existsSync(aliasPath));

      const content = fs.readFileSync(aliasPath, 'utf-8');
      assert.ok(
        /<meta\s+name="robots"\s+content="noindex,\s*nofollow"/.test(content),
      );
      assert.ok(
        content.includes(
          `<link rel="canonical" href="${CANONICAL_SITE}/opensource/"`,
        ),
      );
    });
  });
});
