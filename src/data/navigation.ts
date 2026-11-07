export interface NavItem {
  label: string;
  href: string;
  /** Só itens com página existente são renderizados na navegação. */
  available: boolean;
}

export const navigation: NavItem[] = [
  { label: 'Home', href: '/', available: true },
  // Ativar quando a página existir (MVP-04).
  { label: 'Sobre', href: '/sobre/', available: false },
];

