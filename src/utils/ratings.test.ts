import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateGameScore, formatScore, type GameScores } from './ratings.ts';

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
