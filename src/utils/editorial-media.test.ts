/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  enhanceEditorialHtml,
  extractSpoilerTexts,
  hasSpoilerLeak,
  stripSpoilerBlocks,
} from './editorial-media.ts';

describe('editorial-media — Processamento de imagens inline em Markdown (EXP-02B)', () => {
  it('deve resolver URLs locais com withBase() tanto na Vercel quanto no GitHub Pages', () => {
    const input =
      '<p>Intro</p><p><img src="/images/resenhas/shinobido/furtividade.webp" alt="Goh sobre o telhado" title="Furtividade em 4:3"></p><p>Fim</p>';

    const vercelHtml = enhanceEditorialHtml(input, { base: '/' });
    assert.ok(
      vercelHtml.includes('src="/images/resenhas/shinobido/furtividade.webp"'),
    );
    assert.ok(
      vercelHtml.includes(
        'data-lightbox-src="/images/resenhas/shinobido/furtividade.webp"',
      ),
    );
    assert.ok(vercelHtml.includes('loading="lazy"'));
    assert.ok(vercelHtml.includes('decoding="async"'));
    assert.ok(
      vercelHtml.includes(
        '<figcaption class="v2-editorial-figcaption">Furtividade em 4:3</figcaption>',
      ),
    );
    // Preserva a ordem e posição exata entre os parágrafos
    assert.ok(
      vercelHtml.indexOf('<p>Intro</p>') <
        vercelHtml.indexOf('<figure class="v2-editorial-figure">') &&
        vercelHtml.indexOf('</figure>') < vercelHtml.indexOf('<p>Fim</p>'),
    );

    const ghPagesHtml = enhanceEditorialHtml(input, {
      base: '/guilherme.dev-blog/',
    });
    assert.ok(
      ghPagesHtml.includes(
        'src="/guilherme.dev-blog/images/resenhas/shinobido/furtividade.webp"',
      ),
    );
    assert.ok(
      ghPagesHtml.includes(
        'data-lightbox-src="/guilherme.dev-blog/images/resenhas/shinobido/furtividade.webp"',
      ),
    );
  });

  it('deve preservar URLs externas e injetar dimensões reais conhecidas sem distorção', () => {
    const input =
      '<p><img src="/images/diario-linux/gnome/01.webp" alt="Extension Manager"></p><p><img src="https://exemplo.org/foto.png" alt="Externa"></p>';

    const result = enhanceEditorialHtml(input, {
      base: '/',
      imageDimensions: {
        '/images/diario-linux/gnome/01.webp': { width: 1280, height: 960 },
      },
    });

    assert.ok(result.includes('width="1280" height="960"'));
    assert.ok(result.includes('src="https://exemplo.org/foto.png"'));
  });

  it('deve sinalizar imagens dentro de <details data-spoiler> como protegidas por spoiler', () => {
    const input =
      '<details class="v2-spoiler" data-spoiler><summary>Spoiler</summary><p><img src="/images/resenhas/shinobido/final.webp" alt="Cena final"></p></details>';

    const result = enhanceEditorialHtml(input, { base: '/' });
    assert.ok(result.includes('data-spoiler-media="true"'));
    assert.ok(result.includes('data-spoiler-figure="true"'));
  });
});

describe('editorial-media — Segurança contra vazamento de spoilers (EXP-02B)', () => {
  const sampleBodyWithHtmlSpoiler = `
Introdução segura sobre furtividade e liberdade de abordagem.

<details class="v2-spoiler" data-spoiler>
  <summary>Spoiler — Passado de Goh</summary>
  <p>Uma lembrança que particularmente me incomoda é a situação envolvendo uma das gêmeas.</p>
</details>

Conclusão livre de spoilers.
`;

  const sampleBodyWithMdMarkers = `
Parágrafo público sobre atmosfera.

**[SPOILER — Trecho oculto sobre personagens]**
Uma das descobertas mais estranhas para mim foi saber que Onji era um gato.
**[FIM DO SPOILER]**

Encerramento público.
`;

  it('stripSpoilerBlocks deve remover blocos de spoiler HTML e marcadores Markdown', () => {
    const cleanedHtml = stripSpoilerBlocks(sampleBodyWithHtmlSpoiler);
    assert.ok(cleanedHtml.includes('Introdução segura'));
    assert.ok(cleanedHtml.includes('Conclusão livre de spoilers'));
    assert.ok(!cleanedHtml.includes('gêmeas'));

    const cleanedMd = stripSpoilerBlocks(sampleBodyWithMdMarkers);
    assert.ok(cleanedMd.includes('Parágrafo público'));
    assert.ok(cleanedMd.includes('Encerramento público'));
    assert.ok(!cleanedMd.includes('Onji era um gato'));
  });

  it('extractSpoilerTexts deve extrair os conteúdos protegidos sem incluir o summary', () => {
    const htmlSpoilers = extractSpoilerTexts(sampleBodyWithHtmlSpoiler);
    assert.equal(htmlSpoilers.length, 1);
    assert.ok(htmlSpoilers[0].includes('gêmeas'));
    assert.ok(!htmlSpoilers[0].includes('Passado de Goh'));

    const mdSpoilers = extractSpoilerTexts(sampleBodyWithMdMarkers);
    assert.equal(mdSpoilers.length, 1);
    assert.ok(mdSpoilers[0].includes('Onji era um gato'));
  });

  it('hasSpoilerLeak deve aprovar resumos seguros e bloquear vazamentos de spoilers', () => {
    const safeDescription =
      'Uma análise pessoal de Shinobido: Way of the Ninja, sua furtividade e seu sistema de facções no PS2.';
    assert.equal(
      hasSpoilerLeak(safeDescription, sampleBodyWithHtmlSpoiler),
      false,
    );
    assert.equal(
      hasSpoilerLeak(safeDescription, sampleBodyWithMdMarkers),
      false,
    );

    const leakingDescription =
      'Nesta resenha comento como uma das descobertas mais estranhas para mim foi saber que Onji era um gato.';
    assert.equal(
      hasSpoilerLeak(leakingDescription, sampleBodyWithMdMarkers),
      true,
    );
  });
});

describe('Componentes editoriais compartilhados — Contratos estruturais (EXP-02B)', () => {
  it('SpoilerBlock, EditorialFigure e EditorialLightbox devem existir e seguir os contratos semânticos', () => {
    const spoilerPath = path.resolve(
      'src/components/editorial/SpoilerBlock.astro',
    );
    const figurePath = path.resolve(
      'src/components/editorial/EditorialFigure.astro',
    );
    const lightboxPath = path.resolve(
      'src/components/editorial/EditorialLightbox.astro',
    );

    const spoilerSrc = fs.readFileSync(spoilerPath, 'utf-8');
    assert.ok(spoilerSrc.includes('<details'));
    assert.ok(spoilerSrc.includes('<summary'));
    assert.ok(spoilerSrc.includes('data-spoiler'));

    const figureSrc = fs.readFileSync(figurePath, 'utf-8');
    assert.ok(figureSrc.includes('withBase'));
    assert.ok(figureSrc.includes('data-editorial-lightbox-trigger'));

    const lightboxSrc = fs.readFileSync(lightboxPath, 'utf-8');
    assert.ok(lightboxSrc.includes('<dialog'));
    assert.ok(lightboxSrc.includes('object-contain'));
    assert.ok(
      lightboxSrc.includes('details[data-spoiler]:not([open])'),
      'Lightbox deve bloquear imagens dentro de blocos de spoiler fechados',
    );
  });
});
