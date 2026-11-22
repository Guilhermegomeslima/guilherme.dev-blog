/**
 * Utilitários puros da seção Diário Linux (EXP-04A).
 * Centraliza categorias, níveis, ordenação, filtragem + busca local,
 * seleção de artigos relacionados e sincronização de âncoras do sumário.
 */
import type { TocItem } from './editorial-docs.ts';
import { matchesSearchTerms } from './search.ts';
import type { PublishableEntry } from './seo.ts';

export type LinuxDiaryCategory =
  | 'tutoriais'
  | 'configuracoes'
  | 'relatos'
  | 'solucoes'
  | 'programas'
  | 'comandos';

export type LinuxDiaryLevel =
  'iniciante' | 'intermediario' | 'iniciante_intermediario' | 'avancado';

export interface LinuxDiaryCategoryMeta {
  id: LinuxDiaryCategory;
  label: string;
}

export const LINUX_DIARY_CATEGORIES: Readonly<
  Record<LinuxDiaryCategory, LinuxDiaryCategoryMeta>
> = Object.freeze({
  tutoriais: { id: 'tutoriais', label: 'Tutoriais' },
  configuracoes: { id: 'configuracoes', label: 'Configurações do sistema' },
  relatos: { id: 'relatos', label: 'Relatos pessoais' },
  solucoes: { id: 'solucoes', label: 'Soluções de problemas' },
  programas: { id: 'programas', label: 'Recomendações de programas' },
  comandos: { id: 'comandos', label: 'Comandos e scripts' },
});

export const LINUX_DIARY_CATEGORY_ORDER: readonly LinuxDiaryCategory[] = [
  'tutoriais',
  'configuracoes',
  'relatos',
  'solucoes',
  'programas',
  'comandos',
];

export const LINUX_DIARY_LEVEL_LABELS: Readonly<
  Record<LinuxDiaryLevel, string>
> = Object.freeze({
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  iniciante_intermediario: 'Iniciante e intermediário',
  avancado: 'Avançado',
});

export interface LinuxDiaryEntryData extends PublishableEntry {
  title: string;
  description: string;
  category: LinuxDiaryCategory;
  tags: string[];
  publishedAt?: Date;
  updatedAt?: Date;
  relatedSlugs?: string[];
  featured?: boolean;
}

export interface LinuxDiaryEntryLike {
  id: string;
  data: LinuxDiaryEntryData;
}

/**
 * Ordenação determinística do Diário Linux:
 * 1. Data de publicação decrescente (ou última revisão se sem publishedAt);
 * 2. Destaque (`featured: true`) primeiro;
 * 3. Título (pt-BR) → `id`.
 */
export function compareLinuxDiary<T extends LinuxDiaryEntryLike>(
  a: T,
  b: T,
): number {
  const dateA = a.data.publishedAt ?? a.data.updatedAt;
  const dateB = b.data.publishedAt ?? b.data.updatedAt;
  const timeA = dateA ? dateA.getTime() : -Infinity;
  const timeB = dateB ? dateB.getTime() : -Infinity;
  if (timeA !== timeB) {
    return timeB - timeA;
  }

  const featA = a.data.featured ? 1 : 0;
  const featB = b.data.featured ? 1 : 0;
  if (featA !== featB) {
    return featB - featA;
  }

  return (
    a.data.title.localeCompare(b.data.title, 'pt-BR') ||
    a.id.localeCompare(b.id, 'en')
  );
}

/**
 * Conta quantas publicações pertencem a cada categoria do Diário Linux.
 */
export function countLinuxDiaryByCategory(
  entries: ReadonlyArray<{ data: { category: LinuxDiaryCategory } }>,
): Record<'all' | LinuxDiaryCategory, number> {
  const counts: Record<'all' | LinuxDiaryCategory, number> = {
    all: entries.length,
    tutoriais: 0,
    configuracoes: 0,
    relatos: 0,
    solucoes: 0,
    programas: 0,
    comandos: 0,
  };

  for (const entry of entries) {
    counts[entry.data.category] += 1;
  }

  return counts;
}

