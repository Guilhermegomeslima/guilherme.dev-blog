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
    platform: z.string(),
    status: z.enum([
      'Concluido',
      'Platinado',
      'Jogando',
      'Parado',
      'Descontinuado',
    ]),
    coverImage: z.object({
      url: z.string(),
      alt: z.string(),
      isPlaceholder: z.boolean().default(true),
    }),
    description: z.string().optional(),
    opinion: z.string().optional(),
    scores: z.object({
      mechanics: z.number().min(0).max(100),
      plot: z.number().min(0).max(100).nullable(),
      aesthetics: z.number().min(0).max(100),
      retention: z.number().min(0).max(100),
      feeling: z.number().min(0).max(100),
    }),
    isDemo: z.boolean().default(false),
  }),
});

const movies = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/movies' }),
  schema: z.object({
    title: z.string(),
    director: z.string(),
    releaseYear: z.number().int(),
    genre: z.string().default('Cinema'),
    description: z.string().optional(),
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
    isDemo: z.boolean().default(false),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['artist', 'album', 'track']),
    artist: z.string().optional(),
    album: z.string().optional(),
    genre: z.string().optional(),
    year: z.number().int().optional(),
    comment: z.string().optional(),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    listenUrl: z.string().optional(),
    isDemo: z.boolean().default(false),
  }),
});

const opensource = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/opensource' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    comment: z.string().optional(),
    status: z.enum(['uso_atualmente', 'ja_utilizei', 'recomendo']).optional(),
    websiteUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    license: z.string().optional(),
    icon: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    isDemo: z.boolean().default(false),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    year: z.number().int().optional(),
    genre: z.string().default('História & Filosofia'),
    status: z.enum(['lendo', 'lido', 'quero_ler']),
    favorite: z.boolean().default(false),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    description: z.string().optional(),
    comment: z.string().optional(),
    isDemo: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    album: z.string(),
    albumSlug: z.string(),
    category: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string(),
    originalUrl: z.string().optional(),
    dimensions: z
      .object({
        width: z.number().int(),
        height: z.number().int(),
      })
      .optional(),
    credit: z.string().optional(),
    license: z.string().optional(),
    featured: z.boolean().default(false),
    isDemo: z.boolean().default(false),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    mediaType: z.enum(['jogo', 'filme', 'livro']),
    workTitle: z.string(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
      .optional(),
    rating: z.number().min(0).max(100).optional(),
    relatedWork: z
      .object({
        collection: z.enum(['games', 'movies', 'books']),
        id: z.string(),
      })
      .optional(),
    relatedLinks: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      )
      .default([]),
    hasSpoilers: z.boolean().default(false),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    isDemo: z.boolean().default(false),
  }),
});

const linuxDiary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/linux-diary' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'tutoriais',
      'configuracoes',
      'relatos',
      'solucoes',
      'programas',
      'comandos',
    ]),
    level: z
      .enum([
        'iniciante',
        'intermediario',
        'iniciante_intermediario',
        'avancado',
      ])
      .optional(),
    environment: z
      .object({
        distro: z.string(),
        desktop: z.string().optional(),
        testedVersions: z.array(z.string()).default([]),
      })
      .optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
      .optional(),
    relatedSlugs: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    isDemo: z.boolean().default(false),
  }),
});

const recommendations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/recommendations' }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['produto', 'edicao', 'colecao', 'editora']).optional(),
    category: z.enum(['audio_perifericos', 'livros_editoras']),
    subcategory: z.string().optional(),
    status: z.enum(['ja_utilizei', 'pesquisado', 'lista_interesse']),
    currentlyUsing: z.boolean().default(false),
    highlights: z.array(z.string()).default([]),
    commentParagraphs: z.array(z.string()).min(1),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    externalLinks: z
      .array(
        z.object({
          url: z.url(),
          label: z.string(),
        }),
      )
      .default([]),
    addedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    order: z.number().int().optional(),
    draft: z.boolean().default(true),
    isDemo: z.boolean().default(false),
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
  reviews,
  linuxDiary,
  recommendations,
};
