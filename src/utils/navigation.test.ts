/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getVisibleNavDropdownGroups,
  getVisiblePrimaryNavLinks,
  isDropdownGroupActive,
  isNavRouteActive,
  NAV_DROPDOWN_GROUPS,
  normalizeNavPath,
  PRIMARY_NAV_LINKS,
} from '../data/navigation.ts';

describe('navigation — Estrutura e filtragem segura do Header 2.0 (EXP-06A)', () => {
  it('deve declarar exatamente os 6 links principais na ordem oficial', () => {
    assert.deepEqual(
      PRIMARY_NAV_LINKS.map((item) => item.label),
      ['Home', 'Sobre', 'Projetos', 'Linux', 'Artigos', 'Resenhas'],
    );
  });

  it('deve declarar os 3 grupos dropdown e seus 8 destinos oficiais sem duplicações', () => {
    assert.deepEqual(
      NAV_DROPDOWN_GROUPS.map((g) => g.label),
      ['Cultura', 'Tecnologia', 'Acervo'],
    );
    assert.deepEqual(
      NAV_DROPDOWN_GROUPS[0].items.map((i) => i.label),
      ['Jogos', 'Filmes', 'Música', 'Livros'],
    );
    assert.deepEqual(
      NAV_DROPDOWN_GROUPS[1].items.map((i) => i.label),
      ['Diário Linux', 'Open Source'],
    );
    assert.deepEqual(
      NAV_DROPDOWN_GROUPS[2].items.map((i) => i.label),
      ['Recomendações', 'Galeria'],
    );
  });

  it('quando flags estiverem desativadas, deve ocultar Resenhas, Diário Linux e Recomendações', () => {
    const publicEnv = {};
    const allDisabled = {
      reviews: false,
      linuxDiary: false,
      recommendations: false,
    } as const;
    const primary = getVisiblePrimaryNavLinks(publicEnv, allDisabled);
    const groups = getVisibleNavDropdownGroups(publicEnv, allDisabled);

    assert.deepEqual(
      primary.map((i) => i.label),
      ['Home', 'Sobre', 'Projetos', 'Linux', 'Artigos'],
    );
    assert.deepEqual(
      groups.find((g) => g.id === 'cultura')?.items.map((i) => i.label),
      ['Jogos', 'Filmes', 'Música', 'Livros'],
    );
    assert.deepEqual(
      groups.find((g) => g.id === 'tecnologia')?.items.map((i) => i.label),
      ['Open Source'],
    );
    assert.deepEqual(
      groups.find((g) => g.id === 'acervo')?.items.map((i) => i.label),
      ['Galeria'],
    );
  });

  it('com as três flags liberadas (EXP-07C), deve exibir a navegação completa mesmo sem PREVIEW_EXPANSION', () => {
    const prodEnv = { VERCEL: '1' };
    const primary = getVisiblePrimaryNavLinks(prodEnv);
    const groups = getVisibleNavDropdownGroups(prodEnv);

    assert.deepEqual(
      primary.map((i) => i.label),
      ['Home', 'Sobre', 'Projetos', 'Linux', 'Artigos', 'Resenhas'],
    );
    assert.deepEqual(
      groups.find((g) => g.id === 'tecnologia')?.items.map((i) => i.label),
      ['Diário Linux', 'Open Source'],
    );
    assert.deepEqual(
      groups.find((g) => g.id === 'acervo')?.items.map((i) => i.label),
      ['Recomendações', 'Galeria'],
    );
  });

  it('na prévia local (PREVIEW_EXPANSION=true fora de CI), deve exibir a navegação completa mesmo com flags false', () => {
    const previewEnv = { PREVIEW_EXPANSION: 'true' };
    const allDisabled = {
      reviews: false,
      linuxDiary: false,
      recommendations: false,
    } as const;
    const primary = getVisiblePrimaryNavLinks(previewEnv, allDisabled);
    const groups = getVisibleNavDropdownGroups(previewEnv, allDisabled);

    assert.deepEqual(
      primary.map((i) => i.label),
      ['Home', 'Sobre', 'Projetos', 'Linux', 'Artigos', 'Resenhas'],
    );
    assert.deepEqual(
      groups.find((g) => g.id === 'tecnologia')?.items.map((i) => i.label),
      ['Diário Linux', 'Open Source'],
    );
    assert.deepEqual(
      groups.find((g) => g.id === 'acervo')?.items.map((i) => i.label),
      ['Recomendações', 'Galeria'],
    );
  });

  it('em CI/Vercel/GitHub Actions, nunca deve expor rotas com flag=false mesmo com PREVIEW_EXPANSION=true', () => {
    const allDisabled = {
      reviews: false,
      linuxDiary: false,
      recommendations: false,
    } as const;
    for (const hostedEnv of [
      { PREVIEW_EXPANSION: 'true', VERCEL: '1' },
      { PREVIEW_EXPANSION: 'true', GITHUB_ACTIONS: 'true' },
    ]) {
      const primary = getVisiblePrimaryNavLinks(hostedEnv, allDisabled);
      assert.ok(!primary.some((i) => i.href === '/resenhas/'));

      const groups = getVisibleNavDropdownGroups(hostedEnv, allDisabled);
      const allDropdownHrefs = groups.flatMap((g) =>
        g.items.map((i) => i.href),
      );
      assert.ok(!allDropdownHrefs.includes('/diario-linux/'));
      assert.ok(!allDropdownHrefs.includes('/recomendacoes/'));
    }
  });
});

