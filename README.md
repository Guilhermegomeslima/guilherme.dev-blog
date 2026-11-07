# guilherme.dev — Blog Pessoal e Portfólio

Blog pessoal e portfólio multipáginas desenvolvido com Astro, TypeScript e Tailwind CSS 4.

## 📖 Documentação do Projeto

Toda a especificação, regras e planejamento do projeto estão documentados na pasta `docs/` e na raiz:

- [AGENTS.md](AGENTS.md) — Instruções operacionais para agentes e pair programming
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) — Requisitos de negócio e escopo funcional
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Arquitetura técnica e stack
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — Identidade visual cyberpunk, tokens e componentes
- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — Guia de redação, formatos (Markdown/JSON) e avaliações
- [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) — Fluxo Git e convenção de commits
- [docs/ROADMAP.md](docs/ROADMAP.md) — Fases de desenvolvimento e tarefas

## 🚀 Tecnologias

- **Framework:** [Astro](https://astro.build/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) _(configuração na tarefa DEV-02)_
- **Saída:** Estática (SSG)

## 🛠️ Como executar

### Pré-requisitos

- Node.js >= 22
- npm >= 10

### Instalação

```bash
npm install
```

### Comandos de desenvolvimento

```bash
# Iniciar servidor de desenvolvimento local
npm run dev

# Checagem de tipos e validação do Astro
npm run check

# Gerar build estático para produção
npm run build

# Pré-visualizar o build localmente
npm run preview
```

## 📌 Status Atual

- **Fase atual:** Fase 1 — Fundação do projeto
- **Tarefa concluída:** DEV-01 — Inicialização do Astro com TypeScript
- **Próxima tarefa:** DEV-02 — Configuração do Tailwind CSS 4 e estilos globais
