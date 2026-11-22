/**
 * Fonte única de navegação do Header 2.0 (docs/HEADER_2_0.md — EXP-06A).
 *
 * Centraliza:
 * - 6 links diretos principais (Home, Sobre, Projetos, Linux, Artigos, Resenhas)
 * - 3 menus dropdown cinematográficos (Cultura, Tecnologia, Acervo)
 * - Filtragem segura por flags de publicação (`editorial-flags.ts`)
 * - Resolução de rota ativa compatível com Vercel (`/`) e GitHub Pages (`/guilherme.dev-blog/`)
 */
import {
  EXPANSION_PUBLIC_FLAGS,
  shouldGenerateSectionRoute,
  type EnvRecord,
  type ExpansionSection,
} from '../utils/editorial-flags.ts';

export interface NavItem {
  label: string;
  href: string;
  /** Só itens com página existente são renderizados na navegação. */
  available: boolean;
}

export interface NavLinkItem extends NavItem {
  id: string;
  /** Quando definido, a visibilidade segue `shouldGenerateSectionRoute(expansionSection)`. */
  expansionSection?: ExpansionSection;
}

export interface NavDropdownItem extends NavLinkItem {
  description: string;
  /** Caminho relativo em `public/images/header/` (preenchido apenas na EXP-06B após aprovação). */
  image?: {
    src: string;
    width: number;
    height: number;
    position?: string;
  };
}

export interface NavDropdownGroup {
  id: 'cultura' | 'tecnologia' | 'acervo';
  label: string;
  columns: 2;
  /** Prefixos de rota que ativam o indicador discreto neste grupo. */
  matchPrefixes: string[];
  items: NavDropdownItem[];
}

export const PRIMARY_NAV_LINKS: readonly NavLinkItem[] = [
  { id: 'home', label: 'Home', href: '/', available: true },
  { id: 'sobre', label: 'Sobre', href: '/sobre/', available: true },
  { id: 'projetos', label: 'Projetos', href: '/projetos/', available: true },
  { id: 'linux', label: 'Linux', href: '/linux/', available: true },
  { id: 'artigos', label: 'Artigos', href: '/artigos/', available: true },
  {
    id: 'resenhas',
    label: 'Resenhas',
    href: '/resenhas/',
    available: false,
    expansionSection: 'reviews',
  },
];

export const NAV_DROPDOWN_GROUPS: readonly NavDropdownGroup[] = [
  {
    id: 'cultura',
    label: 'Cultura',
    columns: 2,
    matchPrefixes: ['/jogos', '/filmes', '/musica', '/livros'],
    items: [
      {
        id: 'jogos',
        label: 'Jogos',
        href: '/jogos/',
        description: 'Biblioteca e avaliações',
        available: true,
        image: {
          src: '/images/home/jogos-card.webp',
          width: 1400,
          height: 875,
          position: 'object-[50%_40%]',
        },
      },
      {
        id: 'filmes',
        label: 'Filmes',
        href: '/filmes/',
        description: 'Cinema e avaliações',
        available: true,
        image: {
          src: '/images/home/filmes-card.webp',
          width: 1200,
          height: 1600,
          position: 'object-[35%_50%]',
        },
      },
      {
        id: 'musica',
        label: 'Música',
        href: '/musica/',
        description: 'Artistas e álbuns',
        available: true,
        image: {
          src: '/images/home/musica-card.webp',
          width: 910,
          height: 604,
          position: 'object-[50%_78%]',
        },
      },
      {
        id: 'livros',
        label: 'Livros',
        href: '/livros/',
        description: 'Leituras e biblioteca',
        available: true,
        image: {
          src: '/images/home/livros-card.webp',
          width: 768,
          height: 1365,
          position: 'object-center',
        },
      },
    ],
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia',
    columns: 2,
    matchPrefixes: ['/diario-linux', '/opensource', '/open-source'],
    items: [
      {
        id: 'diario-linux',
        label: 'Diário Linux',
        href: '/diario-linux/',
        description: 'Tutoriais e configurações',
        available: false,
        expansionSection: 'linuxDiary',
        image: {
          src: '/images/header/diario-linux.webp',
          width: 1024,
          height: 576,
          position: 'object-[70%_70%]',
        },
      },
      {
        id: 'opensource',
        label: 'Open Source',
        href: '/opensource/',
        description: 'Programas e ferramentas',
        available: true,
        image: {
          src: '/images/home/open-source-card.webp',
          width: 1170,
          height: 1439,
          position: 'object-center',
        },
      },
    ],
  },
  {
    id: 'acervo',
    label: 'Acervo',
    columns: 2,
    matchPrefixes: ['/recomendacoes', '/galeria'],
    items: [
      {
        id: 'recomendacoes',
        label: 'Recomendações',
        href: '/recomendacoes/',
        description: 'Produtos e coleções',
        available: false,
        expansionSection: 'recommendations',
        image: {
          src: '/images/header/recomendacoes.webp',
          width: 1024,
          height: 682,
          position: 'object-[60%_45%]',
        },
      },
      {
        id: 'galeria',
        label: 'Galeria',
        href: '/galeria/',
        description: 'Imagens e wallpapers',
        available: true,
        image: {
          src: '/images/home/galeria-card.webp',
          width: 1200,
          height: 672,
          position: 'object-[50%_55%]',
        },
      },
    ],
  },
];