describe('navigation — Detecção de rota ativa na Vercel e no GitHub Pages (EXP-06A)', () => {
  it('deve normalizar caminhos removendo base URL e barras finais', () => {
    assert.equal(normalizeNavPath('/', '/'), '/');
    assert.equal(normalizeNavPath('/jogos/', '/'), '/jogos');
    assert.equal(
      normalizeNavPath('/guilherme.dev-blog/', '/guilherme.dev-blog/'),
      '/',
    );
    assert.equal(
      normalizeNavPath(
        '/guilherme.dev-blog/jogos/shinobido-the-way-of-the-ninja/',
        '/guilherme.dev-blog/',
      ),
      '/jogos/shinobido-the-way-of-the-ninja',
    );
  });

  it('deve identificar corretamente rotas exatas, subrotas e grupos dropdown ativos', () => {
    assert.equal(isNavRouteActive('/', '/'), true);
    assert.equal(isNavRouteActive('/sobre/', '/'), false);
    assert.equal(
      isNavRouteActive('/artigos/por-que-escolhi-fedora/', '/artigos/'),
      true,
    );
    assert.equal(
      isNavRouteActive(
        '/guilherme.dev-blog/jogos/shinobido-the-way-of-the-ninja/',
        '/jogos/',
        '/guilherme.dev-blog/',
      ),
      true,
    );

    const cultura = NAV_DROPDOWN_GROUPS.find((g) => g.id === 'cultura')!;
    const tecnologia = NAV_DROPDOWN_GROUPS.find((g) => g.id === 'tecnologia')!;

    assert.equal(
      isDropdownGroupActive('/jogos/shinobido-the-way-of-the-ninja/', cultura),
      true,
    );
    assert.equal(
      isDropdownGroupActive(
        '/jogos/shinobido-the-way-of-the-ninja/',
        tecnologia,
      ),
      false,
    );
    assert.equal(
      isDropdownGroupActive(
        '/guilherme.dev-blog/diario-linux/meu-ambiente/',
        tecnologia,
        '/guilherme.dev-blog/',
      ),
      true,
    );
  });
});

describe('navigation — Imagens e alinhamento estrutural dos dropdowns (EXP-06B)', () => {
  it('todos os 8 destinos dos dropdowns devem possuir imagem existente em public/', () => {
    const allItems = NAV_DROPDOWN_GROUPS.flatMap((g) => g.items);
    assert.equal(allItems.length, 8);

    for (const item of allItems) {
      assert.ok(item.image?.src, `Imagem ausente para ${item.label}`);
      const diskPath = path.resolve(
        'public',
        item.image.src.replace(/^\//, ''),
      );
      assert.ok(
        fs.existsSync(diskPath),
        `Arquivo de imagem ausente em public/: ${item.image.src}`,
      );
    }
  });

  it('HeaderDropdown.astro deve ancorar todos os painéis pela mesma borda direita e largura consistente', () => {
    const dropdownSrc = fs.readFileSync(
      path.resolve('src/components/layout/HeaderDropdown.astro'),
      'utf-8',
    );
    assert.ok(
      !dropdownSrc.includes('<li class="relative" data-header-dropdown'),
      'O <li> do dropdown não deve ser relative para que os 3 painéis compartilhem a borda direita do header',
    );
    assert.ok(dropdownSrc.includes('xl:right-[4.5rem]'));
    assert.ok(dropdownSrc.includes('w-[480px]'));
  });
});
