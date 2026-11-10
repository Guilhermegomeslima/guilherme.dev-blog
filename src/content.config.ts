import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    category: z.string().default('Tecnologia'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    isDemo: z.boolean().default(false),
  }),
});

export const collections = {
  articles,
};
