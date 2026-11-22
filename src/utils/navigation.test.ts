/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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

  it('em builds públicos (flags=false), deve ocultar Resenhas, Diário Linux e Recomendações', () => {
    const publicEnv = {};
    const primary = getVisiblePrimaryNavLinks(publicEnv);
    const groups = getVisibleNavDropdownGroups(publicEnv);

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

  it('na prévia local (PREVIEW_EXPANSION=true fora de CI), deve exibir a navegação completa', () => {
    const previewEnv = { PREVIEW_EXPANSION: 'true' };
    const primary = getVisiblePrimaryNavLinks(previewEnv);
    const groups = getVisibleNavDropdownGroups(previewEnv);

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

  it('em CI/Vercel/GitHub Actions, nunca deve expor rotas não publicadas mesmo com PREVIEW_EXPANSION=true', () => {
    for (const hostedEnv of [
      { PREVIEW_EXPANSION: 'true', VERCEL: '1' },
      { PREVIEW_EXPANSION: 'true', GITHUB_ACTIONS: 'true' },
    ]) {
      const primary = getVisiblePrimaryNavLinks(hostedEnv);
      assert.ok(!primary.some((i) => i.href === '/resenhas/'));

      const groups = getVisibleNavDropdownGroups(hostedEnv);
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
