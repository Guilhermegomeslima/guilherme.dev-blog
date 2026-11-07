# guilherme.dev — Blog Pessoal e Portfólio

Blog pessoal e portfólio multipáginas desenvolvido com Astro, TypeScript e Tailwind CSS 4, com estética cyberpunk cinematográfica inspirada em _Blade Runner_ e arquitetura de saída estática (SSG).

## 📖 Documentação do Projeto

Toda a especificação, regras e planejamento do projeto estão documentados na raiz e na pasta `docs/`:

- [AGENTS.md](AGENTS.md) — Instruções operacionais para agentes e pair programming
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) — Requisitos de negócio e escopo funcional
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Arquitetura técnica e organização do repositório
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — Identidade visual cyberpunk, tokens e componentes
- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — Guia de redação, formatos (Markdown/JSON) e critérios de avaliação
- [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) — Fluxo Git e convenção de commits
- [docs/ROADMAP.md](docs/ROADMAP.md) — Fases de desenvolvimento, cronograma e tarefas

## 🚀 Tecnologias

- **Framework:** [Astro](https://astro.build/) (v6)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (estrito)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) com tokens provisórios via `@theme`
- **Formatação de Código:** [Prettier](https://prettier.io/) com `prettier-plugin-astro`
- **Geração:** Estática (SSG)

## 📁 Estrutura do Projeto

```text
guilherme.dev-blog/
├── docs/               # Documentação técnica e planejamento
├── public/             # Recursos estáticos públicos (ex: favicon.svg)
├── src/
│   ├── pages/          # Rotas e páginas Astro (index.astro, etc.)
│   └── styles/         # Estilos globais e tokens Tailwind 4 (global.css)
├── .editorconfig       # Padronização universal de edição
├── .gitignore          # Arquivos e pastas ignorados pelo Git
├── .prettierrc.mjs     # Configuração de formatação Prettier
├── .prettierignore     # Arquivos ignorados pelo Prettier
├── astro.config.mjs    # Configuração do Astro e plugins Vite
├── package.json        # Dependências e scripts npm
├── README.md           # Visão geral e guia de desenvolvimento
└── tsconfig.json       # Configuração TypeScript estrita
```

## 🛠️ Como Executar

### Pré-requisitos

- Node.js >= 22 (recomendado 22.12+)
- npm >= 10

### Instalação

```bash
npm install
```

### Comandos Disponíveis

```bash
# Iniciar o servidor local de desenvolvimento
npm run dev

# Checagem de tipos estrita e diagnóstico do Astro
npm run check

# Formatar automaticamente todo o projeto com Prettier
npm run format

# Verificar conformidade de formatação sem alterar arquivos
npm run format:check

# Gerar o build estático para produção (dist/)
npm run build

# Pré-visualizar o build localmente
npm run preview

# Pipeline completo de validação (check + format:check + build)
npm run verify
```

## 📌 Status do Projeto

- **Fase atual:** Fase 1 — Fundação do projeto (Concluída)
- **Tarefas da Fase 1 finalizadas:**
  - `DEV-01`: Inicialização do Astro com TypeScript
  - `DEV-02`: Configuração do Tailwind CSS 4 e estilos globais
  - `DEV-03`: Definição dos tokens provisórios de cores, tipografia e espaçamento
  - `DEV-04`: Configuração de scripts de checagem, formatação (Prettier) e build
  - `DEV-05`: README completo e configuração de ambiente de desenvolvimento
- **Próxima fase:** Fase 2 — Base visual e navegação (iniciando por `UI-01` — BaseLayout e container reutilizável)
