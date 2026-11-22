/**
 * Estrutura de dados da futura página `/diario-linux/meu-ambiente/` (EXP-04A).
 *
 * REGRA EDITORIAL: Não preencher dados técnicos presumidos ou desatualizados
 * sobre hardware, Fedora, GNOME ou ferramentas antes da confirmação explícita
 * do autor. Enquanto `confirmed === false`, a página exibe apenas a estrutura
 * aguardando confirmação (e permanece fora dos builds públicos).
 */
export interface EnvironmentSectionItem {
  label: string;
  value: string;
  notes?: string;
  relatedSlug?: string;
}

export interface EnvironmentSection {
  id: string;
  title: string;
  description: string;
  items: EnvironmentSectionItem[];
}

export interface LinuxEnvironmentSpec {
  confirmed: boolean;
  lastVerifiedAt?: string;
  sections: EnvironmentSection[];
}

export const linuxEnvironmentSpec: LinuxEnvironmentSpec = {
  confirmed: false,
  sections: [
    {
      id: 'hardware',
      title: 'Hardware',
      description: 'Equipamento principal e especificações confirmadas.',
      items: [],
    },
    {
      id: 'sistema',
      title: 'Sistema e Desktop',
      description: 'Distribuição Fedora, versão, GNOME e personalizações.',
      items: [],
    },
    {
      id: 'desempenho',
      title: 'Memória, Armazenamento e Energia',
      description: 'Configurações de memória, disco e otimizações de energia.',
      items: [],
    },
    {
      id: 'ferramentas',
      title: 'Ferramentas do dia a dia',
      description: 'Aplicativos de desenvolvimento, terminal e utilitários.',
      items: [],
    },
  ],
};
