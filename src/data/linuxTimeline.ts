export interface TimelineEntry {
  id: string;
  name: string;
  /** Fase ou período da trajetória. Sem datas exatas enquanto não forem definidas. */
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
    name: 'Windows 8',
    period: 'Infância e adolescência',
    category: 'Windows',
    description:
      'Um dos primeiros sistemas que utilizei, em um notebook com Intel Core Duo e 2 GB de RAM. Fez parte das minhas primeiras experiências com computadores.',
    tags: ['Intel Core Duo', '2 GB de RAM'],
    isDemo: false,
  },
  {
    id: 'OS-02',
    name: 'Windows 8.1',
    period: 'Infância e adolescência',
    category: 'Windows',
    description:
      'Continuação da minha experiência com Windows no mesmo notebook. Depois que o equipamento apresentou defeito, passei um longo período sem computador próprio.',
    tags: ['Intel Core Duo', '2 GB de RAM'],
    isDemo: false,
  },
  {
    id: 'OS-03',
    name: 'Windows 11',
    period: 'Retorno ao computador pessoal',
    category: 'Windows',
    description:
      'Utilizado no ASUS Vivobook 15, inicialmente com 4 GB de RAM. Apesar do processador moderno, os gargalos de desempenho motivaram minha busca por alternativas.',
    tags: ['ASUS Vivobook 15', '4 GB de RAM'],
    isDemo: false,
  },
  {
    id: 'OS-04',
    name: 'LinuxFX',
    period: 'Primeira experiência com Linux',
    category: 'Distribuição Linux',
    description:
      'Instalado em dual boot, com uma interface muito semelhante à do Windows. Não ofereceu a leveza e a liberdade de personalização que eu esperava.',
    tags: ['Dual boot'],
    isDemo: false,
  },
  {
    id: 'OS-05',
    name: 'Xubuntu',
    period: 'O ponto de virada',
    category: 'Distribuição Linux',
    description:
      'Minha primeira experiência realmente positiva. Leve, funcional e responsável por me mostrar que poderia abandonar o Windows. Foi nele que comecei a me acostumar com o terminal.',
    tags: ['Terminal'],
    isDemo: false,
  },
  {
    id: 'OS-06',
    name: 'Ubuntu',
    period: 'Aprofundamento e aprendizado',
    category: 'Distribuição Linux',
    description:
      'Período em que explorei mais ferramentas, terminal e jogos com Proton. Também foi onde desenvolvi minha insatisfação pessoal com a integração dos pacotes Snap.',
    tags: ['Proton', 'Snap'],
    isDemo: false,
  },
  {
    id: 'OS-07',
    name: 'Fedora Workstation',
    period: 'Sistema atual',
    category: 'Distribuição Linux',
    description:
      'Minha experiência atual com GNOME, extensões e preferência por aplicativos Flatpak. Uma combinação de estabilidade, desempenho e personalização que talvez se torne minha escolha definitiva.',
    tags: ['GNOME', 'Flatpak'],
    current: true,
    isDemo: false,
  },
];
