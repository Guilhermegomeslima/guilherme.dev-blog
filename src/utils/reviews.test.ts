/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  enhanceEditorialHtml,
  hasSpoilerLeak,
  stripSpoilerBlocks,
} from './editorial-media.ts';
import {
  compareReviews,
  countReviewsByMediaType,
  estimateReadingMinutes,
  resolveRelatedWorkLink,
  REVIEW_MEDIA_ORDER,
  REVIEW_MEDIA_TYPES,
  type ReviewSortableEntry,
} from './reviews.ts';

describe('reviews — Ordenação, contagens e vínculos com acervos (EXP-03A)', () => {
  it('deve ordenar resenhas por data decrescente, depois featured e título', () => {
    const entries: ReviewSortableEntry[] = [
      {
        id: 'sem-data-b',
        data: { title: 'B', mediaType: 'livro', featured: false },
      },
      {
        id: 'antiga',
        data: {
          title: 'Antiga',
          mediaType: 'filme',
          publishedAt: new Date('2026-01-10'),
        },
      },
      {
        id: 'recente',
        data: {
          title: 'Recente',
          mediaType: 'jogo',
          publishedAt: new Date('2026-11-20'),
        },
      },
      {
        id: 'sem-data-destaque',
        data: { title: 'Z', mediaType: 'jogo', featured: true },
      },
    ];

    const sorted = [...entries].sort(compareReviews).map((e) => e.id);
    assert.deepEqual(sorted, [
      'recente',
      'antiga',
      'sem-data-destaque',
      'sem-data-b',
    ]);
  });

  it('deve contar corretamente resenhas por tipo de mídia (jogo, filme, livro)', () => {
    const counts = countReviewsByMediaType([
      { data: { mediaType: 'jogo' } },
      { data: { mediaType: 'jogo' } },
      { data: { mediaType: 'filme' } },
    ]);

    assert.deepEqual(counts, { all: 3, jogo: 2, filme: 1, livro: 0 });
    assert.deepEqual(REVIEW_MEDIA_ORDER, ['jogo', 'filme', 'livro']);
    assert.equal(REVIEW_MEDIA_TYPES.jogo.plural, 'Jogos');
    assert.equal(REVIEW_MEDIA_TYPES.filme.plural, 'Filmes');
    assert.equal(REVIEW_MEDIA_TYPES.livro.plural, 'Livros');
  });

  it('deve resolver links opcionais para fichas de Jogos, Filmes e Livros', () => {
    assert.equal(
      resolveRelatedWorkLink({
        collection: 'games',
        id: 'shinobido-the-way-of-the-ninja',
      }).href,
      '/jogos/shinobido-the-way-of-the-ninja/',
    );
    assert.equal(
      resolveRelatedWorkLink({ collection: 'movies', id: 'ran' }).href,
      '/filmes/ran/',
    );
    assert.equal(
      resolveRelatedWorkLink({ collection: 'books', id: '1984' }).href,
      '/livros/1984/',
    );
  });

  it('deve estimar tempo de leitura mínimo de 1 minuto', () => {
    assert.equal(estimateReadingMinutes(''), 1);
    assert.equal(estimateReadingMinutes('palavra '.repeat(450)), 2);
  });

  it('a rota src/pages/resenhas/[...slug].astro deve estar protegida por shouldGenerateSectionRoute', () => {
    const routeSrc = fs.readFileSync(
      path.resolve('src/pages/resenhas/[...slug].astro'),
      'utf-8',
    );
    assert.ok(routeSrc.includes("shouldGenerateSectionRoute('reviews')"));
    assert.ok(routeSrc.includes("shouldIncludeEntry('reviews'"));
  });
});

describe('Resenha Shinobido — Integridade editorial, imagens e proteção de spoilers (EXP-03B)', () => {
  const reviewPath = path.resolve(
    'src/content/reviews/shinobido-uma-joia-esquecida.md',
  );
  const raw = fs.readFileSync(reviewPath, 'utf-8');
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter = fmMatch?.[1] ?? '';
  const body = fmMatch?.[2] ?? '';

  it('deve estar liberada (draft: false), com data editorial 2026-11-22 e vínculo válido para Jogos', () => {
    assert.ok(/draft:\s*false/.test(frontmatter));
    assert.ok(/isDemo:\s*false/.test(frontmatter));
    assert.ok(/hasSpoilers:\s*true/.test(frontmatter));
    assert.ok(/publishedAt:\s*2026-11-22/.test(frontmatter));
    assert.equal(
      /updatedAt:/i.test(frontmatter),
      false,
      'updatedAt não deve ser inventada na estreia',
    );
    assert.ok(frontmatter.includes("id: 'shinobido-the-way-of-the-ninja'"));
    assert.ok(
      fs.existsSync(
        path.resolve('src/content/games/shinobido-the-way-of-the-ninja.json'),
      ),
    );
  });

  it('deve referenciar exatamente 14 imagens WebP existentes em public/images/reviews/shinobido/', () => {
    const imgMatches = [
      ...raw.matchAll(/\/images\/reviews\/shinobido\/([a-z0-9-]+\.webp)/g),
    ].map((m) => m[0]);
    const uniqueImgs = Array.from(new Set(imgMatches));

    assert.equal(
      uniqueImgs.length,
      14,
      `Esperadas 14 imagens integradas, encontradas ${uniqueImgs.length}`,
    );

    for (const imgUrl of uniqueImgs) {
      const diskPath = path.resolve('public', imgUrl.replace(/^\//, ''));
      assert.ok(
        fs.existsSync(diskPath),
        `Imagem referenciada ausente no disco: ${imgUrl}`,
      );
    }
  });

  it('deve conter 2 blocos de spoiler, manter as 2 imagens sensíveis exclusivamente dentro deles e não vazar spoilers no resumo', () => {
    const spoilerBlocks = body.match(
      /<details\b[^>]*\bdata-spoiler\b[^>]*>[\s\S]*?<\/details>/gi,
    );
    assert.equal(spoilerBlocks?.length, 2);

    const strippedBody = stripSpoilerBlocks(body);
    assert.equal(
      strippedBody.includes('goh-fragmento-memoria.webp'),
      false,
      'goh-fragmento-memoria.webp não pode aparecer fora do bloco de spoiler',
    );
    assert.equal(
      strippedBody.includes('personagem-onji-gato.webp'),
      false,
      'personagem-onji-gato.webp não pode aparecer fora do bloco de spoiler',
    );
    assert.ok(spoilerBlocks?.[0].includes('goh-fragmento-memoria.webp'));
    assert.ok(spoilerBlocks?.[1].includes('personagem-onji-gato.webp'));

    const descMatch = frontmatter.match(/description:\s*'([^']+)'/);
    const description = descMatch?.[1] ?? '';
    assert.ok(description.length > 20);
    assert.equal(hasSpoilerLeak(description, body), false);

    // Valida compatibilidade com GitHub Pages e marcação de spoiler no HTML processado
    const processedGh = enhanceEditorialHtml(body, {
      base: '/guilherme.dev-blog/',
    });
    assert.ok(
      processedGh.includes(
        'src="/guilherme.dev-blog/images/reviews/shinobido/assassinato-furtivo-goh.webp"',
      ),
    );
    assert.ok(
      processedGh.includes(
        'src="/guilherme.dev-blog/images/reviews/shinobido/personagem-onji-gato.webp"',
      ),
    );
    assert.equal(
      (processedGh.match(/data-spoiler-media="true"/g) ?? []).length,
      2,
    );
  });
});
