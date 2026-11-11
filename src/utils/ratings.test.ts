import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGameScore,
  calculateMovieScore,
  formatScore,
  type GameScores,
  type MovieScores,
} from './ratings.ts';

describe('calculateGameScore — Cálculo da média dos 5 critérios de jogos', () => {
  it('deve calcular a média aritmética simples exata para entradas válidas', () => {
    const scores: GameScores = {
      mechanics: 88,
      plot: 92,
      aesthetics: 96,
      retention: 84,
      feeling: 90,
    };
    // (88 + 92 + 96 + 84 + 90) / 5 = 450 / 5 = 90
    const result = calculateGameScore(scores);
    assert.equal(result, 90);
  });

  it('deve calcular a média corretamente quando o resultado tem casas decimais', () => {
    const scores: GameScores = {
      mechanics: 80,
      plot: 85,
      aesthetics: 90,
      retention: 85,
      feeling: 87,
    };
    // (80 + 85 + 90 + 85 + 87) / 5 = 427 / 5 = 85.4
    const result = calculateGameScore(scores);
    assert.equal(result, 85.4);
  });

  it('deve retornar 0 quando todos os critérios forem 0 (limite inferior)', () => {
    const scores: GameScores = {
      mechanics: 0,
      plot: 0,
      aesthetics: 0,
      retention: 0,
      feeling: 0,
    };
    assert.equal(calculateGameScore(scores), 0);
  });

  it('deve retornar 100 quando todos os critérios forem 100 (limite superior)', () => {
    const scores: GameScores = {
      mechanics: 100,
      plot: 100,
      aesthetics: 100,
      retention: 100,
      feeling: 100,
    };
    assert.equal(calculateGameScore(scores), 100);
  });

  it('deve lançar erro se qualquer nota for menor que 0', () => {
    const scores = {
      mechanics: -1,
      plot: 80,
      aesthetics: 80,
      retention: 80,
      feeling: 80,
    } as unknown as GameScores;

    assert.throws(
      () => calculateGameScore(scores),
      /Critério 'Mecânica' inválido/,
    );
  });

  it('deve lançar erro se qualquer nota for maior que 100', () => {
    const scores = {
      mechanics: 80,
      plot: 101,
      aesthetics: 80,
      retention: 80,
      feeling: 80,
    } as unknown as GameScores;

    assert.throws(
      () => calculateGameScore(scores),
      /Critério 'Enredo' inválido/,
    );
  });

  it('deve lançar erro se qualquer critério for NaN', () => {
    const scores = {
      mechanics: 80,
      plot: NaN,
      aesthetics: 80,
      retention: 80,
      feeling: 80,
    } as unknown as GameScores;

    assert.throws(
      () => calculateGameScore(scores),
      /Critério 'Enredo' inválido/,
    );
  });

  it('deve lançar erro se qualquer critério for não numérico ou ausente', () => {
    const scores = {
      mechanics: 80,
      plot: 80,
      aesthetics: '90',
      retention: 80,
      feeling: 80,
    } as unknown as GameScores;

    assert.throws(
      () => calculateGameScore(scores),
      /Critério 'Estética' inválido/,
    );
  });
});

describe('calculateMovieScore — Cálculo da média dos 6 critérios de filmes', () => {
  it('deve calcular a média aritmética simples exata para entradas válidas (6 eixos)', () => {
    const scores: MovieScores = {
      direction: 84,
      screenplay: 79,
      audiovisual: 87,
      acting: 80,
      pacing: 72,
      feeling: 84,
    };
    // (84 + 79 + 87 + 80 + 72 + 84) / 6 = 486 / 6 = 81
    const result = calculateMovieScore(scores);
    assert.equal(result, 81);
  });

  it('deve calcular a média corretamente quando o resultado tem casas decimais periódicas', () => {
    const scores: MovieScores = {
      direction: 88,
      screenplay: 82,
      audiovisual: 95,
      acting: 85,
      pacing: 78,
      feeling: 90,
    };
    // (88 + 82 + 95 + 85 + 78 + 90) / 6 = 518 / 6 = 86.33333333333333
    const result = calculateMovieScore(scores);
    assert.equal(result, 518 / 6);
    assert.equal(formatScore(result), '86.3');
  });

  it('deve retornar 0 quando todos os critérios forem 0 (limite inferior)', () => {
    const scores: MovieScores = {
      direction: 0,
      screenplay: 0,
      audiovisual: 0,
      acting: 0,
      pacing: 0,
      feeling: 0,
    };
    assert.equal(calculateMovieScore(scores), 0);
  });

  it('deve retornar 100 quando todos os critérios forem 100 (limite superior)', () => {
    const scores: MovieScores = {
      direction: 100,
      screenplay: 100,
      audiovisual: 100,
      acting: 100,
      pacing: 100,
      feeling: 100,
    };
    assert.equal(calculateMovieScore(scores), 100);
  });

  it('deve lançar erro se qualquer nota for menor que 0', () => {
    const scores = {
      direction: -1,
      screenplay: 80,
      audiovisual: 80,
      acting: 80,
      pacing: 80,
      feeling: 80,
    } as unknown as MovieScores;

    assert.throws(
      () => calculateMovieScore(scores),
      /Critério 'Direção' inválido/,
    );
  });

  it('deve lançar erro se qualquer nota for maior que 100', () => {
    const scores = {
      direction: 80,
      screenplay: 80,
      audiovisual: 80,
      acting: 105,
      pacing: 80,
      feeling: 80,
    } as unknown as MovieScores;

    assert.throws(
      () => calculateMovieScore(scores),
      /Critério 'Atuação' inválido/,
    );
  });

  it('deve lançar erro se qualquer critério for NaN', () => {
    const scores = {
      direction: 80,
      screenplay: 80,
      audiovisual: 80,
      acting: 80,
      pacing: NaN,
      feeling: 80,
    } as unknown as MovieScores;

    assert.throws(
      () => calculateMovieScore(scores),
      /Critério 'Ritmo' inválido/,
    );
  });

  it('deve lançar erro se qualquer critério for não numérico ou ausente', () => {
    const scores = {
      direction: 80,
      screenplay: 80,
      audiovisual: '90',
      acting: 80,
      pacing: 80,
      feeling: 80,
    } as unknown as MovieScores;

    assert.throws(
      () => calculateMovieScore(scores),
      /Critério 'Audiovisual' inválido/,
    );
  });

  it('deve garantir que metadados (como diretor e ano de lançamento) não influenciam o cálculo', () => {
    const scores = {
      direction: 90,
      screenplay: 92,
      audiovisual: 88,
      acting: 91,
      pacing: 86,
      feeling: 89,
      // Metadados adicionais hipotéticos passados junto
      director: 'Diretor Fictício B',
      releaseYear: 2021,
      randomFactor: 9999,
    } as unknown as MovieScores;

    // (90 + 92 + 88 + 91 + 86 + 89) / 6 = 536 / 6 = 89.33333333333333
    const result = calculateMovieScore(scores);
    assert.equal(result, 536 / 6);
    assert.equal(formatScore(result), '89.3');
  });
});

describe('formatScore — Formatação visual da nota calculada', () => {
  it('deve formatar número inteiro sem casas decimais artificiais', () => {
    assert.equal(formatScore(90), '90');
    assert.equal(formatScore(100), '100');
    assert.equal(formatScore(0), '0');
  });

  it('deve formatar número fracionário com 1 casa decimal', () => {
    assert.equal(formatScore(85.4), '85.4');
    assert.equal(formatScore(77.6666666), '77.7');
  });
});
