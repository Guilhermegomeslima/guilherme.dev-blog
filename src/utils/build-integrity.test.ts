/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_SITE } from './seo.ts';
import {
  getUnpublishedExpansionPrefixes,
  isExpansionPreviewEnabled,
} from './editorial-flags.ts';

const distDir = path.resolve('dist');
const contentDir = path.resolve('src/content');

/**
 * Rotas estáticas principais conhecidas que geram páginas individuais e devem figurar no sitemap.
 */
export const staticSitemapRoutes = [
  '/',
  '/sobre/',
  '/projetos/',
  '/linux/',
  '/jogos/',
  '/filmes/',
  '/livros/',
  '/artigos/',
  '/musica/',
  '/opensource/',
  '/galeria/',
];

/**
 * Arquivos HTML gerados que NÃO devem figurar no sitemap canônico (ex.: 404 e redirecionamento de alias).
 */
export const nonSitemapHtmlFiles = [
  '404.html',
  path.join('open-source', 'index.html'),
];

/**
 * Lê uma pasta de content collections e extrai os identificadores (slugs)
 * dos itens que atendem aos critérios de publicação (não são rascunhos nem demos).
 */
export function getPublishableSlugs(
  dir: string,
  ext: '.json' | '.md',
): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir);
  const slugs: string[] = [];

  for (const entry of entries) {
    if (!entry.endsWith(ext)) continue;
    const fullPath = path.join(dir, entry);
    const raw = fs.readFileSync(fullPath, 'utf-8');

    if (ext === '.json') {
      try {
        const data = JSON.parse(raw);
        if (!data.draft && !data.isDemo) {
          slugs.push(entry.replace(/\.json$/, ''));
        }
      } catch {
        // Ignora erros de parse aqui — cobertos por content-integrity.test.ts
      }
    } else if (ext === '.md') {
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (match) {
        const fm = match[1];
        const isDraft = /draft:\s*true/i.test(fm);
        const isDemo = /isDemo:\s*true/i.test(fm);
        if (!isDraft && !isDemo) {
          slugs.push(entry.replace(/\.md$/, ''));
        }
      } else {
        slugs.push(entry.replace(/\.md$/, ''));
      }
    }
  }

  return slugs.sort();
}

/**
 * Extrai a lista de álbuns de galeria distintos e publicáveis.
 */
export function getPublishableGalleryAlbums(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir);
  const albums = new Set<string>();

  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, entry), 'utf-8'));
      if (!data.draft && !data.isDemo && data.albumSlug) {
        albums.add(data.albumSlug);
      }
    } catch {}
  }

  return Array.from(albums).sort();
}

/**
 * Calcula de forma independente as rotas canônicas e os arquivos HTML esperados no build.
 */
export function computeExpectedBuildRoutes(): {
  sitemapUrls: Set<string>;
  expectedHtmlFiles: Set<string>;
  counts: {
    articles: number;
    games: number;
    movies: number;
    books: number;
    galleryAlbums: number;
    staticRoutes: number;
  };
} {
  const articles = getPublishableSlugs(
    path.join(contentDir, 'articles'),
    '.md',
  );
  const games = getPublishableSlugs(path.join(contentDir, 'games'), '.json');
  const movies = getPublishableSlugs(path.join(contentDir, 'movies'), '.json');
  const books = getPublishableSlugs(path.join(contentDir, 'books'), '.json');
  const galleryAlbums = getPublishableGalleryAlbums(
    path.join(contentDir, 'gallery'),
  );

  const sitemapUrls = new Set<string>();
  const expectedHtmlFiles = new Set<string>();

  // Rotas estáticas
  for (const r of staticSitemapRoutes) {
    sitemapUrls.add(`${CANONICAL_SITE}${r}`);
    if (r === '/') {
      expectedHtmlFiles.add('index.html');
    } else {
      const clean = r.replace(/^\/|\/$/g, '');
      expectedHtmlFiles.add(path.join(clean, 'index.html'));
    }
  }

  // Coleções dinâmicas
  for (const id of articles) {
    sitemapUrls.add(`${CANONICAL_SITE}/artigos/${id}/`);
    expectedHtmlFiles.add(path.join('artigos', id, 'index.html'));
  }
  for (const id of games) {
    sitemapUrls.add(`${CANONICAL_SITE}/jogos/${id}/`);
    expectedHtmlFiles.add(path.join('jogos', id, 'index.html'));
  }
  for (const id of movies) {
    sitemapUrls.add(`${CANONICAL_SITE}/filmes/${id}/`);
    expectedHtmlFiles.add(path.join('filmes', id, 'index.html'));
  }
  for (const id of books) {
    sitemapUrls.add(`${CANONICAL_SITE}/livros/${id}/`);
    expectedHtmlFiles.add(path.join('livros', id, 'index.html'));
  }
  for (const slug of galleryAlbums) {
    sitemapUrls.add(`${CANONICAL_SITE}/galeria/${slug}/`);
    expectedHtmlFiles.add(path.join('galeria', slug, 'index.html'));
  }

  // Arquivos auxiliares que não figuram no sitemap
  for (const f of nonSitemapHtmlFiles) {
    expectedHtmlFiles.add(f);
  }

  return {
    sitemapUrls,
    expectedHtmlFiles,
    counts: {
      articles: articles.length,
      games: games.length,
      movies: movies.length,
      books: books.length,
      galleryAlbums: galleryAlbums.length,
      staticRoutes: staticSitemapRoutes.length,
    },
  };
}

