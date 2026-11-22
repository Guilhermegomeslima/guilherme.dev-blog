/**
 * Utilitários compartilhados de mídia editorial e proteção contra spoilers (EXP-02B).
 *
 * Responsabilidades:
 * 1. Processar imagens inline em HTML gerado por Markdown preservando posição,
 *    proporção natural (4:3, 16:9, etc.), legendas opcionais, lazy loading,
 *    compatibilidade com `withBase()` (Vercel e GitHub Pages) e ganchos para lightbox.
 * 2. Proteger trechos e imagens marcados como spoilers contra vazamento em
 *    resumos, cards, metadados e abertura indevida no lightbox.
 */
import { withBase } from './base.ts';

export interface ImageDimension {
  width: number;
  height: number;
}

export interface EnhanceEditorialHtmlOptions {
  /** Base path do Astro (`/` na Vercel ou `/guilherme.dev-blog/` no GitHub Pages). */
  base?: string;
  /** Mapa opcional de dimensões reais conhecidas (`/images/...` -> `{ width, height }`). */
  imageDimensions?: Readonly<Record<string, ImageDimension>>;
  /** Habilita abertura no EditorialLightbox ao clicar na imagem (padrão: true). */
  enableLightbox?: boolean;
  /** Envolve imagens soltas em `<figure class="v2-editorial-figure">` com `<figcaption>` quando houver `title` (padrão: true). */
  wrapFigures?: boolean;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function unescapeHtmlAttr(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function readAttr(attrs: string, name: string): string | undefined {
  const regex = new RegExp(`\\b${name}="([^"]*)"`, 'i');
  const match = attrs.match(regex);
  return match ? unescapeHtmlAttr(match[1]) : undefined;
}

/**
 * Encontra os intervalos de índice de blocos `<details ... data-spoiler ...>...</details>`
 * no HTML renderizado para sinalizar imagens protegidas por spoiler.
 */
function findSpoilerRanges(html: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  const spoilerRegex =
    /<details\b[^>]*\bdata-spoiler\b[^>]*>[\s\S]*?<\/details>/gi;
  let match: RegExpExecArray | null;
  while ((match = spoilerRegex.exec(html)) !== null) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function isInsideRanges(
  index: number,
  ranges: ReadonlyArray<[number, number]>,
): boolean {
  return ranges.some(([start, end]) => index >= start && index < end);
}

/**
 * Transforma tags `<img>` (e parágrafos contendo exclusivamente uma imagem) no HTML
 * editorial gerado por Markdown, preservando a posição exata no texto.
 */
export function enhanceEditorialHtml(
  html: string,
  options: EnhanceEditorialHtmlOptions = {},
): string {
  if (!html) return '';

  const {
    base,
    imageDimensions = {},
    enableLightbox = true,
    wrapFigures = true,
  } = options;

  const spoilerRanges = findSpoilerRanges(html);

  const transformImgTag = (fullTag: string, attrs: string, offset: number) => {
    const rawSrc = readAttr(attrs, 'src');
    if (!rawSrc) return fullTag;

    const resolvedSrc = withBase(rawSrc, base);
    const alt = readAttr(attrs, 'alt') ?? '';
    const title = readAttr(attrs, 'title');
    const insideSpoiler = isInsideRanges(offset, spoilerRanges);

    // Atualiza src com withBase preservando os demais atributos
    let updatedAttrs = attrs.replace(
      /\bsrc="[^"]*"/i,
      `src="${escapeHtmlAttr(resolvedSrc)}"`,
    );

    // Injeta dimensões reais conhecidas quando ausentes para evitar layout shift
    const dims = imageDimensions[rawSrc];
    if (dims && !/\bwidth=/i.test(updatedAttrs)) {
      updatedAttrs += ` width="${dims.width}" height="${dims.height}"`;
    }

    // Lazy loading e decoding assíncrono por padrão abaixo da abertura
    if (!/\bloading=/i.test(updatedAttrs)) {
      updatedAttrs += ' loading="lazy"';
    }
    if (!/\bdecoding=/i.test(updatedAttrs)) {
      updatedAttrs += ' decoding="async"';
    }

    if (insideSpoiler && !/\bdata-spoiler-media=/i.test(updatedAttrs)) {
      updatedAttrs += ' data-spoiler-media="true"';
    }

    if (enableLightbox && !/\bdata-no-lightbox\b/i.test(updatedAttrs)) {
      updatedAttrs += ` data-editorial-lightbox-trigger="true" data-lightbox-src="${escapeHtmlAttr(resolvedSrc)}" data-lightbox-alt="${escapeHtmlAttr(alt)}"`;
      if (title) {
        updatedAttrs += ` data-lightbox-caption="${escapeHtmlAttr(title)}"`;
      }
      if (!/\btabindex=/i.test(updatedAttrs)) {
        updatedAttrs += ' tabindex="0" role="button"';
      }
      if (!/\baria-label=/i.test(updatedAttrs)) {
        const label = alt
          ? `Ampliar imagem: ${alt}`
          : 'Ampliar imagem editorial';
        updatedAttrs += ` aria-label="${escapeHtmlAttr(label)}"`;
      }
    }

    const imgHtml = `<img${updatedAttrs}>`;

    if (!wrapFigures) {
      return imgHtml;
    }

    const captionHtml = title
      ? `<figcaption class="v2-editorial-figcaption">${escapeHtmlAttr(title)}</figcaption>`
      : '';

    return `<figure class="v2-editorial-figure"${insideSpoiler ? ' data-spoiler-figure="true"' : ''}>${imgHtml}${captionHtml}</figure>`;
  };

  if (wrapFigures) {
    // Primeiro trata `<p><img ...></p>` isolados (saída padrão do Markdown) para evitar `<p><figure>` inválido
    const standaloneImgRegex = /<p>\s*(<img\b([^>]*?)\/?>)\s*<\/p>/gi;
    const withFigures = html.replace(
      standaloneImgRegex,
      (match, fullImg: string, attrs: string, offset: number) =>
        transformImgTag(fullImg, attrs, offset) || match,
    );

    // Em seguida trata quaisquer `<img>` remanescentes (ex.: já dentro de `<figure>` manual) sem re-envolver
    const remainingImgRegex = /<img\b([^>]*?)\/?>/gi;
    const updatedSpoilerRanges = findSpoilerRanges(withFigures);
    return withFigures.replace(
      remainingImgRegex,
      (fullImg: string, attrs: string, offset: number) => {
        if (/\bdata-editorial-lightbox-trigger=/i.test(attrs)) {
          return fullImg;
        }
        const rawSrc = readAttr(attrs, 'src');
        if (!rawSrc) return fullImg;

        const resolvedSrc = withBase(rawSrc, base);
        const insideSpoiler = isInsideRanges(offset, updatedSpoilerRanges);
        let updatedAttrs = attrs.replace(
          /\bsrc="[^"]*"/i,
          `src="${escapeHtmlAttr(resolvedSrc)}"`,
        );

        const dims = imageDimensions[rawSrc];
        if (dims && !/\bwidth=/i.test(updatedAttrs)) {
          updatedAttrs += ` width="${dims.width}" height="${dims.height}"`;
        }
        if (!/\bloading=/i.test(updatedAttrs)) {
          updatedAttrs += ' loading="lazy"';
        }
        if (!/\bdecoding=/i.test(updatedAttrs)) {
          updatedAttrs += ' decoding="async"';
        }
        if (insideSpoiler && !/\bdata-spoiler-media=/i.test(updatedAttrs)) {
          updatedAttrs += ' data-spoiler-media="true"';
        }

        return `<img${updatedAttrs}>`;
      },
    );
  }

  return html.replace(
    /<img\b([^>]*?)\/?>/gi,
    (fullImg: string, attrs: string, offset: number) =>
      transformImgTag(fullImg, attrs, offset),
  );
}

const HTML_SPOILER_BLOCK_REGEX =
  /<details\b[^>]*\bdata-spoiler\b[^>]*>[\s\S]*?<\/details>/gi;
const MARKDOWN_SPOILER_MARKER_REGEX =
  /\*\*\[SPOILER[^\]]*\]\*\*[\s\S]*?\*\*\[FIM DO SPOILER\]\*\*/gi;

