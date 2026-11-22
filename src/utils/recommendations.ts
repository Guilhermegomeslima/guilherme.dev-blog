/**
 * Utilitários puros da seção Recomendações (EXP-05A).
 *
 * Centraliza categorias oficiais, estados de experiência (sem equivaler a endosso),
 * ordenação determinística, contagens e filtros combinados.
 */
import type { PublishableEntry } from './seo.ts';

export type RecommendationCategory = 'audio_perifericos' | 'livros_editoras';

export type RecommendationStatus =
  'ja_utilizei' | 'pesquisado' | 'lista_interesse';

export type RecommendationKind = 'produto' | 'edicao' | 'colecao' | 'editora';

export interface RecommendationCategoryMeta {
  id: RecommendationCategory;
  label: string;
}

export interface RecommendationStatusMeta {
  id: RecommendationStatus;
  label: string;
  description: string;
  isDirectExperience: boolean;
}

export const RECOMMENDATION_CATEGORIES: Readonly<
  Record<RecommendationCategory, RecommendationCategoryMeta>
> = Object.freeze({
  audio_perifericos: {
    id: 'audio_perifericos',
    label: 'Áudio e periféricos',
  },
  livros_editoras: {
    id: 'livros_editoras',
    label: 'Livros e editoras',
  },
});

export const RECOMMENDATION_CATEGORY_ORDER: readonly RecommendationCategory[] =
  ['audio_perifericos', 'livros_editoras'];

export const RECOMMENDATION_STATUSES: Readonly<
  Record<RecommendationStatus, RecommendationStatusMeta>
> = Object.freeze({
  ja_utilizei: {
    id: 'ja_utilizei',
    label: 'Já utilizei',
    description: 'Item conhecido por experiência direta.',
    isDirectExperience: true,
  },
  pesquisado: {
    id: 'pesquisado',
    label: 'Pesquisado',
    description: 'Item estudado, sem uso direto registrado.',
    isDirectExperience: false,
  },
  lista_interesse: {
    id: 'lista_interesse',
    label: 'Lista de interesse',
    description: 'Item salvo para avaliação futura.',
    isDirectExperience: false,
  },
});

export const RECOMMENDATION_STATUS_ORDER: readonly RecommendationStatus[] = [
  'ja_utilizei',
  'pesquisado',
  'lista_interesse',
];

export const RECOMMENDATION_KIND_LABELS: Readonly<
  Record<RecommendationKind, string>
> = Object.freeze({
  produto: 'Produto',
  edicao: 'Edição',
  colecao: 'Coleção',
  editora: 'Editora',
});

export interface RecommendationEntryLike {
  id: string;
  data: PublishableEntry & {
    name: string;
    kind?: RecommendationKind;
    category: RecommendationCategory;
    subcategory?: string;
    status: RecommendationStatus;
    currentlyUsing?: boolean;
    addedAt?: Date;
    order?: number;
  };
}

/**
 * Indica se o selo "Uso atualmente" pode ser exibido com veracidade:
 * somente quando o status for `ja_utilizei` e `currentlyUsing` for `true`.
 */
export function shouldShowCurrentlyUsingBadge(
  status: RecommendationStatus,
  currentlyUsing = false,
): boolean {
  return status === 'ja_utilizei' && currentlyUsing === true;
}

/**
 * Ordenação determinística de recomendações:
 * 1. `addedAt` mais recente primeiro (entradas sem data ficam após as datadas);
 * 2. `order` crescente (desempate estável quando `addedAt` ainda não existe);
 * 3. `name` (pt-BR) → `id`.
 */
export function compareRecommendations<T extends RecommendationEntryLike>(
  a: T,
  b: T,
): number {
  const timeA = a.data.addedAt ? a.data.addedAt.getTime() : -Infinity;
  const timeB = b.data.addedAt ? b.data.addedAt.getTime() : -Infinity;
  if (timeA !== timeB) {
    return timeB - timeA;
  }

  const orderA =
    typeof a.data.order === 'number' ? a.data.order : Number.POSITIVE_INFINITY;
  const orderB =
    typeof b.data.order === 'number' ? b.data.order : Number.POSITIVE_INFINITY;
  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return (
    a.data.name.localeCompare(b.data.name, 'pt-BR') ||
    a.id.localeCompare(b.id, 'en')
  );
}

/**
 * Conta quantas recomendações pertencem a cada categoria oficial.
 */
export function countRecommendationsByCategory(
  entries: ReadonlyArray<Pick<RecommendationEntryLike, 'data'>>,
): Record<'all' | RecommendationCategory, number> {
  const counts: Record<'all' | RecommendationCategory, number> = {
    all: entries.length,
    audio_perifericos: 0,
    livros_editoras: 0,
  };

  for (const entry of entries) {
    counts[entry.data.category] += 1;
  }

  return counts;
}

/**
 * Conta quantas recomendações pertencem a cada estado de experiência.
 */
export function countRecommendationsByStatus(
  entries: ReadonlyArray<Pick<RecommendationEntryLike, 'data'>>,
): Record<'all' | RecommendationStatus, number> {
  const counts: Record<'all' | RecommendationStatus, number> = {
    all: entries.length,
    ja_utilizei: 0,
    pesquisado: 0,
    lista_interesse: 0,
  };

  for (const entry of entries) {
    counts[entry.data.status] += 1;
  }

  return counts;
}

export interface RecommendationFilterOptions {
  category?: 'all' | RecommendationCategory;
  status?: 'all' | RecommendationStatus;
}

/**
 * Filtra recomendações combinando categoria e status de forma pura.
 */
export function filterRecommendations<T extends RecommendationEntryLike>(
  entries: ReadonlyArray<T>,
  options: RecommendationFilterOptions = {},
): T[] {
  const category = options.category ?? 'all';
  const status = options.status ?? 'all';

  return entries.filter((entry) => {
    if (category !== 'all' && entry.data.category !== category) {
      return false;
    }
    if (status !== 'all' && entry.data.status !== status) {
      return false;
    }
    return true;
  });
}
