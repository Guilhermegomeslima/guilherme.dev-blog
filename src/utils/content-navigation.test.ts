/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNavigableEntries,
  compareArticles,
  compareBooks,
  compareGames,
  compareMovies,
  getAdjacentEntries,
  getPublishableOrderedEntries,
  type ArticleNavData,
  type BookNavData,
  type NavigableEntry,
  type YearTitledData,
} from './content-navigation.ts';

describe('content-navigation — Ordenação determinística por coleção (FRT-02)', () => {
  it('compareGames deve ordenar por ano decrescente, título pt-BR e id como desempate final', () => {
    const games: NavigableEntry<YearTitledData>[] = [
      { id: 'z-game', data: { title: 'Águia', releaseYear: 2020 } },
      { id: 'b-game', data: { title: 'Zelda', releaseYear: 2023 } },
      { id: 'a-game', data: { title: 'Águia', releaseYear: 2020 } },
      { id: 'c-game', data: { title: 'alan wake', releaseYear: 2020 } },
    ];

    const ordered = getPublishableOrderedEntries(games, compareGames);
    assert.deepEqual(
      ordered.map((g) => g.id),
      ['b-game', 'a-game', 'z-game', 'c-game'],
    );
  });

  it('compareMovies deve ordenar por ano decrescente, título pt-BR e id', () => {
    const movies: NavigableEntry<YearTitledData>[] = [
      { id: 'm-2', data: { title: 'Duna', releaseYear: 2021 } },
      { id: 'm-1', data: { title: 'Duna', releaseYear: 2021 } },
      { id: 'm-3', data: { title: 'Interestelar', releaseYear: 2014 } },
      { id: 'm-4', data: { title: 'Oppenheimer', releaseYear: 2023 } },
    ];

    const ordered = getPublishableOrderedEntries(movies, compareMovies);
    assert.deepEqual(
      ordered.map((m) => m.id),
      ['m-4', 'm-1', 'm-2', 'm-3'],
    );
  });

  it('compareBooks deve ordenar por status (lendo → lido → quero_ler), título pt-BR e id', () => {
    const books: NavigableEntry<BookNavData>[] = [
      {
        id: 'b-quero',
        data: { title: 'A Arte da Guerra', status: 'quero_ler' },
      },
      { id: 'b-lido-b', data: { title: 'O Príncipe', status: 'lido' } },
      { id: 'b-lendo', data: { title: 'Sengoku Jidai', status: 'lendo' } },
      { id: 'b-lido-a', data: { title: '1984', status: 'lido' } },
      { id: 'b-desconhecido', data: { title: 'Outro', status: 'arquivado' } },
    ];

    const ordered = getPublishableOrderedEntries(books, compareBooks);
    assert.deepEqual(
      ordered.map((b) => b.id),
      ['b-lendo', 'b-lido-a', 'b-lido-b', 'b-quero', 'b-desconhecido'],
    );
  });

  it('compareArticles deve ordenar cronologicamente (mais recente primeiro), com desempate por título e id', () => {
    const articles: NavigableEntry<ArticleNavData>[] = [
      {
        id: 'art-antigo',
        data: {
          title: 'Primeiro',
          publishedAt: new Date('2025-01-10T00:00:00Z'),
        },
      },
      {
        id: 'art-empate-b',
        data: {
          title: 'Mesmo Dia',
          publishedAt: new Date('2026-05-01T00:00:00Z'),
        },
      },
      {
        id: 'art-empate-a',
        data: {
          title: 'Mesmo Dia',
          publishedAt: new Date('2026-05-01T00:00:00Z'),
        },
      },
      {
        id: 'art-recente',
        data: {
          title: 'Mais Novo',
          publishedAt: new Date('2026-11-15T00:00:00Z'),
        },
      },
    ];

    const ordered = getPublishableOrderedEntries(articles, compareArticles);
    assert.deepEqual(
      ordered.map((a) => a.id),
      ['art-recente', 'art-empate-a', 'art-empate-b', 'art-antigo'],
    );
  });

  it('não deve mutar o array original ao ordenar', () => {
    const original: NavigableEntry<YearTitledData>[] = [
      { id: 'g-1', data: { title: 'Antigo', releaseYear: 2005 } },
      { id: 'g-2', data: { title: 'Novo', releaseYear: 2024 } },
    ];

    getPublishableOrderedEntries(original, compareGames);
    buildNavigableEntries(original, compareGames);

    assert.deepEqual(
      original.map((g) => g.id),
      ['g-1', 'g-2'],
    );
  });
});

