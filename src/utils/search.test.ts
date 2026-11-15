/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSearchText, matchesSearchTerms } from './search.ts';

describe('normalizeSearchText — Normalização de texto para busca', () => {
  it('deve converter para minúsculas', () => {
    assert.equal(
      normalizeSearchText('FEDORA WORKSTATION'),
      'fedora workstation',
    );
    assert.equal(normalizeSearchText('God of War II'), 'god of war ii');
  });

  it('deve remover todos os tipos de acentos e diacríticos em português', () => {
    assert.equal(
      normalizeSearchText('Ação & Ficção Científica'),
      'acao & ficcao cientifica',
    );
    assert.equal(normalizeSearchText('Céu e Inferno'), 'ceu e inferno');
    assert.equal(normalizeSearchText('O Poderoso Chefão'), 'o poderoso chefao');
    assert.equal(
      normalizeSearchText('Túmulo dos Vagalumes'),
      'tumulo dos vagalumes',
    );
    assert.equal(normalizeSearchText('Ética a Nicômaco'), 'etica a nicomaco');
    assert.equal(
      normalizeSearchText('A Força do Silêncio'),
      'a forca do silencio',
    );
    assert.equal(
      normalizeSearchText('O Livro dos Cinco Anéis'),
      'o livro dos cinco aneis',
    );
    assert.equal(
      normalizeSearchText('Napoleão Bonaparte'),
      'napoleao bonaparte',
    );
    assert.equal(normalizeSearchText('Álbuns e Músicas'), 'albuns e musicas');
    assert.equal(
      normalizeSearchText('Emulação & Multimídia'),
      'emulacao & multimidia',
    );
  });

  it('deve colapsar espaços extras e remover espaços nas extremidades', () => {
    assert.equal(normalizeSearchText('   god    of    war   '), 'god of war');
    assert.equal(
      normalizeSearchText('\t  akira   kurosawa \n'),
      'akira kurosawa',
    );
  });

  it('deve tratar strings vazias, nulas ou indefinidas', () => {
    assert.equal(normalizeSearchText(''), '');
    assert.equal(normalizeSearchText(null), '');
    assert.equal(normalizeSearchText(undefined), '');
  });
});

describe('matchesSearchTerms — Correspondência de busca flexível', () => {
  it('deve retornar true quando a query for vazia ou contiver apenas espaços', () => {
    assert.equal(matchesSearchTerms('Qualquer Título', ''), true);
    assert.equal(matchesSearchTerms('Qualquer Título', '   '), true);
  });

  it('deve retornar false quando o alvo for vazio e a query tiver conteúdo', () => {
    assert.equal(matchesSearchTerms('', 'termo'), false);
    assert.equal(matchesSearchTerms(null, 'termo'), false);
    assert.equal(matchesSearchTerms(undefined, 'termo'), false);
  });

  it('deve encontrar títulos mesmo quando a busca não contém acentos', () => {
    assert.equal(matchesSearchTerms('O Poderoso Chefão', 'chefao'), true);
    assert.equal(matchesSearchTerms('Céu e Inferno', 'ceu'), true);
    assert.equal(matchesSearchTerms('Túmulo dos Vagalumes', 'tumulo'), true);
    assert.equal(
      matchesSearchTerms('A Revolução dos Bichos', 'revolucao'),
      true,
    );
    assert.equal(matchesSearchTerms('Ética a Nicômaco', 'etica'), true);
    assert.equal(matchesSearchTerms('A Força do Silêncio', 'forca'), true);
    assert.equal(matchesSearchTerms('Castelo no Japão', 'japao'), true);
    assert.equal(matchesSearchTerms('Jogos & Emulação', 'emulacao'), true);
  });

  it('deve encontrar títulos quando a busca contém acentos mas o alvo está em maiúsculas/minúsculas', () => {
    assert.equal(matchesSearchTerms('o poderoso chefao', 'Chefão'), true);
    assert.equal(matchesSearchTerms('ceu e inferno', 'CÉU'), true);
  });

  it('deve corresponder a múltiplos termos separados por espaços em qualquer ordem', () => {
    assert.equal(
      matchesSearchTerms('GTA San Andreas — Rockstar Games', 'san andreas'),
      true,
    );
    assert.equal(
      matchesSearchTerms('GTA San Andreas — Rockstar Games', 'andreas gta'),
      true,
    );
    assert.equal(
      matchesSearchTerms(
        'Akira Kurosawa — Os Sete Samurais',
        'kurosawa samurais',
      ),
      true,
    );
    assert.equal(
      matchesSearchTerms('George Orwell — 1984', 'orwell 1984'),
      true,
    );
  });

  it('deve tolerar múltiplos espaços entre os termos da busca', () => {
    assert.equal(matchesSearchTerms('God of War II', 'god   war'), true);
  });

  it('deve retornar false se qualquer termo da busca não estiver presente', () => {
    assert.equal(matchesSearchTerms('God of War II', 'god zelda'), false);
    assert.equal(
      matchesSearchTerms('O Poderoso Chefão', 'chefao spielberg'),
      false,
    );
  });
});

