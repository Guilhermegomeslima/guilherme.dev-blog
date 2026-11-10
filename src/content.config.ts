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

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default('Web'),
    tags: z.array(z.string()).default([]),
    repoUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    featured: z.boolean().default(false),
    isDemo: z.boolean().default(false),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    releaseYear: z.number().int(),
    genre: z.string(),
    developer: z.string().optional(),
    coverImage: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    description: z.string(),
    opinion: z.string().optional(),
    scores: z.object({
      mechanics: z.number().min(0).max(100),
      plot: z.number().min(0).max(100),
      aesthetics: z.number().min(0).max(100),
      retention: z.number().min(0).max(100),
      feeling: z.number().min(0).max(100),
    }),
    isDemo: z.boolean().default(true),
  }),
});

export const collections = {
  articles,
  projects,
  games,
};