describe('content-navigation — Exclusão de demonstrativos/rascunhos e casos de borda', () => {
  const mixedGames: NavigableEntry<YearTitledData>[] = [
    {
      id: 'real-1',
      data: { title: 'Jogo 2024', releaseYear: 2024, isDemo: false },
    },
    {
      id: 'demo-mid',
      data: { title: 'Jogo Demo', releaseYear: 2023, isDemo: true },
    },
    {
      id: 'draft-mid',
      data: { title: 'Jogo Rascunho', releaseYear: 2022, draft: true },
    },
    { id: 'real-2', data: { title: 'Jogo 2021', releaseYear: 2021 } },
    { id: 'real-3', data: { title: 'Jogo 2020', releaseYear: 2020 } },
  ];

  it('deve excluir isDemo e draft dos links anterior/próximo entre registros reais', () => {
    const paths = buildNavigableEntries(mixedGames, compareGames);
    const byId = new Map(paths.map((item) => [item.entry.id, item]));

    // Primeiro real: prev null, next pula demo e draft direto para real-2
    assert.equal(byId.get('real-1')?.prev, null);
    assert.equal(byId.get('real-1')?.next?.id, 'real-2');
    assert.equal(byId.get('real-1')?.index, 0);
    assert.equal(byId.get('real-1')?.total, 3);

    // Intermediário real: prev real-1, next real-3
    assert.equal(byId.get('real-2')?.prev?.id, 'real-1');
    assert.equal(byId.get('real-2')?.next?.id, 'real-3');

    // Último real: prev real-2, next null
    assert.equal(byId.get('real-3')?.prev?.id, 'real-2');
    assert.equal(byId.get('real-3')?.next, null);
  });

  it('deve preservar rotas demonstrativas/rascunho em buildNavigableEntries com prev e next nulos', () => {
    const paths = buildNavigableEntries(mixedGames, compareGames);
    const demoItem = paths.find((item) => item.entry.id === 'demo-mid');
    const draftItem = paths.find((item) => item.entry.id === 'draft-mid');

    assert.ok(demoItem, 'rota demonstrativa deve ser preservada');
    assert.equal(demoItem.prev, null);
    assert.equal(demoItem.next, null);
    assert.equal(demoItem.index, -1);

    assert.ok(draftItem, 'rota de rascunho deve ser preservada');
    assert.equal(draftItem.prev, null);
    assert.equal(draftItem.next, null);
  });

  it('deve tratar corretamente coleção com item único publicável', () => {
    const singleArticle: NavigableEntry<ArticleNavData>[] = [
      {
        id: 'por-que-escolhi-fedora',
        data: {
          title: 'Por que escolhi Fedora',
          publishedAt: new Date('2026-11-12T00:00:00Z'),
          isDemo: false,
        },
      },
      {
        id: 'artigo-demo',
        data: {
          title: 'Artigo Demo',
          publishedAt: new Date('2026-11-15T00:00:00Z'),
          isDemo: true,
        },
      },
    ];

    const adj = getAdjacentEntries(
      singleArticle,
      'por-que-escolhi-fedora',
      compareArticles,
    );
    assert.equal(adj.prev, null);
    assert.equal(adj.next, null);
    assert.equal(adj.index, 0);
    assert.equal(adj.total, 1);
  });

  it('deve tratar coleção vazia e id inexistente sem lançar erro', () => {
    const empty = getAdjacentEntries<NavigableEntry<YearTitledData>>(
      [],
      'nao-existe',
      compareGames,
    );
    assert.deepEqual(empty, { prev: null, next: null, index: -1, total: 0 });

    const missing = getAdjacentEntries(mixedGames, 'nao-existe', compareGames);
    assert.deepEqual(missing, { prev: null, next: null, index: -1, total: 3 });
  });
});
