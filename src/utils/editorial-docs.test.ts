/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildTableOfContents,
  enhanceCodeBlocks,
  enhanceTechnicalHtml,
  slugifyHeading,
  transformMarkdownNotices,
} from './editorial-docs.ts';

describe('editorial-docs — Sumário de navegação H2/H3 (EXP-02C)', () => {
  it('deve filtrar apenas H2 e H3 e deduplicar slugs repetidos', () => {
    const toc = buildTableOfContents([
      { depth: 1, slug: 'titulo', text: 'Título principal' },
      { depth: 2, slug: 'instalacao', text: 'Instalação' },
      { depth: 3, slug: 'preferencias', text: 'Preferências' },
      { depth: 4, slug: 'detalhe', text: 'Detalhe profundo' },
      { depth: 2, slug: 'instalacao', text: 'Instalação' },
      { depth: 3, slug: '', text: 'Configuração Avançada' },
    ]);

    assert.deepEqual(toc, [
      { depth: 2, slug: 'instalacao', text: 'Instalação' },
      { depth: 3, slug: 'preferencias', text: 'Preferências' },
      { depth: 2, slug: 'instalacao-2', text: 'Instalação' },
      {
        depth: 3,
        slug: 'configuracao-avancada',
        text: 'Configuração Avançada',
      },
    ]);
  });

  it('slugifyHeading deve normalizar acentos, pontuação e espaços', () => {
    assert.equal(
      slugifyHeading('1. Preparando o ambiente (GNOME)'),
      '1-preparando-o-ambiente-gnome',
    );
    assert.equal(slugifyHeading('   '), 'secao');
  });
});

describe('editorial-docs — Blocos de código copiáveis (EXP-02C)', () => {
  it('deve envolver blocos <pre><code> preservando quebras de linha e caracteres especiais', () => {
    const sampleCode =
      'sudo dnf upgrade --refresh\necho "$HOME" &amp;&amp; ls -la &lt;dir&gt;';
    const input = `<pre class="astro-code" data-language="bash"><code class="language-bash">${sampleCode}</code></pre>`;

    const result = enhanceCodeBlocks(input);
    assert.ok(result.includes('data-code-block'));
    assert.ok(result.includes('data-code-copy hidden'));
    assert.ok(result.includes('<span class="v2-code-lang">BASH</span>'));
    assert.ok(result.includes(sampleCode));
  });
});

describe('editorial-docs — Avisos técnicos em Markdown sem MDX (EXP-02C)', () => {
  it('deve converter marcadores [!INFO], [!TIP], [!WARNING] e [!CAUTION] com ícone e texto', () => {
    const input = [
      '<blockquote><p>[!INFO] Nota sobre versões do GNOME.</p></blockquote>',
      '<blockquote><p>[!TIP] Comece pelas quatro extensões principais.</p></blockquote>',
      '<blockquote><p>[!WARNING] Confira a compatibilidade antes de atualizar.</p></blockquote>',
      '<blockquote><p>[!CAUTION] Revise o comando antes de executar como root.</p></blockquote>',
      '<blockquote><p>Citação editorial comum sem marcador.</p></blockquote>',
    ].join('\n');

    const result = transformMarkdownNotices(input);
    assert.ok(result.includes('v2-notice--info'));
    assert.ok(result.includes('Informação'));
    assert.ok(result.includes('v2-notice--tip'));
    assert.ok(result.includes('Dica'));
    assert.ok(result.includes('v2-notice--warning'));
    assert.ok(result.includes('Atenção'));
    assert.ok(result.includes('v2-notice--risk'));
    assert.ok(result.includes('Aviso de risco'));
    assert.ok(result.includes('<svg'));
    // Preserva citações comuns
    assert.ok(
      result.includes(
        '<blockquote><p>Citação editorial comum sem marcador.</p></blockquote>',
      ),
    );
  });

  it('enhanceTechnicalHtml deve compor imagens inline (withBase), avisos e blocos de código', () => {
    const input =
      '<p><img src="/images/diario-linux/gnome/01.webp" alt="Extension Manager" title="Extensões"></p>' +
      '<blockquote><p>[!WARNING] Opções podem variar.</p></blockquote>' +
      '<pre data-language="sh"><code>flatpak list</code></pre>';

    const result = enhanceTechnicalHtml(input, {
      base: '/guilherme.dev-blog/',
    });

    assert.ok(
      result.includes(
        'src="/guilherme.dev-blog/images/diario-linux/gnome/01.webp"',
      ),
    );
    assert.ok(result.includes('v2-notice--warning'));
    assert.ok(result.includes('data-code-copy hidden'));
  });
});

describe('Componentes técnicos compartilhados — Contratos estruturais (EXP-02C)', () => {
  it('TableOfContents, TechnicalNotice e CodeBlockEnhancer devem existir com contratos acessíveis', () => {
    const tocSrc = fs.readFileSync(
      path.resolve('src/components/editorial/TableOfContents.astro'),
      'utf-8',
    );
    const noticeSrc = fs.readFileSync(
      path.resolve('src/components/editorial/TechnicalNotice.astro'),
      'utf-8',
    );
    const copySrc = fs.readFileSync(
      path.resolve('src/components/editorial/CodeBlockEnhancer.astro'),
      'utf-8',
    );

    assert.ok(tocSrc.includes('<details'));
    assert.ok(tocSrc.includes('aria-label="Sumário do artigo"'));
    assert.ok(tocSrc.includes('buildTableOfContents'));

    assert.ok(noticeSrc.includes('role="note"'));
    assert.ok(noticeSrc.includes('v2-notice-icon'));
    assert.ok(noticeSrc.includes('v2-notice-title'));

    assert.ok(copySrc.includes('aria-live="polite"'));
    assert.ok(copySrc.includes('navigator.clipboard'));
    assert.ok(copySrc.includes("execCommand('copy')"));
  });
});
