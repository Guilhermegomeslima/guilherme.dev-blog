/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildTableOfContents } from './editorial-docs.ts';
import {
  compareLinuxDiary,
  countLinuxDiaryByCategory,
  filterLinuxDiaryEntries,
  LINUX_DIARY_CATEGORIES,
  LINUX_DIARY_CATEGORY_ORDER,
  selectRelatedDiaryEntries,
  syncHeadingIdsWithToc,
  type LinuxDiaryEntryLike,
} from './linux-diary.ts';
import { linuxEnvironmentSpec } from '../data/linuxEnvironment.ts';

const sampleEntries: LinuxDiaryEntryLike[] = [
  {
    id: 'personalizacao-gnome',
    data: {
      title: 'Como personalizo meu GNOME',
      description: 'Extensões Dash to Dock, Blur my Shell e ArcMenu no Fedora.',
      category: 'configuracoes',
      tags: ['GNOME', 'Fedora', 'Extensões'],
      publishedAt: new Date('2026-11-20'),
      relatedSlugs: ['comandos-dnf'],
    },
  },
  {
    id: 'comandos-dnf',
    data: {
      title: 'Guia prático de DNF',
      description: 'Gerenciamento de pacotes e atualizações no Fedora.',
      category: 'comandos',
      tags: ['Fedora', 'DNF'],
      publishedAt: new Date('2026-11-10'),
    },
  },
  {
    id: 'zram-fedora',
    data: {
      title: 'Entendendo ZRAM no Fedora',
      description: 'Configuração de memória compactada em notebooks.',
      category: 'configuracoes',
      tags: ['Fedora', 'Memória'],
      publishedAt: new Date('2026-11-15'),
    },
  },
  {
    id: 'steam-proton',
    data: {
      title: 'Jogando com Steam e Proton',
      description: 'Compatibilidade de jogos no Linux.',
      category: 'tutoriais',
      tags: ['Steam', 'Jogos'],
      publishedAt: new Date('2026-11-05'),
    },
  },
];

describe('linux-diary — Categorias, ordenação, filtros e pesquisa local (EXP-04A)', () => {
  it('deve declarar exatamente as 6 categorias oficiais', () => {
    assert.deepEqual(LINUX_DIARY_CATEGORY_ORDER, [
      'tutoriais',
      'configuracoes',
      'relatos',
      'solucoes',
      'programas',
      'comandos',
    ]);
    assert.equal(LINUX_DIARY_CATEGORIES.tutoriais.label, 'Tutoriais');
    assert.equal(
      LINUX_DIARY_CATEGORIES.configuracoes.label,
      'Configurações do sistema',
    );
    assert.equal(LINUX_DIARY_CATEGORIES.relatos.label, 'Relatos pessoais');
    assert.equal(
      LINUX_DIARY_CATEGORIES.solucoes.label,
      'Soluções de problemas',
    );
    assert.equal(
      LINUX_DIARY_CATEGORIES.programas.label,
      'Recomendações de programas',
    );
    assert.equal(LINUX_DIARY_CATEGORIES.comandos.label, 'Comandos e scripts');
  });

  it('deve ordenar por data decrescente e contar por categoria', () => {
    const sorted = [...sampleEntries].sort(compareLinuxDiary).map((e) => e.id);
    assert.deepEqual(sorted, [
      'personalizacao-gnome',
      'zram-fedora',
      'comandos-dnf',
      'steam-proton',
    ]);

    const counts = countLinuxDiaryByCategory(sampleEntries);
    assert.equal(counts.all, 4);
    assert.equal(counts.configuracoes, 2);
    assert.equal(counts.comandos, 1);
    assert.equal(counts.tutoriais, 1);
    assert.equal(counts.relatos, 0);
  });

  it('deve filtrar combinando categoria e busca sem sensibilidade a acentos/maiúsculas', () => {
    // Busca por tag com acento removido ("extensoes")
    const byTag = filterLinuxDiaryEntries(sampleEntries, {
      query: 'extensoes fedora',
    });
    assert.deepEqual(
      byTag.map((e) => e.id),
      ['personalizacao-gnome'],
    );

    // Combinação de categoria + busca
    const combined = filterLinuxDiaryEntries(sampleEntries, {
      category: 'configuracoes',
      query: 'memoria',
    });
    assert.deepEqual(
      combined.map((e) => e.id),
      ['zram-fedora'],
    );

    // Estado vazio quando não há correspondência
    const empty = filterLinuxDiaryEntries(sampleEntries, {
      category: 'solucoes',
      query: 'gnome',
    });
    assert.equal(empty.length, 0);
  });

  it('deve priorizar relacionados manuais e completar automaticamente sem duplicatas', () => {
    const related = selectRelatedDiaryEntries(
      sampleEntries[0],
      sampleEntries,
      3,
    );
    assert.deepEqual(
      related.map((e) => e.id),
      ['comandos-dnf', 'zram-fedora'],
    );
  });
});

describe('linux-diary — Sincronização de âncoras do sumário e publicação segura (EXP-04A)', () => {
  it('syncHeadingIdsWithToc deve garantir correspondência 1:1 entre TOC e IDs do HTML', () => {
    const toc = buildTableOfContents([
      { depth: 2, slug: 'instalacao', text: 'Instalação' },
      { depth: 3, slug: 'instalacao', text: 'Instalação' },
      { depth: 2, slug: '', text: 'Considerações Finais' },
    ]);

    const rawHtml =
      '<h2 id="instalacao">Instalação</h2><p>Texto</p>' +
      '<h3 id="instalacao">Instalação</h3><p>Sub</p>' +
      '<h2>Considerações Finais</h2>';

    const synced = syncHeadingIdsWithToc(rawHtml, toc);
    assert.ok(synced.includes('<h2 id="instalacao">Instalação</h2>'));
    assert.ok(synced.includes('<h3 id="instalacao-2">Instalação</h3>'));
    assert.ok(
      synced.includes(
        '<h2 id="consideracoes-finais">Considerações Finais</h2>',
      ),
    );
  });

  it('Meu ambiente deve permanecer sem dados presumidos até confirmação editorial', () => {
    assert.equal(linuxEnvironmentSpec.confirmed, false);
    const totalItems = linuxEnvironmentSpec.sections.reduce(
      (sum, section) => sum + section.items.length,
      0,
    );
    assert.equal(totalItems, 0);
  });

  it('a rota src/pages/diario-linux/[...slug].astro deve estar protegida por shouldGenerateSectionRoute', () => {
    const routeSrc = fs.readFileSync(
      path.resolve('src/pages/diario-linux/[...slug].astro'),
      'utf-8',
    );
    assert.ok(routeSrc.includes("shouldGenerateSectionRoute('linuxDiary')"));
    assert.ok(routeSrc.includes("shouldIncludeEntry('linuxDiary'"));
  });
});
