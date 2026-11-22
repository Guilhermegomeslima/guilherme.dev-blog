/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildTableOfContents,
  enhanceTechnicalHtml,
} from './editorial-docs.ts';
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

  it('Meu ambiente deve conter apenas dados aprovados, sem informações privadas ou ferramentas não solicitadas', () => {
    assert.equal(linuxEnvironmentSpec.confirmed, true);
    assert.equal(linuxEnvironmentSpec.lastVerifiedAt, 'Novembro de 2026');
    assert.equal(linuxEnvironmentSpec.sections.length, 5);

    assert.ok(
      linuxEnvironmentSpec.coverImage,
      'Cover image deve estar definida',
    );
    const coverDiskPath = path.resolve(
      'public',
      linuxEnvironmentSpec.coverImage.url.replace(/^\//, ''),
    );
    assert.ok(fs.existsSync(coverDiskPath), 'Cover image ausente em public/');

    const serialized = JSON.stringify(linuxEnvironmentSpec);
    for (const forbidden of [
      'Ggl-fedora',
      'guigl',
      '/home/',
      'X1502ZA.315',
      'MZVL81T0HDLB',
      'sistema-sobre-fedora-gnome.webp',
      'Python',
      'GCC',
      'Podman',
    ]) {
      assert.ok(
        !serialized.includes(forbidden),
        `Informação proibida ou não aprovada encontrada em linuxEnvironmentSpec: ${forbidden}`,
      );
    }

    for (const expected of [
      'ASUS Vivobook 15 X1502ZA',
      'Intel Core i3-1220P',
      'Intel UHD Graphics',
      '20 GiB',
      'SSD Samsung NVMe de 1 TB',
      'Fedora Workstation 45',
      'GNOME Shell 51.1',
      'Wayland',
      '8 GiB',
      'lzo-rle',
      '70%',
      'Visual Studio Code',
      'Antigravity',
      'Terminal Ptyxis',
    ]) {
      assert.ok(
        serialized.includes(expected),
        `Informação aprovada ausente em linuxEnvironmentSpec: ${expected}`,
      );
    }
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

describe('linux-diary — Integridade do tutorial Como personalizo meu GNOME (EXP-04B.2)', () => {
  const tutorialPath = path.resolve(
    'src/content/linux-diary/como-personalizo-meu-gnome.md',
  );

  it('deve estar liberado (draft: false, isDemo: false) com publishedAt 2026-11-22 e sem updatedAt inventada', () => {
    assert.ok(fs.existsSync(tutorialPath), 'Tutorial GNOME ausente');
    const raw = fs.readFileSync(tutorialPath, 'utf-8');
    const frontmatter = raw.split('---')[1] ?? '';

    assert.match(frontmatter, /\bdraft:\s*false\b/);
    assert.match(frontmatter, /\bisDemo:\s*false\b/);
    assert.match(frontmatter, /\bpublishedAt:\s*2026-11-22/);
    assert.doesNotMatch(
      frontmatter,
      /\bupdatedAt:/,
      'updatedAt não deve ser inventada na estreia',
    );
  });

  it('todas as imagens referenciadas devem existir em public/ e não expor capturas bloqueadas', () => {
    const raw = fs.readFileSync(tutorialPath, 'utf-8');
    const imageRefs = [
      ...raw.matchAll(
        /\/images\/linux-diary\/gnome-personalizacao\/[a-z0-9-]+\.webp/gi,
      ),
    ].map((m) => m[0]);

    const uniqueRefs = [...new Set(imageRefs)];
    assert.equal(
      uniqueRefs.length,
      9,
      `Esperadas 9 imagens únicas integradas, encontradas ${uniqueRefs.length}: ${uniqueRefs.join(', ')}`,
    );

    for (const ref of uniqueRefs) {
      const diskPath = path.resolve('public', ref.replace(/^\//, ''));
      assert.ok(fs.existsSync(diskPath), `Imagem ausente em public/: ${ref}`);
    }

    // Imagens que NÃO podem aparecer no tutorial
    assert.ok(!raw.includes('sistema-sobre-fedora-gnome.webp'));
    assert.ok(!raw.includes('gnome-padrao-overview.webp'));
    assert.ok(!raw.includes('gnome-padrao-desktop.webp'));

    // Nenhum marcador editorial visível fora de comentários HTML
    const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, '');
    assert.doesNotMatch(withoutComments, /\[CAPTURA\s+\d+/i);
    assert.doesNotMatch(withoutComments, /\[IMAGEM DE CAPA/i);
  });

  it('enhanceTechnicalHtml deve adaptar base URL e avisos técnicos para GitHub Pages', () => {
    const sample =
      '<blockquote><p>[!WARNING]\n<strong>Importante:</strong> aviso teste.</p></blockquote>' +
      '<p><img src="/images/linux-diary/gnome-personalizacao/desktop-personalizado-limpo.webp" alt="Desktop" width="1024" height="576" /></p>';
    const enhanced = enhanceTechnicalHtml(sample, {
      base: '/guilherme.dev-blog/',
    });

    assert.ok(enhanced.includes('class="v2-notice v2-notice--warning"'));
    assert.ok(
      enhanced.includes(
        'src="/guilherme.dev-blog/images/linux-diary/gnome-personalizacao/desktop-personalizado-limpo.webp"',
      ),
    );
    assert.ok(enhanced.includes('data-editorial-lightbox-trigger="true"'));
  });
});