/**
 * Avalia se um item de navegação deve aparecer no menu atual, respeitando
 * `editorial-flags.ts` (público vs. prévia local autorizada).
 */
export function isNavItemAvailable(
  item: NavLinkItem,
  env?: EnvRecord,
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): boolean {
  if (item.expansionSection) {
    return shouldGenerateSectionRoute(item.expansionSection, env, flags);
  }
  return item.available;
}

/**
 * Retorna os links diretos visíveis na ordem oficial do Header 2.0.
 */
export function getVisiblePrimaryNavLinks(
  env?: EnvRecord,
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): NavLinkItem[] {
  return PRIMARY_NAV_LINKS.filter((item) =>
    isNavItemAvailable(item, env, flags),
  );
}

/**
 * Retorna os grupos de dropdown com apenas os destinos disponíveis no ambiente atual.
 */
export function getVisibleNavDropdownGroups(
  env?: EnvRecord,
  flags: Readonly<Record<ExpansionSection, boolean>> = EXPANSION_PUBLIC_FLAGS,
): NavDropdownGroup[] {
  return NAV_DROPDOWN_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isNavItemAvailable(item, env, flags)),
  })).filter((group) => group.items.length > 0);
}

/**
 * Normaliza um pathname removendo o prefixo `base` (ex.: `/guilherme.dev-blog/`)
 * e barras finais excedentes, retornando `/` para a raiz.
 */
export function normalizeNavPath(pathname: string, base = '/'): string {
  let path = (pathname || '/').split(/[?#]/)[0] || '/';
  const cleanBase = base.replace(/\/+$/, '');
  if (cleanBase && cleanBase !== '/' && path.startsWith(cleanBase)) {
    path = path.slice(cleanBase.length) || '/';
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path.replace(/\/+$/, '') || '/';
}

/**
 * Determina se uma rota de navegação está ativa para o pathname atual
 * (correspondência exata para `/`, e exata ou subrota para demais seções).
 */
export function isNavRouteActive(
  currentPath: string,
  targetHref: string,
  base = '/',
): boolean {
  const current = normalizeNavPath(currentPath, base);
  const target = normalizeNavPath(targetHref, '/');
  if (target === '/') {
    return current === '/';
  }
  return current === target || current.startsWith(`${target}/`);
}

/**
 * Determina se algum destino ou prefixo pertencente ao grupo dropdown está ativo.
 */
export function isDropdownGroupActive(
  currentPath: string,
  group: NavDropdownGroup,
  base = '/',
): boolean {
  if (
    group.items.some((item) => isNavRouteActive(currentPath, item.href, base))
  ) {
    return true;
  }
  return group.matchPrefixes.some((prefix) =>
    isNavRouteActive(currentPath, prefix, base),
  );
}

/**
 * Exportação plana mantida para compatibilidade retroativa com utilitários/testes.
 */
export const navigation: NavItem[] = [
  ...PRIMARY_NAV_LINKS.map(({ label, href, available }) => ({
    label,
    href,
    available,
  })),
  ...NAV_DROPDOWN_GROUPS.flatMap((group) =>
    group.items.map(({ label, href, available }) => ({
      label,
      href,
      available,
    })),
  ),
];
