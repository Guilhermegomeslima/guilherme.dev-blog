/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  CANONICAL_SITE,
  toCanonicalUrl,
  toAbsoluteImageUrl,
  safeJsonLd,
  isPublishable,
  getWebSiteSchema,
  getProfilePageSchema,
  getBlogPostingSchema,
  getReviewArticleSchema,
  getLinuxDiaryArticleSchema,
} from './seo.ts';

describe('toCanonicalUrl — Canonicalização de URLs para a produção principal', () => {
  it('deve converter caminhos relativos na URL canônica da produção principal', () => {
    assert.equal(toCanonicalUrl('/'), `${CANONICAL_SITE}/`);
    assert.equal(toCanonicalUrl('/sobre'), `${CANONICAL_SITE}/sobre/`);
    assert.equal(toCanonicalUrl('/jogos/'), `${CANONICAL_SITE}/jogos/`);
  });

  it('deve remover o prefixo de espelho do GitHub Pages (/guilherme.dev-blog)', () => {
    assert.equal(toCanonicalUrl('/guilherme.dev-blog/'), `${CANONICAL_SITE}/`);
    assert.equal(
      toCanonicalUrl('/guilherme.dev-blog/sobre/'),
      `${CANONICAL_SITE}/sobre/`,
    );
    assert.equal(
      toCanonicalUrl('/guilherme.dev-blog/jogos/hollow-knight/'),
      `${CANONICAL_SITE}/jogos/hollow-knight/`,
    );
  });

  it('deve preservar URLs absolutas externas', () => {
    assert.equal(
      toCanonicalUrl('https://exemplo.com/artigo/'),
      'https://exemplo.com/artigo/',
    );
  });
});

describe('toAbsoluteImageUrl — Resolução de URLs de imagem para Open Graph / Twitter', () => {
  it('deve converter caminhos locais em URLs absolutas', () => {
    assert.equal(
      toAbsoluteImageUrl('/images/capa.jpg'),
      `${CANONICAL_SITE}/images/capa.jpg`,
    );
    assert.equal(
      toAbsoluteImageUrl('images/capa.jpg'),
      `${CANONICAL_SITE}/images/capa.jpg`,
    );
  });

  it('deve preservar URLs remotas completas', () => {
    const remote = 'https://github.com/Guilhermegomeslima.png';
    assert.equal(toAbsoluteImageUrl(remote), remote);
  });
});

describe('safeJsonLd — Serialização segura contra injeção HTML', () => {
  it('deve escapar caracteres perigosos como <, >, & e separadores', () => {
    const payload = {
      malicious: '</script><script>alert("xss")</script>',
      amp: 'rock & roll',
    };
    const serialized = safeJsonLd(payload);

    assert.ok(!serialized.includes('</script>'));
    assert.ok(serialized.includes('\\u003c/script\\u003e'));
    assert.ok(serialized.includes('\\u0026'));
  });
});

describe('isPublishable — Filtro tipado de publicação para o Sitemap', () => {
  it('deve aprovar registros reais que não são demo nem rascunho', () => {
    assert.equal(isPublishable({ isDemo: false }), true);
    assert.equal(isPublishable({ isDemo: false, draft: false }), true);
    assert.equal(isPublishable({}), true);
  });

  it('deve rejeitar registros demonstrativos (isDemo: true)', () => {
    assert.equal(isPublishable({ isDemo: true }), false);
    assert.equal(isPublishable({ isDemo: true, draft: false }), false);
  });

  it('deve rejeitar rascunhos (draft: true)', () => {
    assert.equal(isPublishable({ draft: true }), false);
    assert.equal(isPublishable({ isDemo: false, draft: true }), false);
  });

  it('deve rejeitar itens que sejam simultaneamente demo e rascunho', () => {
    assert.equal(isPublishable({ isDemo: true, draft: true }), false);
  });
});

describe('Auditoria de Conteúdo Real vs Filtros de Publicação', () => {
  it('todos os arquivos de conteúdo de games, movies, books, articles e gallery devem ser publicáveis (0 demos, 0 rascunhos)', () => {
    const baseDir = path.resolve('src/content');
    const collections = ['articles', 'games', 'movies', 'books', 'gallery'];

    for (const col of collections) {
      const colDir = path.join(baseDir, col);
      if (!fs.existsSync(colDir)) continue;

      const files = fs.readdirSync(colDir);
      for (const file of files) {
        const fullPath = path.join(colDir, file);
        if (!fs.statSync(fullPath).isFile()) continue;

        if (file.endsWith('.json')) {
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          assert.equal(
            isPublishable(content),
            true,
            `Arquivo ${col}/${file} não é publicável!`,
          );
          assert.notEqual(
            content.isDemo,
            true,
            `Arquivo ${col}/${file} marcado com isDemo: true!`,
          );
          assert.notEqual(
            content.draft,
            true,
            `Arquivo ${col}/${file} marcado com draft: true!`,
          );
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const raw = fs.readFileSync(fullPath, 'utf-8');
          assert.ok(
            !raw.includes('isDemo: true'),
            `Arquivo ${col}/${file} contém isDemo: true no frontmatter!`,
          );
          assert.ok(
            !raw.includes('draft: true'),
            `Arquivo ${col}/${file} contém draft: true no frontmatter!`,
          );
        }
      }
    }
  });
});

