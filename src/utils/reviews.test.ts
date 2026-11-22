/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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
