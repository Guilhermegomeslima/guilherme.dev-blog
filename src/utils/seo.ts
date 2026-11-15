/**
 * Utilitários de SEO, canonicalização e dados estruturados (Schema.org).
 * QLT-03 — Fase 5: Qualidade e Descoberta.
 */

export const CANONICAL_SITE = 'https://guilhermegomesdev-blog.vercel.app';

/**
 * Normaliza um caminho para URL canônica absoluta da produção principal (Vercel).
 * Remove eventuais prefixos de espelho (como /guilherme.dev-blog) e assegura trailing slash.
 */
export function toCanonicalUrl(pathname: string): string {
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return pathname;
  }
  const clean = pathname.replace(/^\/guilherme\.dev-blog/, '') || '/';
  const normalized = clean.endsWith('/') ? clean : `${clean}/`;
  return `${CANONICAL_SITE}${normalized === '//' ? '/' : normalized}`;
}

/**
 * Converte um caminho de imagem local em URL absoluta na produção principal para Open Graph e Twitter Cards.
 */
export function toAbsoluteImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const clean = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${CANONICAL_SITE}${clean}`;
}

/**
 * Serialização segura de JSON-LD para prevenir injeção HTML / fechamento indevido de <script>.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Interface unificada para checagem tipada de itens publicáveis.
 * Impede que rascunhos ou dados demonstrativos entrem no sitemap ou sejam indexados.
 */
export interface PublishableEntry {
  isDemo?: boolean;
  draft?: boolean;
}

/**
 * Predicado de publicação tipado.
 * Retorna true exclusivamente para registros publicados reais.
 */
export function isPublishable(entry: PublishableEntry): boolean {
  return entry.isDemo !== true && entry.draft !== true;
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  inLanguage: string;
  author: {
    '@type': 'Person';
    name: string;
    url: string;
  };
}

export function getWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'guilherme.dev',
    url: `${CANONICAL_SITE}/`,
    description:
      'Blog pessoal e acervo tecnológico de Guilherme Gomes: desenvolvimento web, Linux, projetos open source, jogos, leituras e cultura.',
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: 'Guilherme Gomes',
      url: `${CANONICAL_SITE}/sobre/`,
    },
  };
}

export interface ProfilePageSchema {
  '@context': 'https://schema.org';
  '@type': 'ProfilePage';
  name: string;
  url: string;
  description: string;
  mainEntity: {
    '@type': 'Person';
    name: string;
    url: string;
    image: string;
    jobTitle: string;
    description: string;
    sameAs: string[];
  };
}

export function getProfilePageSchema(): ProfilePageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Sobre // Arquivo Pessoal — guilherme.dev',
    url: `${CANONICAL_SITE}/sobre/`,
    description:
      'Arquivo pessoal e trajetória de Guilherme Gomes: estudante de ADS, desenvolvedor em aprendizado, entusiasta de Linux, competências técnicas e projetos.',
    mainEntity: {
      '@type': 'Person',
      name: 'Guilherme Gomes',
      url: `${CANONICAL_SITE}/sobre/`,
      image: 'https://github.com/Guilhermegomeslima.png',
      jobTitle:
        'Desenvolvedor em aprendizado & entusiasta de sistemas operacionais',
      description:
        'Estudante de Análise e Desenvolvimento de Sistemas pela FAMINAS, entusiasta de Linux, código aberto e desenvolvimento web.',
      sameAs: [
        'https://github.com/Guilhermegomeslima',
        'https://www.linkedin.com/in/guilhermegomes-dev/',
        'https://www.instagram.com/guilherme.glmg/',
        'https://linktr.ee/guilhermegl.sites',
      ],
    },
  };
}

export interface BlogPostingSchema {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  inLanguage: string;
  image?: string;
  keywords?: string[];
  author: {
    '@type': 'Person';
    name: string;
    url: string;
  };
  publisher: {
    '@type': 'Person';
    name: string;
    url: string;
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export function getBlogPostingSchema(article: {
  id: string;
  title: string;
  description: string;
  publishedAt: Date;
  imageUrl?: string;
  tags?: string[];
}): BlogPostingSchema {
  const articleUrl = `${CANONICAL_SITE}/artigos/${article.id}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt.toISOString(),
    url: articleUrl,
    inLanguage: 'pt-BR',
    ...(article.imageUrl
      ? { image: toAbsoluteImageUrl(article.imageUrl) }
      : {}),
    ...(article.tags && article.tags.length > 0
      ? { keywords: article.tags }
      : {}),
    author: {
      '@type': 'Person',
      name: 'Guilherme Gomes',
      url: `${CANONICAL_SITE}/sobre/`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Guilherme Gomes',
      url: `${CANONICAL_SITE}/sobre/`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };
}
