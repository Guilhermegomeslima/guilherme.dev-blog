import type { APIRoute } from 'astro';
import { CANONICAL_SITE } from '../utils/seo';

export const GET: APIRoute = async () => {
  const content = `User-agent: *
Allow: /

Sitemap: ${CANONICAL_SITE}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
