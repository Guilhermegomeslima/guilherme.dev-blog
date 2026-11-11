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

const movies = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/movies' }),
  schema: z.object({
    title: z.string(),
    director: z.string(),
    releaseYear: z.number().int(),
    genre: z.string().default('Cinema'),
    description: z.string(),
    opinion: z.string().optional(),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    scores: z.object({
      direction: z.number().min(0).max(100),
      screenplay: z.number().min(0).max(100),
      audiovisual: z.number().min(0).max(100),
      acting: z.number().min(0).max(100),
      pacing: z.number().min(0).max(100),
      feeling: z.number().min(0).max(100),
    }),
    isDemo: z.boolean().default(true),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['artist', 'album', 'track']),
    artist: z.string().optional(),
    album: z.string().optional(),
    genre: z.string(),
    year: z.number().int().optional(),
    comment: z.string().optional(),
    coverImage: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    listenUrl: z.string().optional(),
    isDemo: z.boolean().default(true),
  }),
});

const opensource = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/opensource' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    comment: z.string().optional(),
    status: z.enum(['uso_atualmente', 'ja_utilizei', 'recomendo']),
    websiteUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    license: z.string().optional(),
    icon: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    isDemo: z.boolean().default(true),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    year: z.number().int().optional(),
    genre: z.string().default('Computação / Ficção Científica'),
    status: z.enum(['lendo', 'lido', 'quero_ler']),
    favorite: z.boolean().default(false),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    description: z.string(),
    comment: z.string().optional(),
    isDemo: z.boolean().default(true),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    album: z.string(),
    albumSlug: z.string(),
    category: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    dimensions: z
      .object({
        width: z.number().int(),
        height: z.number().int(),
      })
      .optional(),
    credit: z.string(),
    license: z.string(),
    featured: z.boolean().default(false),
    isDemo: z.boolean().default(true),
  }),
});

export const collections = {
  articles,
  projects,
  games,
  movies,
  music,
  opensource,
  books,
  gallery,
};
