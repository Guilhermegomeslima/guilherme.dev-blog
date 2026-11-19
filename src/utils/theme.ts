/**
 * Infraestrutura centralizada de tema (escuro padrão + modo claro opcional).
 * THEME-02 a THEME-04 — Fase THEME.
 *
 * Regras:
 * - O tema escuro é o padrão absoluto na primeira visita (sem usar prefers-color-scheme).
 * - A preferência manual é persistida em localStorage sob `THEME_STORAGE_KEY`.
 * - `LIGHT_THEME_ENABLED = true` (THEME-04) expõe o alternador no header e ativa
 *   a restauração anti-FOUC da preferência salva pelo visitante.
 */

export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'guilherme-dev-theme';

/**
 * Chave central de liberação do modo claro ao visitante.
 * Ativada em THEME-04 após conclusão da adaptação visual em THEME-03a, THEME-03b e THEME-03c.
 */
export const LIGHT_THEME_ENABLED = true;

export const THEME_META_COLORS: Record<ThemeMode, string> = {
  dark: '#080808',
  light: '#ede8df',
};

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Normaliza o valor lido do armazenamento para um tema válido.
 * Sem preferência explícita `'light'`, retorna sempre `'dark'`.
 */
export function resolveStoredTheme(
  rawValue: string | null | undefined,
  lightThemeEnabled = true,
): ThemeMode {
  if (!lightThemeEnabled) {
    return 'dark';
  }
  return rawValue === 'light' ? 'light' : 'dark';
}

/**
 * Retorna o próximo tema ao acionar o alternador manual.
 */
export function getNextTheme(current: ThemeMode): ThemeMode {
  return current === 'light' ? 'dark' : 'light';
}

/**
 * Retorna o rótulo acessível (aria-label) correspondente à próxima ação do botão.
 */
export function getThemeToggleLabel(current: ThemeMode): string {
  return current === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro';
}

/**
 * Retorna o anúncio acessível para leitores de tela após alternância manual.
 */
export function getThemeAnnouncement(active: ThemeMode): string {
  return active === 'light' ? 'Tema claro ativado' : 'Tema escuro ativado';
}

/**
 * Retorna a cor para `<meta name="theme-color">` correspondente ao tema ativo.
 */
export function getThemeMetaColor(theme: ThemeMode): string {
  return THEME_META_COLORS[theme];
}

/**
 * Lê com segurança a preferência salva no armazenamento (sem lançar erro em modo privado).
 */
export function readStoredTheme(
  storage: Pick<StorageLike, 'getItem'> | null | undefined,
  lightThemeEnabled = LIGHT_THEME_ENABLED,
): ThemeMode {
  if (!lightThemeEnabled || !storage) {
    return 'dark';
  }
  try {
    return resolveStoredTheme(
      storage.getItem(THEME_STORAGE_KEY),
      lightThemeEnabled,
    );
  } catch {
    return 'dark';
  }
}

/**
 * Persiste com segurança a preferência do visitante; retorna `true` se gravou com sucesso.
 */
export function writeStoredTheme(
  storage: Pick<StorageLike, 'setItem'> | null | undefined,
  theme: ThemeMode,
): boolean {
  if (!storage) {
    return false;
  }
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
}
