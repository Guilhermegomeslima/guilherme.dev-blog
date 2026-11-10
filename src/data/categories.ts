export interface CategoryItem {
  id: string;
  code: string;
  title: string;
  description: string;
  href: string;
  available: boolean;
  badge: string;
}

export const categories: CategoryItem[] = [
  {
    id: 'projetos',
    code: 'SEC-01',
    title: 'Projetos',
    description:
      'Repositórios, experimentos de software e aplicações web em desenvolvimento ativo.',
    href: '/projetos/',
    available: false,
    badge: 'Em breve',
  },
  {
    id: 'linux',
    code: 'SEC-02',
    title: 'Linux',
    description:
      'Configurações de sistema, workflows no Fedora/GNOME, terminal e personalizações.',
    href: '/linux/',
    available: false,
    badge: 'Em breve',
  },
  {
    id: 'jogos',
    code: 'SEC-03',
    title: 'Jogos',
    description:
      'Catálogo e avaliações com notas detalhadas em 5 dimensões técnicas e narrativas.',
    href: '/jogos/',
    available: false,
    badge: 'Em breve',
  },
  {
    id: 'filmes',
    code: 'SEC-04',
    title: 'Filmes',
    description:
      'Acervo cinematográfico e críticas avaliadas em 6 critérios estéticos e autorais.',
    href: '/filmes/',
    available: false,
    badge: 'Em breve',
  },
  {
    id: 'musica',
    code: 'SEC-05',
    title: 'Música',
    description:
      'Trilhas sonoras, seleções para foco em programação e descobertas sonoras.',
    href: '/musica/',
    available: false,
    badge: 'Em breve',
  },
  {
    id: 'livros',
    code: 'SEC-06',
    title: 'Livros',
    description:
      'Fichamentos e leituras de computação, ficção científica, história e ensaios.',
    href: '/livros/',
    available: false,
    badge: 'Em breve',
  },
  {
    id: 'opensource',
    code: 'SEC-07',
    title: 'Open Source',
    description:
      'Contribuições para a comunidade, projetos abertos e filosofia de software livre.',
    href: '/opensource/',
    available: false,
    badge: 'Em breve',
  },
  {
    id: 'artigos',
    code: 'SEC-08',
    title: 'Artigos',
    description:
      'Textos reflexivos, ensaios sobre tecnologia e anotações do processo de aprendizado.',
    href: '/artigos/',
    available: true,
    badge: 'Disponível',
  },
  {
    id: 'galeria',
    code: 'SEC-09',
    title: 'Galeria',
    description:
      'Registros visuais, fotografias noturnas, wallpapers cyberpunk e capturas de tela.',
    href: '/galeria/',
    available: false,
    badge: 'Em breve',
  },
];
