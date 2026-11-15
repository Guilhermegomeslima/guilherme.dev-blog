/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { withBase } from './base.ts';

describe('withBase — Resolução de URLs relativas e prefixo de base do Astro', () => {
  describe('Preservação de destinos que não devem receber prefixo', () => {
    it('deve preservar URLs externas http e https', () => {
      assert.equal(
        withBase('https://github.com/Guilhermegomeslima'),
        'https://github.com/Guilhermegomeslima',
      );
      assert.equal(
        withBase('http://exemplo.com/recurso'),
        'http://exemplo.com/recurso',
      );
    });

    it('deve preservar links de âncora internos da página', () => {
      assert.equal(withBase('#top'), '#top');
      assert.equal(withBase('#main-content'), '#main-content');
    });
  });

  describe('Resolução no ambiente principal / raiz (Vercel e local: base "/")', () => {
    it('deve resolver a raiz sem gerar barra dupla', () => {
      assert.equal(withBase('/', '/'), '/');
    });

    it('deve resolver caminhos com barra inicial', () => {
      assert.equal(withBase('/sobre/', '/'), '/sobre/');
      assert.equal(withBase('/jogos/', '/'), '/jogos/');
      assert.equal(
        withBase('/images/home/hero.webp', '/'),
        '/images/home/hero.webp',
      );
    });

    it('deve garantir barra inicial mesmo se o caminho for fornecido sem barra', () => {
      assert.equal(withBase('sobre', '/'), '/sobre');
      assert.equal(withBase('artigos/ensaio', '/'), '/artigos/ensaio');
    });
  });

  describe('Resolução no ambiente espelho (GitHub Pages: base "/guilherme.dev-blog/")', () => {
    const ghpBase = '/guilherme.dev-blog/';

    it('deve prefixar a raiz corretamente com trailing slash', () => {
      assert.equal(withBase('/', ghpBase), '/guilherme.dev-blog/');
    });

    it('deve prefixar páginas internas e coleções', () => {
      assert.equal(withBase('/sobre/', ghpBase), '/guilherme.dev-blog/sobre/');
      assert.equal(
        withBase('/artigos/por-que-escolhi-fedora/', ghpBase),
        '/guilherme.dev-blog/artigos/por-que-escolhi-fedora/',
      );
      assert.equal(
        withBase('/galeria/wallpapers/', ghpBase),
        '/guilherme.dev-blog/galeria/wallpapers/',
      );
    });

    it('deve prefixar ativos estáticos locais (imagens, fontes, favicons)', () => {
      assert.equal(
        withBase('/favicon.svg', ghpBase),
        '/guilherme.dev-blog/favicon.svg',
      );
      assert.equal(
        withBase('/images/articles/fedora.jpg', ghpBase),
        '/guilherme.dev-blog/images/articles/fedora.jpg',
      );
      assert.equal(
        withBase('/fonts/inter-latin.woff2', ghpBase),
        '/guilherme.dev-blog/fonts/inter-latin.woff2',
      );
    });

    it('não deve gerar barras duplas quando a base tiver barra final', () => {
      const result = withBase('/opensource/', '/guilherme.dev-blog/');
      assert.equal(result, '/guilherme.dev-blog/opensource/');
      assert.ok(!result.includes('//'));
    });
  });
});
