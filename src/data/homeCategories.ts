import { categories } from './categories';

/**
 * Apresentação editorial das nove categorias na Home V2
 * (docs/DESIGN_SYSTEM_V2.md §4.3). Título e destino vêm de `categories.ts`
 * (fonte única); aqui ficam apenas rótulo, fotografia e composição.
 * As fotografias são atmosféricas e NÃO substituem capas/prints de conteúdo.
 */
export interface HomePosterCategory {
  id: string;
  title: string;
  href: string;
  index: string;
  label: string;
  image: { src: string; width: number; height: number; position: string };
  /** Classes de grade (estáticas, para o Tailwind detectar). */
  layout: string;
  /** Altura do cartão em lg+ (a terceira linha é mais baixa no protótipo). */
  height: string;
}

const rowTall = 'lg:h-[25.5rem]';
const rowShort = 'lg:h-[23.4rem]';
const wide = 'lg:col-span-6';
const narrow = 'lg:col-span-3';

const presentation: Record<
  string,
  Omit<HomePosterCategory, 'id' | 'title' | 'href' | 'index'>
> = {
  projetos: {
    label: 'Código e experimentos',
    image: {
      src: '/images/home/projetos-card.webp',
      width: 1191,
      height: 445,
      position: '50% 40%',
    },
    layout: wide,
    height: rowTall,
  },
  linux: {
    label: 'Sistemas e liberdade',
    image: {
      src: '/images/home/linux-card.webp',
      width: 1199,
      height: 674,
      position: '50% 45%',
    },
    layout: narrow,
    height: rowTall,
  },
  jogos: {
    label: 'Mundos e experiências',
    image: {
      src: '/images/home/jogos-card.webp',
      width: 1400,
      height: 875,
      position: '50% 40%',
    },
    layout: narrow,
    height: rowTall,
  },
  filmes: {
    label: 'Cinema e narrativa',
    image: {
      src: '/images/home/filmes-card.webp',
      width: 1200,
      height: 1600,
      position: '35% 50%',
    },
    layout: narrow,
    height: rowTall,
  },
  musica: {
    label: 'Sons e descobertas',
    image: {
      src: '/images/home/musica-card.webp',
      width: 910,
      height: 604,
      position: '50% 78%',
    },
    layout: wide,
    height: rowTall,
  },
  livros: {
    label: 'Histórias e ideias',
    image: {
      src: '/images/home/livros-card.webp',
      width: 768,
      height: 1365,
      position: '50% 50%',
    },
    layout: narrow,
    height: rowTall,
  },
  opensource: {
    label: 'Ferramentas e liberdade',
    image: {
      src: '/images/home/open-source-card.webp',
      width: 1170,
      height: 1439,
      position: '50% 50%',
    },
    layout: narrow,
    height: rowShort,
  },
  artigos: {
    label: 'Registros e reflexões',
    image: {
      src: '/images/home/artigos-card.webp',
      width: 736,
      height: 1288,
      position: '50% 50%',
    },
    layout: narrow,
    height: rowShort,
  },
  galeria: {
    label: 'Imagens e atmosferas',
    // Em tablet (2 colunas) a última categoria ocupa a linha inteira.
    image: {
      src: '/images/home/galeria-card.webp',
      width: 1200,
      height: 672,
      position: '50% 55%',
    },
    layout: `sm:col-span-2 ${wide}`,
    height: rowShort,
  },
};

// Ordem aprovada: Projetos, Linux, Jogos / Filmes, Música, Livros / Open Source, Artigos, Galeria
export const homePosterCategories: HomePosterCategory[] = Object.keys(
  presentation,
).flatMap((id, position) => {
  const base = categories.find((c) => c.id === id && c.available);
  const extra = presentation[id];
  if (!base || !extra) return [];
  return [
    {
      id,
      title: base.title,
      href: base.href,
      index: String(position + 1).padStart(2, '0'),
      ...extra,
    },
  ];
});
