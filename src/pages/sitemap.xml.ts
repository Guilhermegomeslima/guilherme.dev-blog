import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  getPublishedExpansionStaticRoutes,
  shouldIncludeInSitemap,
} from '../utils/editorial-flags';
import { CANONICAL_SITE, isPublishable } from '../utils/seo';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export const GET: APIRoute = async () => {
  // 1. Rotas estáticas principais (excluídos: 404, alias /open-source/ e rotas auxiliares)
  const staticPaths = [
    '/',
    '/sobre/',
    '/projetos/',
    '/linux/',
    '/jogos/',
    '/filmes/',
    '/livros/',
    '/artigos/',
    '/musica/',
    '/opensource/',
    '/galeria/',
    ...getPublishedExpansionStaticRoutes(),
  ];

  const entries: SitemapEntry[] = staticPaths.map((path) => ({
    loc: `${CANONICAL_SITE}${path}`,
  }));

  // 2. Coleções de conteúdo com rotas públicas individuais
  // Filtros estritos: apenas itens reais publicados (isPublishable)

  // Artigos — possui data confiável de publicação para lastmod
  const articles = await getCollection('articles', ({ data }) =>
    isPublishable(data),
  );
  for (const article of articles) {
    const lastmod = article.data.publishedAt
      ? article.data.publishedAt.toISOString().split('T')[0]
      : undefined;
    entries.push({
      loc: `${CANONICAL_SITE}/artigos/${article.id}/`,
      lastmod,
    });
  }

  // Jogos
  const games = await getCollection('games', ({ data }) => isPublishable(data));
  for (const game of games) {
    entries.push({
      loc: `${CANONICAL_SITE}/jogos/${game.id}/`,
    });
  }

  // Filmes
  const movies = await getCollection('movies', ({ data }) =>
    isPublishable(data),
  );
  for (const movie of movies) {
    entries.push({
      loc: `${CANONICAL_SITE}/filmes/${movie.id}/`,
    });
  }

  // Livros
  const books = await getCollection('books', ({ data }) => isPublishable(data));
  for (const book of books) {
    entries.push({
      loc: `${CANONICAL_SITE}/livros/${book.id}/`,
    });
  }

  // Galeria — rotas dos álbuns individuais
  const galleryItems = await getCollection('gallery', ({ data }) =>
    isPublishable(data),
  );
  const albumSlugs = Array.from(
    new Set(galleryItems.map((img) => img.data.albumSlug)),
  ).sort();
  for (const slug of albumSlugs) {
    entries.push({
      loc: `${CANONICAL_SITE}/galeria/${slug}/`,
    });
  }

  // Resenhas — apenas quando a seção estiver aprovada e a entrada for publicável
  const reviews = await getCollection('reviews', ({ data }) =>
    shouldIncludeInSitemap('reviews', data),
  );
  for (const review of reviews) {
    const refDate = review.data.updatedAt ?? review.data.publishedAt;
    entries.push({
      loc: `${CANONICAL_SITE}/resenhas/${review.id}/`,
      lastmod: refDate ? refDate.toISOString().split('T')[0] : undefined,
    });
  }

  // Diário Linux — apenas quando a seção estiver aprovada e a entrada for publicável
  const diaryEntries = await getCollection('linuxDiary', ({ data }) =>
    shouldIncludeInSitemap('linuxDiary', data),
  );
  for (const entry of diaryEntries) {
    const refDate = entry.data.updatedAt ?? entry.data.publishedAt;
    entries.push({
      loc: `${CANONICAL_SITE}/diario-linux/${entry.id}/`,
      lastmod: refDate ? refDate.toISOString().split('T')[0] : undefined,
    });
  }

  // 3. Montagem do XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>${
      e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''
    }
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
