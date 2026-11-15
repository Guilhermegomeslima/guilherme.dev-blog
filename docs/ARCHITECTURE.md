# Arquitetura técnica do blog — estado implementado

> **Status:** registro da arquitetura atual em produção · **Revisão documental:** 2026-11-15.
> **Escopo:** somente o código do ZIP recebido. Este documento não autoriza migrações nem especifica infraestrutura futura.

## 1. Visão geral

O `guilherme.dev-blog` é um blog e portfólio **multipáginas, estático (SSG)**, implementado com Astro 6, TypeScript e Tailwind CSS 4. O conteúdo é versionado com o código em Markdown/JSON e transformado em HTML no **build**. Não existe API de escrita, autenticação administrativa nem banco de dados no projeto inspecionado.

```text
Markdown/JSON em src/content/ → Content Collections + schemas Astro/Zod
                                    ↓
                            Astro build (SSG)
                                    ↓
                           dist/ (HTML/CSS/JS)
                                    ↓
                   Vercel (principal) / GitHub Pages (espelho)
                                    ↓
                                Visitante
```

O GitHub é usado para versionamento, revisão e publicação do código e conteúdo atuais. O navegador do visitante executa apenas os scripts necessários para menu, busca, filtros e Galeria; não depende de servidor de aplicação para exibir os conteúdos.

## 2. Stack confirmada no repositório

| Tecnologia                                  | Papel / fonte                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| Astro `^6.4.8`                              | Rotas e build estático; `package.json`, `astro.config.mjs`                       |
| TypeScript `^5.9.3`                         | Código e validações; `tsconfig.json`                                             |
| Tailwind CSS `^4.3.5` + `@tailwindcss/vite` | Estilos e tokens; `src/styles/global.css`                                        |
| Astro Content Collections + `astro:content` | Oito coleções, com loaders `glob` e schemas `astro/zod`; `src/content.config.ts` |
| Markdown (`.md`)                            | Artigos e projetos                                                               |
| JSON (`.json`)                              | Jogos, filmes, livros, música, Open Source e Galeria                             |
| Prettier / `prettier-plugin-astro`          | Formatação e verificação                                                         |
| Node.js test runner                         | Testes TypeScript; scripts de `package.json`                                     |
| GitHub Actions                              | CI e deploy para GitHub Pages; `.github/workflows/deploy.yml`                    |
| Vercel                                      | Hospedagem principal com cache configurado em `vercel.json`                      |

Não há dependências React, Vue, Svelte, ORM ou driver de banco no `package.json` examinado.

## 3. Estrutura real do código

```text
guilherme.dev-blog/
├── .github/workflows/deploy.yml
├── docs/                          # Regras, histórico de design, roadmap
├── public/fonts/                  # Fontes WOFF2 locais
├── public/images/                 # Fotografias, capas e recursos estáticos
├── src/
│   ├── components/{about,content,home,layout,linux,ui}/
│   ├── content/{articles,books,gallery,games,movies,music,opensource,projects}/
│   ├── content.config.ts         # Loaders e schemas das oito coleções
│   ├── data/                     # Navegação, sociais, categorias, timeline Linux
│   ├── layouts/BaseLayout.astro  # Metadados, SEO e layout global
│   ├── pages/                    # Home, páginas temáticas, detalhes, 404, sitemap, robots
│   ├── styles/global.css         # Design System 2.0 compartilhado
│   └── utils/                    # Base path, notas, busca, SEO e testes
├── astro.config.mjs              # site/base alternados por GITHUB_ACTIONS
├── vercel.json                   # Build e headers de cache
└── package.json
```

A timeline do Linux é representada por `src/data/linuxTimeline.ts`, não por uma coleção `src/content/linux/`. A rota canônica do diretório de software é `/opensource/`; `/open-source/` existe como rota auxiliar/alias no código.

## 4. Rotas e catálogo

Rotas de seção: `/`, `/sobre/`, `/projetos/`, `/linux/`, `/jogos/`, `/filmes/`, `/livros/`, `/artigos/`, `/musica/`, `/opensource/` e `/galeria/`. Existem páginas individuais em `/jogos/[id]/`, `/filmes/[id]/`, `/livros/[id]/`, `/artigos/[id]/` e `/galeria/[album]/`. Também são gerados `/sitemap.xml`, `/robots.txt` e página 404.

O snapshot recebido contém os seguintes **arquivos de conteúdo** (não são métricas de audiência):

| Coleção      |                                  Arquivos |
| ------------ | ----------------------------------------: |
| `games`      |                                  114 JSON |
| `movies`     |                                   65 JSON |
| `books`      |                                   24 JSON |
| `music`      | 29 JSON (18 artistas, 5 álbuns, 6 faixas) |
| `opensource` |                                    8 JSON |
| `gallery`    |          58 JSON distribuídos em 3 álbuns |
| `projects`   |                                5 Markdown |
| `articles`   |                                1 Markdown |

