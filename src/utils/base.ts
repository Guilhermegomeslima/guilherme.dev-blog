/**
 * Adiciona o prefixo base configurado pelo Astro (necessário para GitHub Pages
 * com subcaminho do repositório), preservando links na raiz para Vercel e ambiente local.
 */
export function withBase(path: string, customBase?: string): string {
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('#')
  ) {
    return path;
  }

  const rawBase =
    customBase ??
    (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : '/');

  const base = rawBase.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${cleanPath}`;
}
