export interface GameScores {
  mechanics: number;
  plot: number;
  aesthetics: number;
  retention: number;
  feeling: number;
}

export interface MovieScores {
  direction: number;
  screenplay: number;
  audiovisual: number;
  acting: number;
  pacing: number;
  feeling: number;
}

/**
 * Calcula a média aritmética simples dos cinco critérios obrigatórios de jogos (0 a 100), sem pesos.
 */
export function calculateGameScore(scores: GameScores): number {
  const criteria = [
    { name: 'Mecânica', val: scores.mechanics },
    { name: 'Enredo', val: scores.plot },
    { name: 'Estética', val: scores.aesthetics },
    { name: 'Retenção', val: scores.retention },
    { name: 'Feeling', val: scores.feeling },
  ];

  for (const item of criteria) {
    if (
      typeof item.val !== 'number' ||
      Number.isNaN(item.val) ||
      item.val < 0 ||
      item.val > 100
    ) {
      throw new Error(
        `Critério '${item.name}' inválido: ${item.val}. A nota deve ser um número entre 0 e 100.`,
      );
    }
  }

  const sum =
    scores.mechanics +
    scores.plot +
    scores.aesthetics +
    scores.retention +
    scores.feeling;

  return sum / 5;
}

/**
 * Calcula a média aritmética simples dos seis critérios obrigatórios de filmes (0 a 100), sem pesos.
 * Diretor e ano de lançamento são metadados e nunca influenciam o cálculo.
 */
export function calculateMovieScore(scores: MovieScores): number {
  const criteria = [
    { name: 'Direção', val: scores.direction },
    { name: 'Roteiro', val: scores.screenplay },
    { name: 'Audiovisual', val: scores.audiovisual },
    { name: 'Atuação', val: scores.acting },
    { name: 'Ritmo', val: scores.pacing },
    { name: 'Feeling', val: scores.feeling },
  ];

  for (const item of criteria) {
    if (
      typeof item.val !== 'number' ||
      Number.isNaN(item.val) ||
      item.val < 0 ||
      item.val > 100
    ) {
      throw new Error(
        `Critério '${item.name}' inválido: ${item.val}. A nota deve ser um número entre 0 e 100.`,
      );
    }
  }

  const sum =
    scores.direction +
    scores.screenplay +
    scores.audiovisual +
    scores.acting +
    scores.pacing +
    scores.feeling;

  return sum / 6;
}

/**
 * Formata a exibição de uma nota (exibe inteiro se for exato, ou com 1 casa decimal).
 */
export function formatScore(score: number): string {
  return Number.isInteger(score) ? score.toString() : score.toFixed(1);
}
