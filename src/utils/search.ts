/**
 * Utilitários para busca local nos catálogos do blog.
 * Suporta correspondência insensível a maiúsculas/minúsculas,
 * remoção de diacríticos (acentos), colapso de espaços extras
 * e correspondência de múltiplos termos parciais.
 */

/**
 * Normaliza uma string para busca:
 * - Converte para minúsculas;
 * - Remove acentos e diacríticos (via decomposição NFD);
 * - Colapsa múltiplos espaços em branco em um único espaço;
 * - Remove espaços no início e no fim.
 */
export function normalizeSearchText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verifica se todos os termos da busca estão presentes no texto alvo.
 * Cada palavra digitada pelo usuário deve ser encontrada (em qualquer ordem).
 */
export function matchesSearchTerms(
  searchableText: string | null | undefined,
  query: string,
): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const normalizedTarget = normalizeSearchText(searchableText);
  if (!normalizedTarget) return false;

  const terms = normalizedQuery.split(' ').filter(Boolean);
  return terms.every((term) => normalizedTarget.includes(term));
}
