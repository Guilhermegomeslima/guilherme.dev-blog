# guilherme.dev — Blog Pessoal e Portfólio

Blog pessoal e acervo tecnológico desenvolvido com Astro 6, TypeScript e Tailwind CSS 4, com estética cyberpunk cinematográfica inspirada em _Blade Runner_ e geração 100% estática (SSG).

## 🌐 Acesso Online

- **Deploy Principal (Vercel):** [https://guilhermegomesdev-blog.vercel.app/](https://guilhermegomesdev-blog.vercel.app/)
- **Deploy Secundário (GitHub Pages):** [https://guilhermegomeslima.github.io/guilherme.dev-blog/](https://guilhermegomeslima.github.io/guilherme.dev-blog/)

---

## 📖 Documentação do Projeto

Toda a especificação, regras e planejamento do projeto estão documentados na raiz e na pasta `docs/`:

- [AGENTS.md](AGENTS.md) — Instruções operacionais para agentes e pair programming
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) — Requisitos de negócio e escopo funcional
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Arquitetura técnica e organização do repositório
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — Identidade visual cyberpunk, tokens e componentes
- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — Guia de redação, formatos (Markdown/JSON) e critérios de avaliação
- [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) — Fluxo Git e convenção de commits
- [docs/ROADMAP.md](docs/ROADMAP.md) — Fases de desenvolvimento, cronograma e tarefas

---

## 🚀 Tecnologias

- **Framework:** [Astro](https://astro.build/) (v6)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (modo estrito)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) com tokens semânticos via `@theme`
- **Formatação de Código:** [Prettier](https://prettier.io/) com `prettier-plugin-astro`
- **Geração:** Estática (SSG — HTML/CSS/JS puros em `dist/`)
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) e Vercel Git Integration

---

## 📁 Estrutura do Repositório

```text
guilherme.dev-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD automático para GitHub Pages
├── docs/                       # Especificações e planejamento do projeto
├── public/                     # Recursos estáticos públicos (favicon.svg, etc.)
├── src/
│   ├── components/
│   │   ├── about/              # Componentes da página Sobre (dossiê cyberpunk)
│   │   ├── home/               # Componentes da Home (Hero, AboutPreview, CategoryGrid)
│   │   ├── layout/             # Header com menu responsivo e Footer social
│   │   └── ui/                 # Primitives reutilizáveis (Section, Card, Button, etc.)
│   ├── data/                   # Fontes de dados tipadas (navigation, categories, social)
│   ├── layouts/                # BaseLayout com SEO, Open Graph e acessibilidade
│   ├── pages/                  # Rotas estáticas (index.astro, sobre.astro, 404.astro)
│   ├── styles/                 # Estilos globais e tokens Tailwind 4 (global.css)
│   └── utils/                  # Utilitários de rota e base path (base.ts)
├── astro.config.mjs            # Configuração Astro (suporte duplo Vercel & GitHub Pages)
├── vercel.json                 # Configuração de deploy estático na Vercel
├── package.json                # Dependências e scripts de validação
├── tsconfig.json               # Configuração TypeScript estrita
└── README.md                   # Visão geral e documentação de execução
```

---

## 🛠️ Como Executar Localmente

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

---

## 🚢 Deploy e Publicação

O projeto suporta **deploy simultâneo** em duas plataformas sem conflitos de rotas:

1. **Vercel (Deploy Principal na raiz `/`):**
   - Configurado via `vercel.json` e integração direta com o GitHub.
   - Qualquer push na branch `main` dispara o build automático via Vercel.
   - URL: `https://guilhermegomesdev-blog.vercel.app/`

2. **GitHub Pages (Deploy Secundário em `/guilherme.dev-blog/`):**
   - Automatizado via workflow do GitHub Actions em `.github/workflows/deploy.yml`.
   - O utilitário `withBase` em conjunto com a detecção `GITHUB_ACTIONS=true` no `astro.config.mjs` prefixa automaticamente assets e rotas internas.
   - URL: `https://guilhermegomeslima.github.io/guilherme.dev-blog/`

---

## 📌 Status do Projeto

- **Fase 1 — Fundação:** Concluída (`DEV-01` a `DEV-05`)
- **Fase 2 — Base visual e navegação:** Concluída (`UI-01` a `UI-05`)
- **Fase 3 — MVP (P0):** Concluída (`MVP-01` a `MVP-07`)
  - `MVP-01`: Hero cyberpunk e apresentação
  - `MVP-02`: Resumo Sobre com perfil real
  - `MVP-03`: Grid com 9 módulos/seções do acervo
  - `MVP-04`: Dossiê Sobre completo com efeito de scan/glitch e projetos do GitHub
  - `MVP-05`: Acessibilidade (skip link, reduced motion), responsividade e performance
  - `MVP-06`: Metadados completos Open Graph, Twitter Cards e página 404 personalizada
  - `MVP-07`: Deploys simultâneos funcionais em Vercel e GitHub Pages
- **Próxima fase:** Fase 4 — Conteúdo e páginas temáticas (P1)
