/**
 * Utilitário compartilhado para resolução de URL canônica e fluxo de
 * compartilhamento com Web Share API, Clipboard API e fallback manual.
 * FRT-03 — Fase FRONT-01.
 */
import { toCanonicalUrl } from './seo.ts';

export interface SharePayload {
  title: string;
  text?: string;
  url: string;
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'manual';

export interface ShareDependencies {
  nativeShare?: (data: SharePayload) => Promise<void>;
  copyText?: (text: string) => Promise<void>;
}

/**
 * Garante que a URL compartilhada seja sempre a URL canônica da produção principal,
 * nunca localhost nem prefixos de espelho (/guilherme.dev-blog).
 */
export function resolveShareUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return toCanonicalUrl('/');
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return toCanonicalUrl(parsed.pathname);
    } catch {
      return toCanonicalUrl('/');
    }
  }

  return toCanonicalUrl(trimmed);
}

/**
 * Identifica cancelamento explícito do diálogo nativo de compartilhamento.
 */
export function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: unknown }).name === 'AbortError'
  );
}

/**
 * Executa o fluxo de compartilhamento:
 * 1. Tenta `nativeShare` quando disponível.
 *    - Se o usuário cancelar (`AbortError`), retorna `'cancelled'` sem copiar.
 * 2. Caso indisponível (ou falha não relacionada a cancelamento), tenta `copyText`.
 *    - Em sucesso, retorna `'copied'`.
 * 3. Se a cópia falhar ou estiver indisponível, retorna `'manual'` para exibição
 *    do campo selecionável.
 */
export async function shareContent(
  payload: SharePayload,
  deps: ShareDependencies = {},
): Promise<ShareOutcome> {
  const canonicalUrl = resolveShareUrl(payload.url);
  const normalizedPayload: SharePayload = {
    title: payload.title,
    ...(payload.text ? { text: payload.text } : {}),
    url: canonicalUrl,
  };

  if (typeof deps.nativeShare === 'function') {
    try {
      await deps.nativeShare(normalizedPayload);
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) {
        return 'cancelled';
      }
    }
  }

  if (typeof deps.copyText === 'function') {
    try {
      await deps.copyText(canonicalUrl);
      return 'copied';
    } catch {
      return 'manual';
    }
  }

  return 'manual';
}
