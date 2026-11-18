/**
 * Utilitário centralizado para ordenação determinística e navegação editorial
 * (anterior / próximo) entre registros individuais das Content Collections.
 * FRT-02 — Fase FRONT-01.
 */
import { isPublishable, type PublishableEntry } from './seo.ts';

export interface NavigableEntry<
  TData extends PublishableEntry = PublishableEntry,
> {
  id: string;
  data: TData;
}

export interface AdjacentEntries<T extends NavigableEntry> {
  prev: T | null;
  next: T | null;
  index: number;
  total: number;
}

export interface NavigablePathItem<T extends NavigableEntry> {
  entry: T;
  prev: T | null;
  next: T | null;
  index: number;
  total: number;
}

export interface YearTitledData extends PublishableEntry {
  title: string;
  releaseYear: number;
}

export interface BookNavData extends PublishableEntry {
  title: string;
  status: 'lendo' | 'lido' | 'quero_ler' | string;
}

export interface ArticleNavData extends PublishableEntry {
  title: string;
  publishedAt: Date;
}

const BOOK_STATUS_ORDER: Record<string, number> = {
  lendo: 0,
  lido: 1,
  quero_ler: 2,
};

function compareTitleAndId(
  a: { id: string; data: { title: string } },
  b: { id: string; data: { title: string } },
): number {
  return (
    a.data.title.localeCompare(b.data.title, 'pt-BR') ||
    a.id.localeCompare(b.id, 'en')
  );
}

/**
 * Ordenação padrão estável de Jogos:
 * ano de lançamento decrescente → título (pt-BR) → id.
 */
export function compareGames<T extends NavigableEntry<YearTitledData>>(
  a: T,
  b: T,
): number {
  return b.data.releaseYear - a.data.releaseYear || compareTitleAndId(a, b);
}

/**
 * Ordenação padrão estável de Filmes:
 * ano de lançamento decrescente → título (pt-BR) → id.
 */
export function compareMovies<T extends NavigableEntry<YearTitledData>>(
  a: T,
  b: T,
): number {
  return b.data.releaseYear - a.data.releaseYear || compareTitleAndId(a, b);
}

/**
 * Ordenação padrão estável de Livros:
 * status (lendo → lido → quero_ler) → título (pt-BR) → id.
 */
export function compareBooks<T extends NavigableEntry<BookNavData>>(
  a: T,
  b: T,
): number {
  const rankA = BOOK_STATUS_ORDER[a.data.status] ?? 3;
  const rankB = BOOK_STATUS_ORDER[b.data.status] ?? 3;
  return rankA - rankB || compareTitleAndId(a, b);
}

/**
 * Ordenação padrão estável de Artigos (cronológica decrescente):
 * data de publicação mais recente primeiro → título (pt-BR) → id.
 */
export function compareArticles<T extends NavigableEntry<ArticleNavData>>(
  a: T,
  b: T,
): number {
  return (
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime() ||
    compareTitleAndId(a, b)
  );
}

/**
 * Retorna uma nova lista contendo apenas registros publicáveis,
 * ordenados de forma determinística pelo comparador fornecido.
 */
export function getPublishableOrderedEntries<T extends NavigableEntry>(
  entries: readonly T[],
  comparator: (a: T, b: T) => number,
): T[] {
  return entries.filter((entry) => isPublishable(entry.data)).sort(comparator);
}

/**
 * Calcula os vizinhos anterior/próximo de um registro considerando
 * exclusivamente o conjunto de registros publicáveis.
 *
 * Registros não publicáveis (isDemo/draft) ou inexistentes recebem prev/next nulos.
 */
export function getAdjacentEntries<T extends NavigableEntry>(
  entries: readonly T[],
  currentId: string,
  comparator: (a: T, b: T) => number,
): AdjacentEntries<T> {
  const publishable = getPublishableOrderedEntries(entries, comparator);
  const index = publishable.findIndex((entry) => entry.id === currentId);

  if (index === -1) {
    return {
      prev: null,
      next: null,
      index: -1,
      total: publishable.length,
    };
  }

  return {
    prev: index > 0 ? publishable[index - 1] : null,
    next: index < publishable.length - 1 ? publishable[index + 1] : null,
    index,
    total: publishable.length,
  };
}

/**
 * Prepara a lista de entradas para getStaticPaths() preservando todas as rotas
 * existentes (inclusive demonstrativas com noindex), mas calculando links
 * anterior/próximo exclusivamente entre registros publicáveis.
 */
export function buildNavigableEntries<T extends NavigableEntry>(
  entries: readonly T[],
  comparator: (a: T, b: T) => number,
): NavigablePathItem<T>[] {
  const allSorted = [...entries].sort(comparator);
  const publishable = allSorted.filter((entry) => isPublishable(entry.data));
  const publishableIndex = new Map<string, number>();

  publishable.forEach((entry, idx) => {
    publishableIndex.set(entry.id, idx);
  });

  return allSorted.map((entry) => {
    const idx = publishableIndex.get(entry.id);
    if (idx === undefined) {
      return {
        entry,
        prev: null,
        next: null,
        index: -1,
        total: publishable.length,
      };
    }

    return {
      entry,
      prev: idx > 0 ? publishable[idx - 1] : null,
      next: idx < publishable.length - 1 ? publishable[idx + 1] : null,
      index: idx,
      total: publishable.length,
    };
  });
}
