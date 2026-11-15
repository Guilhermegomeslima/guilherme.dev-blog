# guilherme.dev — Blog pessoal e portfólio

Blog pessoal, portfólio e acervo editorial em português. Construído em **Astro 6 + TypeScript + Tailwind CSS 4**, com **geração estática (SSG)** e a identidade visual **Design System 2.0**: cinematográfica, sombria, tipografia editorial e acentos vermelho envelhecido. A identidade cyberpunk anterior é mantida somente como histórico em `docs/DESIGN_SYSTEM.md`.

## Acesso online

- **Vercel (site principal):** https://guilhermegomesdev-blog.vercel.app/
- **GitHub Pages (espelho):** https://guilhermegomeslima.github.io/guilherme.dev-blog/

As URLs canônicas e os metadados de SEO priorizam a hospedagem principal.

## Seções disponíveis

Home, Sobre, Projetos, Linux, Jogos, Filmes, Livros, Artigos, Música, Open Source e Galeria. Jogos, Filmes, Livros e Artigos incluem páginas individuais; a Galeria possui rotas por álbum e lightbox. Os catálogos relevantes possuem filtros, busca e contadores acessíveis.

## Tecnologia e organização

- **Framework:** Astro `^6.4.8` (conforme `package.json` do snapshot)
- **Linguagem:** TypeScript; **estilo:** Tailwind CSS `^4.3.5`
- **Dados:** oito Content Collections Astro; Markdown em Artigos/Projetos, JSON nos demais catálogos
- **Avaliações:** `src/utils/ratings.ts` (médias de Jogos e Filmes)
- **Busca:** `src/utils/search.ts` (normalização de acentos, espaços, termos)
- **SEO:** canonical, dados estruturados, metadados sociais, sitemap e robots
- **Deploy:** Vercel (principal) e GitHub Actions → GitHub Pages (espelho)
- **Qualidade:** Astro Check, Node test runner, Prettier, build estático e auditoria de links/imagens

```text
guilherme.dev-blog/
├── .github/workflows/deploy.yml
├── docs/                     # Documentação e referências da identidade visual
├── public/fonts/             # Cormorant Garamond, Inter, JetBrains Mono
├── public/images/            # Imagens locais e recursos públicos
├── src/
│   ├── components/           # about, content, home, layout, linux e ui
│   ├── content/              # 8 coleções Markdown/JSON
│   ├── content.config.ts     # Loaders e schemas das coleções
│   ├── data/                 # Navegação, sociais, categorias e timeline Linux
│   ├── layouts/              # BaseLayout
│   ├── pages/                # Páginas, detalhes, 404, sitemap, robots
│   ├── styles/global.css     # Design System 2.0
│   └── utils/                # base, ratings, search, seo e testes
├── astro.config.mjs
├── vercel.json
└── package.json
```

## Executar localmente

**Pré-requisitos:** Node.js 22 (ou versão compatível com o projeto) e npm.

```bash
npm ci                # Instala dependências do package-lock.json
npm run dev           # Desenvolvimento local
npm run check         # Diagnóstico Astro/TypeScript
npm run test          # Testes unitários
npm run format:check  # Verificação Prettier sem alterações
npm run build         # Build estático para dist/
npm run preview       # Preview local do build
npm run verify        # Check + testes + formatação + build + auditoria do dist/
```

`npm run format` modifica arquivos; use apenas quando desejar formatar o projeto. Para simular o build do **GitHub Pages** com base de subdiretório, execute `GITHUB_ACTIONS=true npm run build`.

## Publicação atual

O conteúdo é editado nos arquivos de `src/content/`; mudanças versionadas e enviadas ao GitHub podem disparar novos builds. O `astro.config.mjs` usa `site` e `base` diferentes para Vercel (`/`) e GitHub Pages (`/guilherme.dev-blog/`). O workflow `.github/workflows/deploy.yml` verifica código e gera o espelho; `vercel.json` configura o deploy principal e headers de cache.

**Não existe painel administrativo, banco de dados ou API de escrita nesta versão.** Nenhuma tecnologia futura foi escolhida nesta revisão documental.

## Documentação

- [`AGENTS.md`](AGENTS.md) — regras de execução para agentes; alterações Git exigem aprovação
- [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) — requisitos e comportamento implementado
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitetura atual, dados, rotas e hospedagem
- [`docs/DESIGN_SYSTEM_V2.md`](docs/DESIGN_SYSTEM_V2.md) — identidade visual vigente
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — identidade cyberpunk original (histórico)
- [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) — estrutura editorial e regras de notas
- [`docs/CONTENT_SECTIONS.md`](docs/CONTENT_SECTIONS.md) — planejamento histórico das seções da Fase 4
- [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md) — fluxo de versionamento
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — tarefas, status e commits registrados

## Status

Fases 0–4, inserção de conteúdos reais, migração visual VIS-01 a VIS-07 e tarefas de qualidade QLT-01 a QLT-05 estão marcadas **concluídas no roadmap enviado**. Itens EVO permanecem pendentes, sem especificação técnica nesta revisão.

> Os arquivos Markdown deste pacote foram revisados a partir de um ZIP do projeto em 15/11/2026. A revisão **não alterou nem executou código do blog**, e não representa validação em navegador ou publicação remota.
