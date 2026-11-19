/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CANONICAL_SITE } from './seo.ts';
import { isAbortError, resolveShareUrl, shareContent } from './share.ts';

describe('resolveShareUrl — Canonicalização de URL para compartilhamento (FRT-03)', () => {
  it('deve resolver caminhos relativos para a URL canônica de produção', () => {
    assert.equal(
      resolveShareUrl('/artigos/por-que-escolhi-fedora/'),
      `${CANONICAL_SITE}/artigos/por-que-escolhi-fedora/`,
    );
    assert.equal(resolveShareUrl('/linux'), `${CANONICAL_SITE}/linux/`);
  });

  it('deve remover prefixo /guilherme.dev-blog e substituir localhost pela origem canônica', () => {
    assert.equal(
      resolveShareUrl('/guilherme.dev-blog/jogos/god-of-war/'),
      `${CANONICAL_SITE}/jogos/god-of-war/`,
    );
    assert.equal(
      resolveShareUrl('http://localhost:4321/filmes/ran/'),
      `${CANONICAL_SITE}/filmes/ran/`,
    );
    assert.equal(
      resolveShareUrl(
        'https://guilhermegomeslima.github.io/guilherme.dev-blog/livros/1984/',
      ),
      `${CANONICAL_SITE}/livros/1984/`,
    );
  });

  it('deve retornar a raiz canônica para entrada vazia ou inválida', () => {
    assert.equal(resolveShareUrl(''), `${CANONICAL_SITE}/`);
    assert.equal(resolveShareUrl('   '), `${CANONICAL_SITE}/`);
  });
});

describe('shareContent — Web Share API, cancelamento, Clipboard e fallback manual', () => {
  it('deve usar nativeShare quando disponível e retornar shared sem acionar clipboard', async () => {
    let sharedPayload: unknown = null;
    let clipboardCalled = false;

    const outcome = await shareContent(
      {
        title: 'Por que escolhi Fedora',
        text: 'Relato de uso real',
        url: '/guilherme.dev-blog/artigos/por-que-escolhi-fedora/',
      },
      {
        nativeShare: async (data) => {
          sharedPayload = data;
        },
        copyText: async () => {
          clipboardCalled = true;
        },
      },
    );

    assert.equal(outcome, 'shared');
    assert.equal(clipboardCalled, false);
    assert.deepEqual(sharedPayload, {
      title: 'Por que escolhi Fedora',
      text: 'Relato de uso real',
      url: `${CANONICAL_SITE}/artigos/por-que-escolhi-fedora/`,
    });
  });

  it('não deve copiar automaticamente nem retornar sucesso quando o usuário cancelar (AbortError)', async () => {
    let clipboardCalled = false;

    const outcome = await shareContent(
      { title: 'Linux', url: '/linux/' },
      {
        nativeShare: async () => {
          const err = new Error('User cancelled');
          err.name = 'AbortError';
          throw err;
        },
        copyText: async () => {
          clipboardCalled = true;
        },
      },
    );

    assert.equal(outcome, 'cancelled');
    assert.equal(clipboardCalled, false);
  });

  it('deve copiar a URL canônica via clipboard quando nativeShare estiver indisponível', async () => {
    let copiedValue = '';

    const outcome = await shareContent(
      { title: 'God of War', url: 'http://localhost:4321/jogos/god-of-war/' },
      {
        copyText: async (text) => {
          copiedValue = text;
        },
      },
    );

    assert.equal(outcome, 'copied');
    assert.equal(copiedValue, `${CANONICAL_SITE}/jogos/god-of-war/`);
  });

  it('deve fazer fallback para cópia via clipboard se nativeShare falhar com erro não-AbortError', async () => {
    let copiedValue = '';

    const outcome = await shareContent(
      { title: 'Ran', url: '/filmes/ran/' },
      {
        nativeShare: async () => {
          throw new Error('NotAllowedError');
        },
        copyText: async (text) => {
          copiedValue = text;
        },
      },
    );

    assert.equal(outcome, 'copied');
    assert.equal(copiedValue, `${CANONICAL_SITE}/filmes/ran/`);
  });

  it('deve retornar manual quando clipboard falhar ou não estiver disponível', async () => {
    const failedClipboard = await shareContent(
      { title: '1984', url: '/livros/1984/' },
      {
        copyText: async () => {
          throw new Error('Clipboard denied');
        },
      },
    );
    assert.equal(failedClipboard, 'manual');

    const noApis = await shareContent({ title: '1984', url: '/livros/1984/' });
    assert.equal(noApis, 'manual');
  });

  it('isAbortError deve identificar apenas objetos de erro com name === AbortError', () => {
    const abortErr = new Error('Aborted');
    abortErr.name = 'AbortError';
    assert.equal(isAbortError(abortErr), true);
    assert.equal(isAbortError({ name: 'AbortError' }), true);
    assert.equal(isAbortError(new Error('Other')), false);
    assert.equal(isAbortError(null), false);
    assert.equal(isAbortError('AbortError'), false);
  });
});