/**
 * Remove integralmente blocos de spoiler (HTML `<details data-spoiler>` ou
 * marcações editoriais `**[SPOILER ...]** ... **[FIM DO SPOILER]**`) de um texto.
 * Deve ser usado antes de qualquer geração de excerto ou indexação de busca.
 */
export function stripSpoilerBlocks(content: string): string {
  if (!content) return '';
  return content
    .replace(HTML_SPOILER_BLOCK_REGEX, ' ')
    .replace(MARKDOWN_SPOILER_MARKER_REGEX, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extrai o texto interno de todos os blocos de spoiler encontrados em um
 * documento Markdown ou HTML, excluindo o `<summary>`.
 */
export function extractSpoilerTexts(content: string): string[] {
  if (!content) return [];
  const extracted: string[] = [];

  for (const match of content.matchAll(HTML_SPOILER_BLOCK_REGEX)) {
    const withoutSummary = match[0]
      .replace(/<summary\b[^>]*>[\s\S]*?<\/summary>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (withoutSummary) {
      extracted.push(withoutSummary);
    }
  }

  for (const match of content.matchAll(MARKDOWN_SPOILER_MARKER_REGEX)) {
    const inner = match[0]
      .replace(/\*\*\[SPOILER[^\]]*\]\*\*/i, ' ')
      .replace(/\*\*\[FIM DO SPOILER\]\*\*/i, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (inner) {
      extracted.push(inner);
    }
  }

  return extracted;
}

function normalizeForComparison(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verifica se algum trecho substancial (frase/segmento com ao menos `minSnippetLength`
 * caracteres) protegido dentro de um bloco de spoiler vazou para um texto público
 * (como `description`, cards ou metadados Open Graph).
 */
export function hasSpoilerLeak(
  publicText: string,
  bodyWithSpoilers: string,
  minSnippetLength = 24,
): boolean {
  const normalizedPublic = normalizeForComparison(publicText);
  if (!normalizedPublic) return false;

  const spoilerTexts = extractSpoilerTexts(bodyWithSpoilers);
  for (const spoiler of spoilerTexts) {
    const sentences = spoiler
      .split(/[.!?\n]+/)
      .map((s) => normalizeForComparison(s))
      .filter((s) => s.length >= minSnippetLength);

    for (const sentence of sentences) {
      if (normalizedPublic.includes(sentence)) {
        return true;
      }
    }
  }

  return false;
}