describe('Simulação de Filtros e Ordenação de Catálogos (QLT-01 & QLT-02)', () => {
  const mockGames = [
    {
      title: 'God of War II',
      genre: 'Ação e Aventura',
      developer: 'Santa Monica Studio',
      platform: 'PlayStation 2',
      status: 'Platinado',
      year: 2007,
      score: 98,
    },
    {
      title: 'Shinobido: Way of the Ninja',
      genre: 'Ação / Furtividade',
      developer: 'Acquire',
      platform: 'PlayStation 2',
      status: 'Platinado',
      year: 2005,
      score: 88,
    },
    {
      title: 'Hollow Knight',
      genre: 'Metroidvania',
      developer: 'Team Cherry',
      platform: 'PC (Fedora Linux)',
      status: 'Jogando',
      year: 2017,
      score: 96,
    },
    {
      title: 'Hearts of Iron IV',
      genre: 'Grande Estratégia',
      developer: 'Paradox Development Studio',
      platform: 'PC (Fedora Linux)',
      status: 'Parado',
      year: 2016,
      score: 82,
    },
  ];

  it('deve combinar busca com filtro de status e plataforma', () => {
    const result = mockGames.filter((g) => {
      const matchStatus = g.status === 'Platinado';
      const matchPlatform = g.platform === 'PlayStation 2';
      const matchQuery = matchesSearchTerms(
        `${g.title} ${g.genre} ${g.developer}`,
        'acao',
      );
      return matchStatus && matchPlatform && matchQuery;
    });

    assert.equal(result.length, 2);
    assert.equal(result[0]!.title, 'God of War II');
    assert.equal(result[1]!.title, 'Shinobido: Way of the Ninja');
  });

  it('deve ordenar jogos corretamente por score decrescente e crescente', () => {
    const desc = [...mockGames].sort((a, b) => b.score - a.score);
    assert.equal(desc[0]!.title, 'God of War II');
    assert.equal(desc[desc.length - 1]!.title, 'Hearts of Iron IV');

    const asc = [...mockGames].sort((a, b) => a.score - b.score);
    assert.equal(asc[0]!.title, 'Hearts of Iron IV');
    assert.equal(asc[asc.length - 1]!.title, 'God of War II');
  });

  it('deve ordenar jogos corretamente por ano decrescente e crescente', () => {
    const desc = [...mockGames].sort((a, b) => b.year - a.year);
    assert.equal(desc[0]!.year, 2017);

    const asc = [...mockGames].sort((a, b) => a.year - b.year);
    assert.equal(asc[0]!.year, 2005);
  });

  it('deve ordenar alfabeticamente com suporte a pt-BR', () => {
    const titles = ['Época', 'Água', 'Zebra', 'Ação', 'Bola'];
    const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    assert.deepEqual(sorted, ['Ação', 'Água', 'Bola', 'Época', 'Zebra']);
  });

  it('deve retornar lista vazia (empty state) para buscas sem correspondência', () => {
    const result = mockGames.filter((g) =>
      matchesSearchTerms(
        `${g.title} ${g.genre} ${g.developer}`,
        'termoinexistente999',
      ),
    );
    assert.equal(result.length, 0);
  });
});
