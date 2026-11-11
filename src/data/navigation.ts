export interface NavItem {
  label: string;
  href: string;
  /** Só itens com página existente são renderizados na navegação. */
  available: boolean;
}

export const navigation: NavItem[] = [
  { label: 'Home', href: '/', available: true },
  { label: 'Sobre', href: '/sobre/', available: true },
  { label: 'Projetos', href: '/projetos/', available: true },
  { label: 'Artigos', href: '/artigos/', available: true },
  { label: 'Linux', href: '/linux/', available: true },
  { label: 'Jogos', href: '/jogos/', available: true },
  { label: 'Filmes', href: '/filmes/', available: true },
  { label: 'Música', href: '/musica/', available: true },
  { label: 'Open Source', href: '/opensource/', available: true },
];
