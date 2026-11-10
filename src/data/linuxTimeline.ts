export interface TimelineEntry {
  id: string;
  name: string;
  period: string;
  category: string;
  description: string;
  tags: string[];
  current?: boolean;
  isDemo: boolean;
}

export const linuxTimeline: TimelineEntry[] = [
  {
    id: 'OS-01',
    name: 'Ambiente Windows Tradicional',
    period: 'Fase Inicial (Exemplo Demonstrativo)',
    category: 'Proprietário',
    description:
      'Primeiros contatos com computação, navegação web e jogos casuais antes da transição para sistemas de código aberto.',
    tags: ['Desktop', 'Início', 'Interface Gráfica'],
    isDemo: true,
  },
  {
    id: 'OS-02',
    name: 'Primeiro Contato com Linux (Ubuntu)',
    period: 'Fase de Transição (Exemplo Demonstrativo)',
    category: 'Distribuição Linux',
    description:
      'Instalação em dual-boot, descoberta do gerenciador de pacotes APT, primeiros comandos no Bash e quebra de paradigmas sobre o desktop.',
    tags: ['Dual-Boot', 'Debian-based', 'Terminal'],
    isDemo: true,
  },
  {
    id: 'OS-03',
    name: 'Explorações e Customização',
    period: 'Fase de Experimentação (Exemplo Demonstrativo)',
    category: 'Aprofundamento',
    description:
      'Testes de diferentes ambientes de desktop (KDE Plasma, XFCE) e personalização de dotfiles, scripts de inicialização e atalhos.',
    tags: ['Dotfiles', 'Ricing', 'Shell Script'],
    isDemo: true,
  },
  {
    id: 'OS-04',
    name: 'Fedora Workstation // GNOME',
    period: 'Ambiente Atual de Trabalho',
    category: 'Estação Principal',
    description:
      'Distribuição adotada como sistema operacional diário para desenvolvimento web, estudos de ADS e workflow centrado em minimalismo e estabilidade.',
    tags: ['Fedora', 'GNOME', 'Wayland', 'Flatpak', 'Workstation'],
    current: true,
    isDemo: true,
  },
];
