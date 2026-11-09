/**
 * Adiciona o prefixo base configurado pelo Astro (necessário para GitHub Pages
 * com subcaminho do repositório), preservando links na raiz para Vercel e ambiente local.
 */
export function withBase(path: string): string {
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('#')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${cleanPath}`;
}
