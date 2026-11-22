/**
 * Utilitários compartilhados de documentação técnica do Diário Linux (EXP-02C).
 *
 * Responsabilidades:
 * 1. Construir sumário (TOC) a partir de headings H2/H3 com âncoras estáveis e sem IDs duplicados.
 * 2. Aprimorar HTML gerado por Markdown técnico:
 *    - Composição com `enhanceEditorialHtml` (EXP-02B) para imagens inline e spoilers;
 *    - Envoltório de blocos `<pre><code>` com botão de copiar progressivo;
 *    - Conversão de alertas Markdown (`[!INFO]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`)
 *      em avisos técnicos acessíveis com ícone + texto (sem exigir MDX).
 */
import {
  enhanceEditorialHtml,
  type EnhanceEditorialHtmlOptions,
} from './editorial-media.ts';

export interface RawHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface TocItem {
  depth: 2 | 3;
  slug: string;
  text: string;
}

export type NoticeVariant = 'info' | 'warning' | 'risk' | 'tip';

export interface NoticeMeta {
  variant: NoticeVariant;
  label: string;
  iconSvg: string;
}

export const NOTICE_META: Readonly<Record<NoticeVariant, NoticeMeta>> =
  Object.freeze({
    info: {
      variant: 'info',
      label: 'Informação',
      iconSvg:
        '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/></svg>',
    },
    tip: {
      variant: 'tip',
      label: 'Dica',
      iconSvg:
        '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/></svg>',
    },
    warning: {
      variant: 'warning',
      label: 'Atenção',
      iconSvg:
        '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    },
    risk: {
      variant: 'risk',
      label: 'Aviso de risco',
      iconSvg:
        '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5.5 3.4 10.3 8 11 4.6-.7 8-5.5 8-11V5l-8-3Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
    },
  });

const ALERT_MARKER_TO_VARIANT: Readonly<Record<string, NoticeVariant>> = {
  INFO: 'info',
  NOTE: 'info',
  INFORMACAO: 'info',
  TIP: 'tip',
  DICA: 'tip',
  WARNING: 'warning',
  IMPORTANT: 'warning',
  ATENCAO: 'warning',
  CAUTION: 'risk',
  RISK: 'risk',
  RISCO: 'risk',
  DANGER: 'risk',
};

/**
 * Gera um identificador de âncora estável, sem acentos e seguro para URLs.
 */
export function slugifyHeading(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return slug || 'secao';
}

/**
 * Filtra headings H2 e H3 e garante slugs únicos e estáveis (evitando IDs duplicados).
 */
export function buildTableOfContents(
  headings: ReadonlyArray<RawHeading>,
): TocItem[] {
  const used = new Map<string, number>();
  const items: TocItem[] = [];

  for (const heading of headings) {
    if (heading.depth !== 2 && heading.depth !== 3) continue;
    const text = heading.text.trim();
    if (!text) continue;

    const baseSlug = (heading.slug || '').trim() || slugifyHeading(text);
    const count = used.get(baseSlug) ?? 0;
    used.set(baseSlug, count + 1);
    const uniqueSlug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;

    items.push({
      depth: heading.depth,
      slug: uniqueSlug,
      text,
    });
  }

  return items;
}

function detectCodeLanguage(preAttrs: string, codeAttrs: string): string {
  const dataLangMatch = preAttrs.match(/\bdata-language="([^"]+)"/i);
  if (dataLangMatch && dataLangMatch[1] && dataLangMatch[1] !== 'plaintext') {
    return dataLangMatch[1].toLowerCase();
  }

  const classMatch = (codeAttrs + ' ' + preAttrs).match(
    /\blanguage-([a-z0-9_+-]+)/i,
  );
  if (classMatch && classMatch[1] && classMatch[1] !== 'plaintext') {
    return classMatch[1].toLowerCase();
  }

  return '';
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Converte blockquotes Markdown com marcadores `[!INFO]`, `[!TIP]`, `[!WARNING]`
 * ou `[!CAUTION]` em componentes `<aside class="v2-notice ...">` com ícone + texto.
 * Blockquotes comuns sem marcador permanecem intactos.
 */
export function transformMarkdownNotices(html: string): string {
  if (!html) return '';

  return html.replace(
    /<blockquote>\s*<p>\[!([A-Za-zÀ-ÿ]+)\](?:<br\s*\/?>|\s+)([\s\S]*?)<\/p>([\s\S]*?)<\/blockquote>/gi,
    (
      fullMatch,
      rawMarker: string,
      firstParagraph: string,
      restHtml: string,
    ) => {
      const normalizedMarker = rawMarker
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
      const variant = ALERT_MARKER_TO_VARIANT[normalizedMarker];
      if (!variant) return fullMatch;

      const meta = NOTICE_META[variant];
      const body = `<p>${firstParagraph.trim()}</p>${restHtml.trim()}`;

      return `<aside class="v2-notice v2-notice--${meta.variant}" role="note" aria-label="${escapeAttr(meta.label)}"><div class="v2-notice-header"><span class="v2-notice-icon">${meta.iconSvg}</span><span class="v2-notice-title">${meta.label}</span></div><div class="v2-notice-body">${body}</div></aside>`;
    },
  );
}

/**
 * Envolve blocos `<pre><code>` com estrutura reutilizável para botão de copiar
 * progressivo, preservando integralmente o conteúdo interno, indentação e quebras de linha.
 */
export function enhanceCodeBlocks(html: string): string {
  if (!html) return '';

  return html.replace(
    /<pre\b([^>]*)><code\b([^>]*)>([\s\S]*?)<\/code><\/pre>/gi,
    (_match, preAttrs: string, codeAttrs: string, codeInner: string) => {
      const lang = detectCodeLanguage(preAttrs, codeAttrs);
      const langLabel = lang ? lang.toUpperCase() : 'CÓDIGO';
      const copyAria = lang
        ? `Copiar bloco de código ${lang}`
        : 'Copiar bloco de código';

      return (
        `<div class="v2-code-block" data-code-block>` +
        `<div class="v2-code-toolbar">` +
        `<span class="v2-code-lang">${escapeAttr(langLabel)}</span>` +
        `<button type="button" class="v2-code-copy-btn v2-focus" data-code-copy hidden aria-label="${escapeAttr(copyAria)}">Copiar</button>` +
        `</div>` +
        `<pre${preAttrs}><code${codeAttrs}>${codeInner}</code></pre>` +
        `</div>`
      );
    },
  );
}

export interface EnhanceTechnicalHtmlOptions extends EnhanceEditorialHtmlOptions {
  /** Habilita conversão de alertas Markdown `[!INFO]` etc. (padrão: true). */
  enableNotices?: boolean;
  /** Habilita barra de código com botão de copiar progressivo (padrão: true). */
  enableCodeCopy?: boolean;
}

/**
 * Pipeline completo para o corpo HTML de artigos técnicos do Diário Linux,
 * compondo sobre `enhanceEditorialHtml` (EXP-02B).
 */
export function enhanceTechnicalHtml(
  html: string,
  options: EnhanceTechnicalHtmlOptions = {},
): string {
  if (!html) return '';

  const {
    enableNotices = true,
    enableCodeCopy = true,
    ...mediaOptions
  } = options;

  let processed = enhanceEditorialHtml(html, mediaOptions);
  if (enableNotices) {
    processed = transformMarkdownNotices(processed);
  }
  if (enableCodeCopy) {
    processed = enhanceCodeBlocks(processed);
  }

  return processed;
}
