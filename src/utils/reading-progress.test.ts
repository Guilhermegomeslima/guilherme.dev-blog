/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadingProgress } from './reading-progress.ts';

describe('calculateReadingProgress — Progresso de leitura (FRT-01)', () => {
  it('deve retornar 0% e inativo antes de a área principal alcançar o topo da viewport', () => {
    const result = calculateReadingProgress({
      contentTop: 320,
      contentHeight: 3000,
      viewportHeight: 800,
    });

    assert.deepEqual(result, { ratio: 0, percent: 0, active: false });
  });

  it('deve retornar 0% no ponto exato de entrada (contentTop = 0)', () => {
    const result = calculateReadingProgress({
      contentTop: 0,
      contentHeight: 2800,
      viewportHeight: 800,
    });

    assert.deepEqual(result, { ratio: 0, percent: 0, active: false });
  });

  it('deve calcular corretamente o progresso intermediário (25%, 50%, 75%)', () => {
    // scrollableDistance = 2800 - 800 = 2000
    const q1 = calculateReadingProgress({
      contentTop: -500,
      contentHeight: 2800,
      viewportHeight: 800,
    });
    assert.deepEqual(q1, { ratio: 0.25, percent: 25, active: true });

    const mid = calculateReadingProgress({
      contentTop: -1000,
      contentHeight: 2800,
      viewportHeight: 800,
    });
    assert.deepEqual(mid, { ratio: 0.5, percent: 50, active: true });

    const q3 = calculateReadingProgress({
      contentTop: -1500,
      contentHeight: 2800,
      viewportHeight: 800,
    });
    assert.deepEqual(q3, { ratio: 0.75, percent: 75, active: true });
  });

  it('deve atingir 100% ao final da área de leitura e permanecer em 100% durante o footer', () => {
    const exactEnd = calculateReadingProgress({
      contentTop: -2000,
      contentHeight: 2800,
      viewportHeight: 800,
    });
    assert.deepEqual(exactEnd, { ratio: 1, percent: 100, active: true });

    // Rolando além do conteúdo principal (ex.: seções relacionadas e footer)
    const pastEnd = calculateReadingProgress({
      contentTop: -2650,
      contentHeight: 2800,
      viewportHeight: 800,
    });
    assert.deepEqual(pastEnd, { ratio: 1, percent: 100, active: true });
  });

  it('deve lidar corretamente com conteúdos curtos (menores ou iguais à viewport)', () => {
    const beforeShort = calculateReadingProgress({
      contentTop: 120,
      contentHeight: 500,
      viewportHeight: 800,
    });
    assert.deepEqual(beforeShort, { ratio: 0, percent: 0, active: false });

    const atShort = calculateReadingProgress({
      contentTop: 0,
      contentHeight: 500,
      viewportHeight: 800,
    });
    assert.deepEqual(atShort, { ratio: 1, percent: 100, active: true });

    const equalHeight = calculateReadingProgress({
      contentTop: -10,
      contentHeight: 800,
      viewportHeight: 800,
    });
    assert.deepEqual(equalHeight, { ratio: 1, percent: 100, active: true });
  });

  it('deve retornar 0% com segurança diante de dimensões inválidas ou nulas', () => {
    assert.deepEqual(
      calculateReadingProgress({
        contentTop: -100,
        contentHeight: 0,
        viewportHeight: 800,
      }),
      { ratio: 0, percent: 0, active: false },
    );

    assert.deepEqual(
      calculateReadingProgress({
        contentTop: Number.NaN,
        contentHeight: 2000,
        viewportHeight: 800,
      }),
      { ratio: 0, percent: 0, active: false },
    );
  });
});
