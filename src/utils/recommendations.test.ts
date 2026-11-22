/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  compareRecommendations,
  countRecommendationsByCategory,
  countRecommendationsByStatus,
  filterRecommendations,
  RECOMMENDATION_CATEGORIES,
  RECOMMENDATION_CATEGORY_ORDER,
  RECOMMENDATION_KIND_LABELS,
  RECOMMENDATION_STATUS_ORDER,
  RECOMMENDATION_STATUSES,
  shouldShowCurrentlyUsingBadge,
  type RecommendationEntryLike,
} from './recommendations.ts';

const sampleEntries: RecommendationEntryLike[] = [
  {
    id: 'item-b',
    data: {
      name: 'Editora Exemplo',
      kind: 'editora',
      category: 'livros_editoras',
      status: 'ja_utilizei',
      currentlyUsing: false,
      order: 2,
    },
  },
  {
    id: 'item-a',
    data: {
      name: 'Fone Exemplo',
      kind: 'produto',
      category: 'audio_perifericos',
      status: 'ja_utilizei',
      currentlyUsing: true,
      order: 1,
    },
  },
  {
    id: 'item-c',
    data: {
      name: 'Teclado Pesquisado',
      kind: 'produto',
      category: 'audio_perifericos',
      status: 'pesquisado',
      currentlyUsing: false,
      addedAt: new Date('2026-11-20'),
    },
  },
  {
    id: 'item-d',
    data: {
      name: 'Box Lista de Interesse',
      kind: 'colecao',
      category: 'livros_editoras',
      status: 'lista_interesse',
      currentlyUsing: false,
      addedAt: new Date('2026-11-10'),
    },
  },
];

describe('recommendations — Categorias, status, ordenação e filtros (EXP-05A)', () => {
  it('deve declarar categorias, status e tipos oficiais conforme especificação', () => {
    assert.deepEqual(RECOMMENDATION_CATEGORY_ORDER, [
      'audio_perifericos',
      'livros_editoras',
    ]);
    assert.equal(
      RECOMMENDATION_CATEGORIES.audio_perifericos.label,
      'Áudio e periféricos',
    );
    assert.equal(
      RECOMMENDATION_CATEGORIES.livros_editoras.label,
      'Livros e editoras',
    );

    assert.deepEqual(RECOMMENDATION_STATUS_ORDER, [
      'ja_utilizei',
      'pesquisado',
      'lista_interesse',
    ]);
    assert.equal(RECOMMENDATION_STATUSES.ja_utilizei.isDirectExperience, true);
    assert.equal(RECOMMENDATION_STATUSES.pesquisado.isDirectExperience, false);
    assert.equal(
      RECOMMENDATION_STATUSES.lista_interesse.isDirectExperience,
      false,
    );
    assert.equal(RECOMMENDATION_KIND_LABELS.editora, 'Editora');
    assert.equal(RECOMMENDATION_KIND_LABELS.produto, 'Produto');
  });

  it('deve respeitar veracidade do selo "Uso atualmente" apenas para ja_utilizei', () => {
    assert.equal(shouldShowCurrentlyUsingBadge('ja_utilizei', true), true);
    assert.equal(shouldShowCurrentlyUsingBadge('ja_utilizei', false), false);
    assert.equal(shouldShowCurrentlyUsingBadge('pesquisado', true), false);
    assert.equal(shouldShowCurrentlyUsingBadge('lista_interesse', true), false);
  });

  it('deve ordenar por addedAt descendente e usar order ascendente como desempate', () => {
    const sorted = [...sampleEntries]
      .sort(compareRecommendations)
      .map((e) => e.id);
    assert.deepEqual(sorted, ['item-c', 'item-d', 'item-a', 'item-b']);
  });

  it('deve contar corretamente por categoria e por status', () => {
    const byCategory = countRecommendationsByCategory(sampleEntries);
    assert.deepEqual(byCategory, {
      all: 4,
      audio_perifericos: 2,
      livros_editoras: 2,
    });

    const byStatus = countRecommendationsByStatus(sampleEntries);
    assert.deepEqual(byStatus, {
      all: 4,
      ja_utilizei: 2,
      pesquisado: 1,
      lista_interesse: 1,
    });
  });

  it('deve filtrar combinando categoria e status e suportar estado vazio', () => {
    const audioUsed = filterRecommendations(sampleEntries, {
      category: 'audio_perifericos',
      status: 'ja_utilizei',
    });
    assert.deepEqual(
      audioUsed.map((e) => e.id),
      ['item-a'],
    );

    const empty = filterRecommendations(sampleEntries, {
      category: 'audio_perifericos',
      status: 'lista_interesse',
    });
    assert.equal(empty.length, 0);
  });
});

describe('recommendations — Proteção de publicação segura e integridade (EXP-05A)', () => {
  it('a rota src/pages/recomendacoes/[...slug].astro deve estar protegida por editorial-flags', () => {
    const routeSrc = fs.readFileSync(
      path.resolve('src/pages/recomendacoes/[...slug].astro'),
      'utf-8',
    );
    assert.ok(
      routeSrc.includes("shouldGenerateSectionRoute('recommendations')"),
    );
    assert.ok(routeSrc.includes("shouldIncludeEntry('recommendations'"));
  });

  it('src/content/recommendations deve permanecer sem entradas fictícias na EXP-05A', () => {
    const dir = path.resolve('src/content/recommendations');
    const jsonFiles = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith('.json'));
    assert.equal(
      jsonFiles.length,
      0,
      `Nenhuma entrada deve ser adicionada na EXP-05A: ${jsonFiles.join(', ')}`,
    );
  });
});