/**
 * Função utilitária que compara arquivos gerados com os esperados e identifica discrepâncias.
 */
export function findRouteDifferences(
  expected: Set<string>,
  actual: Set<string>,
): { missing: string[]; unexpected: string[] } {
  const missing = Array.from(expected)
    .filter((x) => !actual.has(x))
    .sort();
  const unexpected = Array.from(actual)
    .filter((x) => !expected.has(x))
    .sort();
  return { missing, unexpected };
}

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

describe('Auditoria Pós-Build — Integridade Dinâmica de Rotas, Links e Ativos', () => {
  if (!fs.existsSync(distDir)) {
    it('diretório dist/ não gerado ainda (teste ignorado em ambiente pré-build)', () => {
      assert.ok(true);
    });
    return;
  }

  const expectedRoutes = computeExpectedBuildRoutes();
  const htmlFiles = getAllHtmlFiles(distDir);
  const actualHtmlFilesSet = new Set(
    htmlFiles.map((p) => path.relative(distDir, p)),
  );

  it('deve gerar todas as páginas estáticas calculadas a partir das coleções reais e rotas ativas', () => {
    const diff = findRouteDifferences(
      expectedRoutes.expectedHtmlFiles,
      actualHtmlFilesSet,
    );

    assert.equal(
      diff.missing.length,
      0,
      `Páginas publicáveis esperadas ausentes no build: ${diff.missing.join(', ')}`,
    );
    assert.equal(
      diff.unexpected.length,
      0,
      `Páginas HTML não mapeadas geradas em dist/: ${diff.unexpected.join(', ')}`,
    );
    assert.equal(
      htmlFiles.length,
      expectedRoutes.expectedHtmlFiles.size,
      `Total de páginas (${htmlFiles.length}) diverge do total dinâmico esperado (${expectedRoutes.expectedHtmlFiles.size})`,
    );
  });

  describe('Sitemap e Robots Dinâmicos', () => {
    it('dist/sitemap.xml deve conter exatamente as URLs canônicas publicáveis calculadas', () => {
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      assert.ok(fs.existsSync(sitemapPath), 'dist/sitemap.xml não encontrado');

      const xml = fs.readFileSync(sitemapPath, 'utf-8');
      const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
        (m) => m[1],
      );
      const actualLocSet = new Set(locMatches);

      assert.equal(
        locMatches.length,
        expectedRoutes.sitemapUrls.size,
        `Total de URLs no sitemap (${locMatches.length}) diverge das rotas canônicas esperadas (${expectedRoutes.sitemapUrls.size})`,
      );

      const diff = findRouteDifferences(
        expectedRoutes.sitemapUrls,
        actualLocSet,
      );
      assert.equal(
        diff.missing.length,
        0,
        `URLs canônicas esperadas ausentes no sitemap.xml: ${diff.missing.join(', ')}`,
      );
      assert.equal(
        diff.unexpected.length,
        0,
        `URLs não autorizadas presentes no sitemap.xml: ${diff.unexpected.join(', ')}`,
      );

      for (const url of locMatches) {
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

  describe('Proteção de Publicação da Expansão Editorial (EXP-02A)', () => {
    it('seções não aprovadas da expansão não devem gerar arquivos em dist/ nem constar no sitemap público', () => {
      if (isExpansionPreviewEnabled()) return;

      const unpublishedPrefixes = getUnpublishedExpansionPrefixes();
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      const sitemapXml = fs.existsSync(sitemapPath)
        ? fs.readFileSync(sitemapPath, 'utf-8')
        : '';

      for (const prefix of unpublishedPrefixes) {
        const sectionDir = path.join(distDir, prefix);
        assert.equal(
          fs.existsSync(sectionDir),
          false,
          `Diretório não aprovado encontrado no build público: dist/${prefix}/`,
        );

        const leakedHtml = htmlFiles.filter((file) => {
          const rel = path.relative(distDir, file).split(path.sep)[0];
          return rel === prefix;
        });
        assert.equal(
          leakedHtml.length,
          0,
          `Páginas não aprovadas vazaram em dist/${prefix}/: ${leakedHtml.join(', ')}`,
        );

        assert.equal(
          sitemapXml.includes(`${CANONICAL_SITE}/${prefix}/`),
          false,
          `Rota não aprovada /${prefix}/ vazou no sitemap.xml`,
        );
      }
    });
  });

  describe('Detecção de Falhas Reais (Anti-Regressão Não-Circular)', () => {
    it('findRouteDifferences deve identificar rotas faltantes e rotas inesperadas', () => {
      const expected = new Set(['jogos/index.html', 'sobre/index.html']);
      const actual = new Set(['jogos/index.html', 'rota-fantasma/index.html']);

      const diff = findRouteDifferences(expected, actual);
      assert.deepEqual(diff.missing, ['sobre/index.html']);
      assert.deepEqual(diff.unexpected, ['rota-fantasma/index.html']);
    });

    it('deve falhar se uma URL obrigatória for removida do sitemap simulado', () => {
      const mockExpected = new Set(['https://guilherme.dev/jogos/']);
      const mockActual = new Set<string>();

      const diff = findRouteDifferences(mockExpected, mockActual);
      assert.equal(diff.missing.length, 1);
      assert.equal(diff.missing[0], 'https://guilherme.dev/jogos/');
    });
  });
});