As contagens refletem **o ZIP de 15/11/2026**, não uma promessa de conteúdo fixo. Cada registro JSON examinado possui `isDemo` ausente ou falso; a validação de rascunhos/demonstrações e a forma de indexação devem continuar obedecendo ao código, não a estatísticas históricas.

## 5. Dados e regras de negócio

Os schemas estão em `src/content.config.ts`. Textos editoriais usam Markdown; entradas estruturadas usam JSON. Os arquivos são carregados durante o build e validados pelas coleções do Astro.

- **Jogos:** `mechanics`, `plot`, `aesthetics`, `retention` e `feeling` (0–100). O schema aceita `plot: null` para obra sem Enredo aplicável. `calculateGameScore` calcula média simples dos critérios numéricos presentes, sem pesos; nesse caso, o divisor é quatro, não cinco.
- **Filmes:** `direction`, `screenplay`, `audiovisual`, `acting`, `pacing` e `feeling` (0–100); `calculateMovieScore` calcula média simples dos seis. Diretor e ano são metadados.
- **Exibição:** `formatScore` mostra um inteiro sem decimais ou um resultado não inteiro com **uma casa decimal**; não cria campo de nota final manual.
- **Conteúdo demonstrativo:** `isDemo` faz parte dos schemas e é considerado pela geração de metadados/indexação. Não assumir que `draft` já seja um campo modelado em todas as coleções.

A validação, cálculos e normalização ficam em `src/utils/`; componentes consomem os dados, sem duplicar as regras centrais de médias.

## 6. Busca, filtros e interface

A Home usa grade editorial de nove categorias. As seções de catálogo têm interfaces próprias na identidade V2. Há busca local nas listagens de Jogos, Filmes, Livros, Música, Open Source e Galeria, com normalização de acentos, espaços e múltiplos termos (`src/utils/search.ts`). Filtros e ordenações são implementados de acordo com cada catálogo; controles de reset e contadores acessíveis fazem parte da interface.

O layout, as fontes Cormorant Garamond, Inter e JetBrains Mono e os tokens de cor V2 ficam centralizados. O menu é adaptável; a Galeria possui lightbox e controles acessíveis; CSS contempla `prefers-reduced-motion`.

## 7. SEO e geração estática

- `src/layouts/BaseLayout.astro` configura título, descrição, canonical, metadados sociais e dados estruturados aplicáveis.
- `src/utils/seo.ts` centraliza o domínio canônico da Vercel e utilitários de SEO.
- `src/pages/sitemap.xml.ts` e `src/pages/robots.txt.ts` geram arquivos estáticos; o sitemap exclui entradas de demonstração via `isPublishable` e inclui os álbuns existentes.
- A URL canônica é a Vercel, mesmo quando o usuário acessa a cópia do GitHub Pages.

Não interpretar a presença de testes e tags SEO como garantia de posicionamento nos buscadores ou de Core Web Vitals.

## 8. Hospedagem, base path e cache

**Principal:** `https://guilhermegomesdev-blog.vercel.app/` (base `/`).  
**Espelho:** `https://guilhermegomeslima.github.io/guilherme.dev-blog/` (base `/guilherme.dev-blog/`).

O arquivo `astro.config.mjs` alterna `site` e `base` quando `GITHUB_ACTIONS=true`; `src/utils/base.ts` fornece URLs que respeitam a base. O workflow `.github/workflows/deploy.yml` executa formatação, check, testes, build, auditoria do artefato e deploy do Pages. A Vercel é integrada ao repositório para os builds principais. `vercel.json` define cache de `_astro/`, fontes, imagens, sitemap e robots.

Atualizar os dois destinos exige validar também links, fontes e imagens com o prefixo do Pages. O build da Vercel e o do Pages não compartilham o mesmo `base`.

## 9. Verificação e mudanças

Scripts existentes: `npm run dev`, `npm run build`, `npm run preview`, `npm run check`, `npm run test`, `npm run format`, `npm run format:check` e `npm run verify`. Este último encadeia checagem, testes, formatação, build e auditoria de links/imagens do resultado.

Manter conformidade com `AGENTS.md` e `docs/GIT_WORKFLOW.md`: plano antes de mudanças significativas, preservação do acervo real, revisão de diffs, commits e pushes **somente com autorização explícita**.

## 10. Limites desta documentação

Esta arquitetura descreve **a versão existente**. Tarefas de evolução que aparecem como `Pendente` em `docs/ROADMAP.md` não são decisões arquiteturais e não autorizam adicionar banco de dados, autenticação, API, painel ou mudar SSG. Qualquer proposta posterior exige análise própria e aprovação do autor.
