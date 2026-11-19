/// <reference path="../types/node-test.d.ts" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  LIGHT_THEME_ENABLED,
  THEME_META_COLORS,
  THEME_STORAGE_KEY,
  getNextTheme,
  getThemeMetaColor,
  getThemeToggleLabel,
  readStoredTheme,
  resolveStoredTheme,
  writeStoredTheme,
  type StorageLike,
} from './theme.ts';

function createMemoryStorage(
  initial: Record<string, string> = {},
): StorageLike {
  const store = new Map(Object.entries(initial));
  return {
    getItem(key: string) {
      return store.has(key) ? (store.get(key) ?? null) : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe('theme — Resolução de preferência e padrão escuro absoluto (THEME-02)', () => {
  it('deve manter LIGHT_THEME_ENABLED desativado enquanto o tema claro não estiver finalizado', () => {
    assert.equal(LIGHT_THEME_ENABLED, false);
  });

  it('deve iniciar sempre no tema escuro sem preferência salva ou com valores inválidos', () => {
    assert.equal(resolveStoredTheme(null, true), 'dark');
    assert.equal(resolveStoredTheme(undefined, true), 'dark');
    assert.equal(resolveStoredTheme('', true), 'dark');
    assert.equal(resolveStoredTheme('system', true), 'dark');
    assert.equal(resolveStoredTheme('dark', true), 'dark');
  });

  it('deve ativar o tema claro apenas quando explicitamente salvo e habilitado', () => {
    assert.equal(resolveStoredTheme('light', true), 'light');
    assert.equal(resolveStoredTheme('light', false), 'dark');
  });

  it('deve alternar corretamente entre dark e light', () => {
    assert.equal(getNextTheme('dark'), 'light');
    assert.equal(getNextTheme('light'), 'dark');
  });

  it('deve fornecer rótulos acessíveis e theme-color coerentes com cada estado', () => {
    assert.equal(getThemeToggleLabel('dark'), 'Ativar tema claro');
    assert.equal(getThemeToggleLabel('light'), 'Ativar tema escuro');
    assert.equal(getThemeMetaColor('dark'), THEME_META_COLORS.dark);
    assert.equal(getThemeMetaColor('light'), THEME_META_COLORS.light);
  });
});

describe('theme — Persistência segura em localStorage e fallback sem armazenamento', () => {
  it('deve gravar e recuperar a preferência quando localStorage estiver disponível', () => {
    const storage = createMemoryStorage();

    assert.equal(readStoredTheme(storage, true), 'dark');
    assert.equal(writeStoredTheme(storage, 'light'), true);
    assert.equal(storage.getItem(THEME_STORAGE_KEY), 'light');
    assert.equal(readStoredTheme(storage, true), 'light');
    assert.equal(readStoredTheme(storage, false), 'dark');
  });

  it('deve degradar com segurança para tema escuro quando storage falhar ou for nulo', () => {
    const throwingStorage: StorageLike = {
      getItem() {
        throw new Error('SecurityError: storage disabled');
      },
      setItem() {
        throw new Error('QuotaExceededError');
      },
    };

    assert.equal(readStoredTheme(throwingStorage, true), 'dark');
    assert.equal(readStoredTheme(null, true), 'dark');
    assert.equal(writeStoredTheme(throwingStorage, 'light'), false);
    assert.equal(writeStoredTheme(null, 'light'), false);
  });
});
