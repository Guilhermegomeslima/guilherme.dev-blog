/**
 * Dados confirmados da página `/diario-linux/meu-ambiente/` (EXP-04C.2).
 *
 * REGRA EDITORIAL E DE PRIVACIDADE:
 * - Contém exclusivamente informações técnicas confirmadas e aprovadas pelo autor.
 * - Não incluir hostname, nome de usuário, caminhos pessoais, UUIDs, números de série,
 *   endereços MAC, versão de BIOS/firmware ou ferramentas não aprovadas.
 */
export interface EnvironmentSectionItem {
  label: string;
  value: string;
  notes?: string;
  items?: string[];
  relatedSlug?: string;
}

export interface EnvironmentSectionCta {
  label: string;
  href: string;
  /** Quando preenchido, o link só é exibido se o artigo do Diário Linux estiver disponível. */
  diarySlug?: string;
}

export interface EnvironmentSection {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  layout?: 'default' | 'wide';
  items: EnvironmentSectionItem[];
  cta?: EnvironmentSectionCta;
}

export interface EnvironmentRelatedReading {
  title: string;
  description: string;
  href: string;
  categoryLabel: string;
  /** Quando preenchido, o card só é exibido se o artigo do Diário Linux estiver disponível. */
  diarySlug?: string;
}

export interface LinuxEnvironmentSpec {
  confirmed: boolean;
  lastVerifiedAt?: string;
  coverImage?: {
    url: string;
    alt: string;
    caption?: string;
    width: number;
    height: number;
  };
  sections: EnvironmentSection[];
  relatedReadings: EnvironmentRelatedReading[];
}

export const linuxEnvironmentSpec: LinuxEnvironmentSpec = {
  confirmed: true,
  lastVerifiedAt: 'Novembro de 2026',
  coverImage: {
    url: '/images/linux-diary/gnome-personalizacao/desktop-personalizado-limpo.webp',
    alt: 'Desktop Fedora Workstation 45 com GNOME personalizado em tema escuro e dock inferior',
    caption:
      'Área de trabalho atual no Fedora Workstation 45 com tema escuro e extensões do GNOME.',
    width: 1024,
    height: 576,
  },
  sections: [
    {
      id: 'hardware',
      eyebrow: '01 // EQUIPAMENTO',
      title: 'Hardware',
      description:
        'Especificações principais do notebook utilizado no dia a dia.',
      items: [
        {
          label: 'Notebook',
          value: 'ASUS Vivobook 15 X1502ZA',
        },
        {
          label: 'Processador',
          value: 'Intel Core i3-1220P',
          notes: '10 núcleos e 12 threads',
        },
        {
          label: 'Gráficos integrados',
          value: 'Intel UHD Graphics',
        },
        {
          label: 'Memória RAM',
          value: '20 GiB',
        },
        {
          label: 'Armazenamento',
          value: 'SSD Samsung NVMe de 1 TB',
        },
      ],
    },
    {
      id: 'sistema',
      eyebrow: '02 // SISTEMA OPERACIONAL',
      title: 'Sistema e desktop',
      description:
        'Base do sistema, ambiente gráfico e forma de gerenciamento de pacotes.',
      items: [
        {
          label: 'Distribuição',
          value: 'Fedora Workstation 45 (64 bits)',
        },
        {
          label: 'Ambiente gráfico',
          value: 'GNOME Shell 51.1',
        },
        {
          label: 'Sessão gráfica',
          value: 'Wayland',
        },
        {
          label: 'Aparência',
          value: 'Tema escuro',
        },
        {
          label: 'Gerenciamento de pacotes',
          value: 'DNF e Flatpak',
        },
        {
          label: 'Kernel Linux',
          value: 'Linux 7.3.4',
          notes:
            'Verificado em novembro de 2026; acompanha o ciclo de atualizações do Fedora.',
        },
      ],
    },
    {
      id: 'extensoes',
      eyebrow: '03 // PERSONALIZAÇÃO',
      title: 'Extensões e personalização do GNOME',
      description:
        'Resumo das dez extensões utilizadas via Extension Manager para ajustar a dock, o desfoque, o menu de aplicativos e a barra superior.',
      layout: 'wide',
      items: [
        {
          label: '4 extensões principais',
          value: 'Base visual e de navegação do desktop',
          items: ['Dash to Dock', 'Blur my Shell', 'ArcMenu', 'Hide Top Bar'],
        },
        {
          label: '6 extensões complementares',
          value: 'Recursos adicionais para o uso cotidiano',
          items: [
            'AppIndicator and KStatusNotifierItem Support',
            'Mpris Label',
            'Tiling Assistant',
            'Desktop Icons NG',
            'Caffeine',
            'Add to Desktop',
          ],
        },
      ],
      cta: {
        label: 'Ver passo a passo completo em Como personalizo meu GNOME',
        href: '/diario-linux/como-personalizo-meu-gnome/',
        diarySlug: 'como-personalizo-meu-gnome',
      },
    },
    {
      id: 'desempenho',
      eyebrow: '04 // RECURSOS DO SISTEMA',
      title: 'Memória e energia',
      description:
        'Ajustes de memória em RAM e preservação da bateria confirmados no sistema.',
      items: [
        {
          label: 'Swap em memória (ZRAM)',
          value: '8 GiB com compressão lzo-rle',
        },
        {
          label: 'Limite de carregamento da bateria',
          value: 'Configurado para 70%',
        },
      ],
    },
    {
      id: 'ferramentas',
      eyebrow: '05 // FLUXO DE TRABALHO',
      title: 'Ferramentas de desenvolvimento',
      description:
        'Ferramentas principais utilizadas para código, versionamento e execução de projetos.',
      items: [
        {
          label: 'Editor e ambiente',
          value: 'Visual Studio Code · Antigravity',
        },
        {
          label: 'Linguagens e runtimes',
          value: 'Node.js · Java',
        },
        {
          label: 'Versionamento e pacotes',
          value: 'Git · Flatpak',
        },
        {
          label: 'Terminal',
          value: 'Terminal Ptyxis',
        },
      ],
    },
  ],
  relatedReadings: [
    {
      title: 'Como personalizo meu GNOME',
      description:
        'Tutorial passo a passo com todas as extensões e ajustes aplicados neste ambiente.',
      href: '/diario-linux/como-personalizo-meu-gnome/',
      categoryLabel: 'Diário Linux · Tutorial',
      diarySlug: 'como-personalizo-meu-gnome',
    },
    {
      title: 'Por que escolhi Fedora (e por que continuo nele)',
      description:
        'Os motivos práticos que consolidaram o Fedora Workstation com GNOME e Flatpak no meu uso diário.',
      href: '/artigos/por-que-escolhi-fedora/',
      categoryLabel: 'Artigo',
    },
    {
      title: 'Minha trajetória no Linux',
      description:
        'A linha do tempo desde o primeiro notebook com 4 GB de RAM até o ambiente atual.',
      href: '/linux/',
      categoryLabel: 'História',
    },
  ],
};
