/**
 * Utilitários puros da seção Resenhas (EXP-03A).
 * Centraliza rótulos de mídia, ordenação determinística, contagens de filtro
 * e resolução de vínculos opcionais com as bibliotecas de Jogos, Filmes e Livros.
 */
import type { PublishableEntry } from './seo.ts';

export type ReviewMediaType = 'jogo' | 'filme' | 'livro';

export interface ReviewMediaMeta {
  type: ReviewMediaType;
  singular: string;
  plural: string;
}

export const REVIEW_MEDIA_TYPES: Readonly<
  Record<ReviewMediaType, ReviewMediaMeta>
> = Object.freeze({
  jogo: { type: 'jogo', singular: 'Jogo', plural: 'Jogos' },
  filme: { type: 'filme', singular: 'Filme', plural: 'Filmes' },
  livro: { type: 'livro', singular: 'Livro', plural: 'Livros' },
});

export const REVIEW_MEDIA_ORDER: readonly ReviewMediaType[] = [
  'jogo',
  'filme',
  'livro',
];

export interface ReviewSortableData extends PublishableEntry {
  title: string;
  mediaType: ReviewMediaType;
  publishedAt?: Date;
  featured?: boolean;
}

export interface ReviewSortableEntry {
  id: string;
  data: ReviewSortableData;
}

/**
 * Ordenação determinística de resenhas:
 * 1. Data de publicação mais recente primeiro (entradas sem data ficam após as datadas);
 * 2. Destaque (`featured: true`) primeiro;
 * 3. Título (pt-BR) → `id`.
 */
export function compareReviews<T extends ReviewSortableEntry>(
  a: T,
  b: T,
): number {
  const timeA = a.data.publishedAt ? a.data.publishedAt.getTime() : -Infinity;
  const timeB = b.data.publishedAt ? b.data.publishedAt.getTime() : -Infinity;
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
 * Conta quantas resenhas pertencem a cada tipo de mídia para exibir nos filtros.
 */
export function countReviewsByMediaType(
  entries: ReadonlyArray<{ data: { mediaType: ReviewMediaType } }>,
): Record<'all' | ReviewMediaType, number> {
  const counts: Record<'all' | ReviewMediaType, number> = {
    all: entries.length,
    jogo: 0,
    filme: 0,
    livro: 0,
  };

  for (const entry of entries) {
    counts[entry.data.mediaType] += 1;
  }

  return counts;
}

export interface RelatedWorkRef {
  collection: 'games' | 'movies' | 'books';
  id: string;
}

export interface ResolvedRelatedWorkLink {
  href: string;
  sectionLabel: string;
  actionLabel: string;
}

const COLLECTION_ROUTE_MAP: Readonly<
  Record<
    RelatedWorkRef['collection'],
    { basePath: string; sectionLabel: string; actionLabel: string }
  >
> = Object.freeze({
  games: {
    basePath: '/jogos',
    sectionLabel: 'Biblioteca de Jogos',
    actionLabel: 'Ver ficha e avaliação em Jogos',
  },
  movies: {
    basePath: '/filmes',
    sectionLabel: 'Catálogo de Filmes',
    actionLabel: 'Ver ficha e avaliação em Filmes',
  },
  books: {
    basePath: '/livros',
    sectionLabel: 'Biblioteca de Livros',
    actionLabel: 'Ver registro na biblioteca de Livros',
  },
});

/**
 * Resolve o destino interno canônico para uma obra vinculada em Jogos, Filmes ou Livros.
 */
export function resolveRelatedWorkLink(
  ref: RelatedWorkRef,
): ResolvedRelatedWorkLink {
  const meta = COLLECTION_ROUTE_MAP[ref.collection];
  return {
    href: `${meta.basePath}/${ref.id}/`,
    sectionLabel: meta.sectionLabel,
    actionLabel: meta.actionLabel,
  };
}

/**
 * Estima tempo de leitura em minutos a partir do texto editorial.
 */
export function estimateReadingMinutes(body: string | undefined): number {
  const words = (body || '')
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