/**
 * Texto indexável para a pesquisa exclusiva do Diário Linux
 * (título, descrição, categoria e tags).
 */
export function buildDiarySearchableText(data: LinuxDiaryEntryData): string {
  const catLabel = LINUX_DIARY_CATEGORIES[data.category]?.label ?? '';
  return [data.title, data.description, catLabel, ...data.tags]
    .filter(Boolean)
    .join(' ');
}

/**
 * Filtra publicações do Diário Linux combinando categoria e busca local normalizada.
 */
export function filterLinuxDiaryEntries<T extends LinuxDiaryEntryLike>(
  entries: readonly T[],
  options: { category?: 'all' | LinuxDiaryCategory; query?: string } = {},
): T[] {
  const { category = 'all', query = '' } = options;

  return entries.filter((entry) => {
    if (category !== 'all' && entry.data.category !== category) {
      return false;
    }
    if (!query.trim()) {
      return true;
    }
    return matchesSearchTerms(buildDiarySearchableText(entry.data), query);
  });
}

/**
 * Seleciona artigos relacionados:
 * 1. Prioriza seleções manuais (`relatedSlugs`) na ordem declarada;
 * 2. Completa automaticamente por correspondência de categoria (+2) e tags em comum (+1/tag);
 * 3. Evita duplicatas e exclui o próprio artigo.
 */
export function selectRelatedDiaryEntries<T extends LinuxDiaryEntryLike>(
  current: T,
  candidates: readonly T[],
  limit = 3,
): T[] {
  if (limit <= 0) return [];

  const byId = new Map<string, T>();
  for (const entry of candidates) {
    if (entry.id !== current.id) {
      byId.set(entry.id, entry);
    }
  }

  const selected: T[] = [];
  const selectedIds = new Set<string>([current.id]);

  // 1. Prioridade para seleções manuais
  for (const slug of current.data.relatedSlugs ?? []) {
    if (selected.length >= limit) break;
    if (selectedIds.has(slug)) continue;
    const match = byId.get(slug);
    if (match) {
      selected.push(match);
      selectedIds.add(match.id);
    }
  }

  if (selected.length >= limit) {
    return selected;
  }

  // 2. Complemento automático por categoria e tags
  const currentTags = new Set(
    current.data.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
  );

  const scored = Array.from(byId.values())
    .filter((entry) => !selectedIds.has(entry.id))
    .map((entry) => {
      let score = 0;
      if (entry.data.category === current.data.category) {
        score += 2;
      }
      for (const tag of entry.data.tags) {
        if (currentTags.has(tag.trim().toLowerCase())) {
          score += 1;
        }
      }
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || compareLinuxDiary(a.entry, b.entry));

  for (const { entry } of scored) {
    if (selected.length >= limit) break;
    selected.push(entry);
    selectedIds.add(entry.id);
  }

  return selected;
}

/**
 * Sincroniza os atributos `id` dos elementos `<h2>` e `<h3>` do HTML renderizado
 * com os slugs deduplicados do `TableOfContents`, garantindo correspondência 1:1
 * entre cada link `#slug` do sumário e o título real no DOM.
 */
export function syncHeadingIdsWithToc(
  html: string,
  tocItems: ReadonlyArray<TocItem>,
): string {
  if (!html || tocItems.length === 0) return html;

  let index = 0;
  return html.replace(
    /<h([23])\b([^>]*)>/gi,
    (fullTag: string, level: string, attrs: string) => {
      const target = tocItems[index];
      if (!target || String(target.depth) !== level) {
        return fullTag;
      }
      index += 1;

      if (/\bid="[^"]*"/i.test(attrs)) {
        const updatedAttrs = attrs.replace(
          /\bid="[^"]*"/i,
          `id="${target.slug}"`,
        );
        return `<h${level}${updatedAttrs}>`;
      }
      return `<h${level} id="${target.slug}"${attrs}>`;
    },
  );
}
