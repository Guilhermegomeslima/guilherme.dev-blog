/**
 * Cálculo puro do progresso de leitura (0 a 100) restrito à área principal
 * de leitura, ignorando hero, rodapé e seções relacionadas.
 * FRT-01 — Fase FRONT-01.
 */

export interface ReadingProgressMetrics {
  /** Posição vertical do topo do contêiner em relação à viewport (rect.top). */
  contentTop: number;
  /** Altura total do contêiner de leitura em pixels (rect.height). */
  contentHeight: number;
  /** Altura atual da viewport em pixels (window.innerHeight). */
  viewportHeight: number;
}

export interface ReadingProgressState {
  /** Fração normalizada entre 0 e 1 (para transform: scaleX). */
  ratio: number;
  /** Percentual inteiro entre 0 e 100 (para aria-valuenow). */
  percent: number;
  /** Indica se a leitura da área principal já começou. */
  active: boolean;
}

/**
 * Calcula o progresso de leitura dentro do intervalo [0, 1] / [0, 100].
 * - Antes do início do contêiner (contentTop > 0): 0% e inativo.
 * - No fim do contêiner (contentTop + contentHeight <= viewportHeight): 100%.
 * - Conteúdo menor ou igual à viewport: 0% antes de alcançar o topo, 100% após.
 */
export function calculateReadingProgress({
  contentTop,
  contentHeight,
  viewportHeight,
}: ReadingProgressMetrics): ReadingProgressState {
  if (
    !Number.isFinite(contentTop) ||
    !Number.isFinite(contentHeight) ||
    !Number.isFinite(viewportHeight) ||
    contentHeight <= 0 ||
    viewportHeight <= 0
  ) {
    return { ratio: 0, percent: 0, active: false };
  }

  if (contentTop > 0) {
    return { ratio: 0, percent: 0, active: false };
  }

  const scrollableDistance = contentHeight - viewportHeight;

  if (scrollableDistance <= 0) {
    const contentBottom = contentTop + contentHeight;
    return contentBottom <= viewportHeight
      ? { ratio: 1, percent: 100, active: true }
      : { ratio: 0, percent: 0, active: false };
  }

  const rawRatio = -contentTop / scrollableDistance;
  const ratio = Math.min(1, Math.max(0, rawRatio));
  const percent = Math.round(ratio * 100);

  return {
    ratio,
    percent,
    active: ratio > 0,
  };
}