describe('Schemas de Dados Estruturados (Schema.org)', () => {
  it('getWebSiteSchema deve gerar entidade WebSite válida', () => {
    const schema = getWebSiteSchema();
    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@type'], 'WebSite');
    assert.equal(schema.url, `${CANONICAL_SITE}/`);
    assert.equal(schema.author.name, 'Guilherme Gomes');
  });

  it('getProfilePageSchema deve gerar ProfilePage e Person com dados reais e redes autênticas', () => {
    const schema = getProfilePageSchema();
    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@type'], 'ProfilePage');
    assert.equal(schema.mainEntity['@type'], 'Person');
    assert.equal(schema.mainEntity.name, 'Guilherme Gomes');
    assert.equal(
      schema.mainEntity.jobTitle,
      'Desenvolvedor em aprendizado & entusiasta de sistemas operacionais',
    );
    assert.ok(
      schema.mainEntity.sameAs.includes(
        'https://github.com/Guilhermegomeslima',
      ),
    );
    assert.ok(
      schema.mainEntity.sameAs.includes(
        'https://www.linkedin.com/in/guilhermegomes-dev/',
      ),
    );
    assert.ok(
      schema.mainEntity.sameAs.includes('https://linktr.ee/guilhermegl.sites'),
    );
    assert.ok(
      schema.mainEntity.sameAs.includes(
        'https://www.instagram.com/guilherme.glmg/',
      ),
    );
  });

  it('getBlogPostingSchema deve gerar BlogPosting com headline e data ISO', () => {
    const pubDate = new Date('2026-11-07T14:30:00.000Z');
    const schema = getBlogPostingSchema({
      id: 'por-que-escolhi-fedora',
      title: 'Por que escolhi o Fedora Workstation',
      description: 'Minha experiência de migração.',
      publishedAt: pubDate,
      imageUrl: '/images/articles/fedora.jpg',
      tags: ['Linux', 'Fedora'],
    });

    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@type'], 'BlogPosting');
    assert.equal(schema.headline, 'Por que escolhi o Fedora Workstation');
    assert.equal(schema.datePublished, pubDate.toISOString());
    assert.equal(
      schema.url,
      `${CANONICAL_SITE}/artigos/por-que-escolhi-fedora/`,
    );
    assert.equal(schema.image, `${CANONICAL_SITE}/images/articles/fedora.jpg`);
    assert.deepEqual(schema.keywords, ['Linux', 'Fedora']);
  });

  it('getReviewArticleSchema e getLinuxDiaryArticleSchema não devem inventar datas ausentes (EXP-07B)', () => {
    const reviewSchema = getReviewArticleSchema({
      id: 'shinobido-uma-joia-esquecida',
      title: 'Shinobido: uma joia esquecida do PS2',
      description: 'Análise pessoal do clássico de PS2.',
      imageUrl: '/images/reviews/shinobido/tela-titulo-shinobido.webp',
      tags: ['PS2', 'Shinobido'],
    });
    assert.equal(reviewSchema['@type'], 'Article');
    assert.equal(
      reviewSchema.url,
      `${CANONICAL_SITE}/resenhas/shinobido-uma-joia-esquecida/`,
    );
    assert.equal(reviewSchema.datePublished, undefined);
    assert.equal(reviewSchema.dateModified, undefined);

    const diarySchema = getLinuxDiaryArticleSchema({
      id: 'como-personalizo-meu-gnome',
      title: 'Como personalizo meu GNOME',
      description: 'Tutorial de personalização do GNOME no Fedora.',
      publishedAt: new Date('2026-11-22T12:00:00Z'),
    });
    assert.equal(diarySchema['@type'], 'TechArticle');
    assert.equal(
      diarySchema.url,
      `${CANONICAL_SITE}/diario-linux/como-personalizo-meu-gnome/`,
    );
    assert.equal(diarySchema.datePublished, '2026-11-22T12:00:00.000Z');
  });
});
