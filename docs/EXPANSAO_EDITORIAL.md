# Expansão Editorial e Header 2.0 — Especificação e Auditoria (EXP-00 / EXP-01)

> **Status:** Planejamento técnico e auditoria concluídos (nenhum componente, página ou estilo implementado ainda) · **Data:** 2026-11-21.
> **Escopo:** Quatro frentes coordenadas — **Header 2.0**, **Resenhas**, **Diário Linux** e **Recomendações** — preservando integralmente o Design System 2.0, os temas claro/escuro, a arquitetura Astro SSG e todos os conteúdos existentes.
> **Importante:** Este documento consolida a auditoria (`EXP-00`) e a arquitetura proposta (`EXP-01`). **Não autoriza implementação automática, commit, push ou deploy.**

---

## 1. Visão geral e escopo das quatro frentes

A expansão amplia o `guilherme.dev` de um portfólio/acervo estático para um espaço editorial completo, sem introduzir CMS, banco de dados, autenticação ou frameworks de UI externos:

| Frente            | Rota canônica prevista                                                  | Propósito                                                                                                                          | Conteúdo inaugural aprovado                                         |
| ----------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Header 2.0**    | Global (`HeaderV2.astro`)                                               | Reorganizar a navegação em 6 links diretos + 3 dropdowns cinematográficos (`Cultura`, `Tecnologia`, `Acervo`) + alternador de tema | 8 destinos em dropdowns + 6 links diretos                           |
| **Resenhas**      | `/resenhas/` e `/resenhas/[id]/`                                        | Textos críticos e experiências pessoais sobre jogos, filmes e livros, com imagens no corpo e proteção contra spoilers              | _Shinobido: uma joia esquecida do PS2_                              |
| **Diário Linux**  | `/diario-linux/`, `/diario-linux/[id]/` e `/diario-linux/meu-ambiente/` | Base de conhecimento técnica para iniciantes e intermediários, independente da página autobiográfica `/linux/`                     | _Como personalizo meu GNOME_ (+ estrutura futura de _Meu ambiente_) |
| **Recomendações** | `/recomendacoes/`                                                       | Curadoria pessoal em cards cinematográficos com comentários literais, sem notas numéricas ou vitrine comercial                     | _KZ EDX Pro_ e _Editora Principis_                                  |

### Restrições invioláveis

1. **Não reformular a Home:** hero, grade assimétrica de 9 categorias (`homeCategories.ts`), faixa editorial e rodapé permanecem intactos. A atualização do header compartilhado aparecerá naturalmente na Home somente na fase `EXP-06`.
2. **Não substituir `/linux/`:** a narrativa autobiográfica e `src/data/linuxTimeline.ts` continuam intactas e separadas de `/diario-linux/`.
3. **Não alterar textos editoriais aprovados:** os textos de _Shinobido_, _Como personalizo meu GNOME_, _KZ EDX Pro_ e _Editora Principis_ devem ser preservados integralmente.
4. **Não publicar placeholders nem rotas inacabadas:** nenhuma nova seção entra no menu público, no `sitemap.xml` ou no `dist/` de produção antes de estar completa, com imagens aprovadas e autorização explícita.
5. **Compatibilidade dupla de build:** todo asset e link interno deve funcionar tanto na Vercel (`base: '/'`) quanto no espelho GitHub Pages (`base: '/guilherme.dev-blog/'`).

---

## 2. Auditoria do repositório e documentos de referência (EXP-00)

### 2.1 Documentos de referência verificados

| Documento                                         | Situação de acesso                                 | Observação                                                                                       |
| ------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `GUILHERME_DEV_EXPANSAO_ESPECIFICACAO_ROADMAP.md` | **Acessível** (fornecido e auditado em 2026-11-21) | Especificação funcional v1.0 (20/11/2026) das três seções e requisitos transversais              |
| `HEADER_2_0.md`                                   | **Acessível** (fornecido e auditado em 2026-11-21) | Especificação completa do Header 2.0 (substitui a indefinição anterior do header)                |
| `RECOMENDACOES_GUILHERME_DEV.md`                  | **Acessível** (fornecido e auditado em 2026-11-21) | Especificação consolidada v1.0 + textos literais aprovados de _KZ EDX Pro_ e _Editora Principis_ |
| `Shinobido uma joia esquecida.md`                 | **Acessível** (fornecido e auditado em 2026-11-21) | Resenha completa com 2 blocos de spoiler explicitamente demarcados                               |
| `Como personalizo meu GNOME.md`                   | **Acessível** (fornecido e auditado em 2026-11-21) | Tutorial completo com 10 marcações explícitas de imagem (capa + `CAPTURA 01` a `CAPTURA 09`)     |

#### Resolução de divergências entre documentos de planejamento

1. **Header (4 links + modelo indefinido → Header 2.0 definitivo):** O documento geral v1.0 (`GUILHERME_DEV_EXPANSAO_ESPECIFICACAO_ROADMAP.md` §1 e §11) ainda registrava 4 links principais e deixava em aberto o modelo de dropdown. A especificação mais recente `HEADER_2_0.md` prevalece integralmente: **6 links permanentes** (`Home`, `Sobre`, `Projetos`, `Linux`, `Artigos`, `Resenhas`) + **3 menus expansíveis** (`Cultura`, `Tecnologia`, `Acervo`).
2. **Categorias iniciais de Recomendações:** O documento geral v1.0 (§5.1) listava 4 categorias amplas em aberto; a especificação dedicada `RECOMENDACOES_GUILHERME_DEV.md` (§1 e §4) consolidou a estreia em **exatamente 2 entradas** (_KZ EDX Pro_ e _Editora Principis_) sob **2 categorias iniciais** (_Áudio e periféricos_ e _Livros e editoras_), mantendo o schema expansível para novas categorias futuras (como controles, teclados/mouses e coleções).

### 2.2 Estado técnico real do repositório

- **Stack confirmada (`package.json`):** Astro `^6.4.8`, TypeScript `^5.9.3`, Tailwind CSS `^4.3.5` (`@tailwindcss/vite`), Prettier `^3.9.10`, Node test runner nativo. **Não há** `@astrojs/mdx`, React, Vue, Svelte ou bibliotecas de UI instaladas.
- **Content Collections (`src/content.config.ts`):** 8 coleções ativas (`articles`, `projects`, `games`, `movies`, `music`, `opensource`, `books`, `gallery`) usando `glob` loaders e `astro/zod`.
- **Registros existentes relevantes para vínculo:**
  - `src/content/games/shinobido-the-way-of-the-ninja.json` já existe no acervo de Jogos (PS2, 2005, notas 94/94/91/95/99) — permite vínculo opcional direto com a resenha de Shinobido sem duplicar avaliação.
  - Livros da Editora Principis mencionados na entrevista (_1984_, _A Arte da Guerra_, _O Príncipe_, etc.) já existem em `src/content/books/`.
- **Build, CI e integridade:**
  - `npm run verify` executa `astro check` → `npm run test` → `format:check` → `astro build` → `build-integrity.test.ts`.
  - `src/utils/build-integrity.test.ts` valida correspondência exata (zero rotas faltantes e zero inesperadas) entre `dist/`, `sitemap.xml`, `staticSitemapRoutes` e coleções publicáveis, além de auditar links internos e imagens locais.
  - `.github/workflows/deploy.yml` publica automaticamente na branch `main` para o GitHub Pages (`GITHUB_ACTIONS=true`), enquanto a Vercel publica a produção principal a partir de `main`.

### 2.3 Inventário de recursos reutilizáveis

| Recurso existente                   | Arquivo                                                                              | Reutilização planejada na expansão                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Layout global + SEO + anti-FOUC     | `src/layouts/BaseLayout.astro`                                                       | Base de todas as novas páginas (incluindo `noindex` e `schema` JSON-LD)                                                 |
| Tema claro/escuro + alternador      | `src/utils/theme.ts`, `src/components/ui/ThemeToggle.astro`                          | Reutilizado integralmente no Header 2.0 sem criar segundo sistema de temas                                              |
| Base path (Vercel / GH Pages)       | `src/utils/base.ts` (`withBase`)                                                     | Obrigatório em todos os links, imagens de cards, dropdowns e corpo Markdown                                             |
| SEO e predicado de publicação       | `src/utils/seo.ts` (`isPublishable`, `toCanonicalUrl`, `getBlogPostingSchema`)       | Estender com helpers de schema para Resenhas (`Review`/`Article`) e Tutoriais (`TechArticle`)                           |
| Busca local normalizada             | `src/utils/search.ts` (`normalizeSearchText`, `matchesSearchTerms`)                  | Reutilizar diretamente na busca exclusiva de `/diario-linux/`                                                           |
| Progresso de leitura                | `src/components/ui/ReadingProgress.astro`                                            | Reutilizar em `/resenhas/[id]/` e `/diario-linux/[id]/` (já compatível com ambos os temas)                              |
| Compartilhamento canônico           | `src/components/ui/ShareButton.astro`                                                | Reutilizar em `/resenhas/[id]/`, `/diario-linux/[id]/` e `/recomendacoes/`                                              |
| Navegação anterior/próximo          | `src/components/content/ContentNavigation.astro` e `src/utils/content-navigation.ts` | Estender com comparadores para `reviews` e `linuxDiary`                                                                 |
| Padrão visual de cards fotográficos | `src/components/home/CategoryPosterCard.astro` + tokens `--color-v2-media-*`         | Inspiração direta para os mini-cards dos dropdowns do Header 2.0 e cards de Recomendações                               |
| Lightbox acessível                  | `src/components/content/GalleryLightbox.astro`                                       | Avaliar extração/reaproveitamento do padrão `<dialog>` nativo para um `MediaLightbox` editorial (sem quebrar a Galeria) |
| Prosa de leitura longa              | `src/pages/artigos/[id].astro` (`v2-article-prose`)                                  | Consolidar estilos de leitura longa para uso compartilhado entre Artigos, Resenhas e Diário Linux                       |

---

## 3. Conflitos, riscos técnicos e decisões recomendadas

| #   | Tema                                                 | Risco / Conflito identificado                                                                                                                                                                                                                                                                                                   | Decisão técnica recomendada                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Publicação segura em SSG (Vercel + GitHub Pages)** | Ocultar um link no header **não** impede acesso direto à URL. No Astro SSG, qualquer arquivo estático `index.astro` em `src/pages/` gera HTML público em `dist/` (publicado automaticamente na Vercel e no GitHub Pages ao subir para `main`), e `build-integrity.test.ts` falha se existir HTML não previsto no `sitemap.xml`. | Adotar defesa em 3 camadas: (1) `draft: true` em todas as novas coleções filtrando itens em `getStaticPaths()` quando não publicados; (2) páginas índice de seções não aprovadas **não podem gerar HTML no build público** (usar rotas dinâmicas/condicionais que retornem `[]` com flag `false`, ou manter desenvolvimento em branch não pública até aprovação); (3) validar em `build-integrity.test.ts` que zero páginas não aprovadas existam em `dist/`. |
| 2   | **Markdown vs. MDX e Spoilers**                      | `@astrojs/mdx` não está instalado. Usar apenas texto puro em `.md` não cria bloco interativo de spoiler; adicionar React/MDX só para isso aumentaria complexidade desnecessariamente.                                                                                                                                           | Manter **Markdown (`.md`) como padrão**. Implementar `SpoilerBlock` de forma progressiva usando HTML semântico `<details class="v2-spoiler">` (estilizado no Design System 2.0, acessível por teclado e funcional até sem JS) ou, se o autor preferir sintaxe declarativa de componente (`<SpoilerBlock>`, `<BeforeAfter>`), avaliar `@astrojs/mdx` de forma isolada na `EXP-02` (sem adicionar React/Vue).                                                   |
| 3   | **Vazamento de spoilers**                            | Se cards, resumos ou `<meta name="description">` forem gerados a partir do corpo do artigo, trechos de spoiler podem vazar.                                                                                                                                                                                                     | Cards e SEO usam **exclusivamente** `description` do frontmatter (revisado manualmente). Adicionar teste automatizado em `content-integrity.test.ts` validando que trechos marcados como spoiler não vazem em metadados.                                                                                                                                                                                                                                      |
| 4   | **Imagens inline em Markdown + GitHub Pages + 4:3**  | Hoje `src/pages/artigos/[id].astro` usa regex manual e mapa hardcoded de dimensões (`markdownImageDims`). Isso não escala para resenhas e tutoriais com dezenas de capturas (incluindo 4:3 de PS2).                                                                                                                             | Criar solução compartilhada (componente `EditorialFigure` ou plugin rehype/transformação centralizada) que aplica `withBase()`, preserva a proporção natural (`object-contain` / `h-auto`, sem esticar 4:3 em 16:9), adiciona `loading="lazy" decoding="async"` e integra abertura em lightbox.                                                                                                                                                               |
| 5   | **Header 2.0 em 1024 px**                            | 6 links + 3 dropdowns (com chevrons) + marca + `ThemeToggle` podem ficar apertados ou gerar overflow em 1024 px.                                                                                                                                                                                                                | Definir breakpoint desktop dedicado baseado na largura real dos elementos (previsto em `xl` / `1280px`, validado na `EXP-06`), utilizando o menu unificado em lista abaixo desse limite.                                                                                                                                                                                                                                                                      |
| 6   | **Validação técnica no tutorial GNOME**              | O texto cita _Fedora Workstation 45_ e nomes de opções de extensões (_Blur my Shell_, _Hide Top Bar_) que variam entre versões.                                                                                                                                                                                                 | Preservar o texto original durante a preparação, mas sinalizar revisão obrigatória desses nomes e versão com as capturas reais do autor antes da publicação.                                                                                                                                                                                                                                                                                                  |
| 7   | **Links externos e imagens de Recomendações**        | URLs oficiais (`kz-audio.com`, `cirandacultural.com.br/principis`) ainda não foram validadas em rede; imagens definitivas estão pendentes.                                                                                                                                                                                      | Manter `Recomendações` fora da publicação pública até validação dos links e recebimento/aprovação das fotografias reais.                                                                                                                                                                                                                                                                                                                                      |
| 8   | **Duplicação em `docs/ROADMAP.md`**                  | A seção `Fase 6` encontrava-se duplicada no arquivo e `THEME-04` ainda estava marcada como `Em revisão` (já commitada em `6295dec`).                                                                                                                                                                                            | Corrigida nesta entrega junto da inclusão da `Fase 7` (`EXP-00` a `EXP-07`).                                                                                                                                                                                                                                                                                                                                                                                  |

---

## 4. Documentação técnica da expansão

Para evitar duplicatas e manter cada assunto bem delimitado, a documentação técnica está organizada em quatro documentos complementares:

1. `docs/EXPANSAO_EDITORIAL.md` (este documento) — Visão geral, auditoria `EXP-00`, recursos reutilizáveis, riscos e governança.
2. `docs/HEADER_2_0.md` — Arquitetura completa do Header 2.0, estrutura desktop/mobile, dropdowns cinematográficos, acessibilidade e estados ativos.
3. `docs/EDITORIAL_CONTENT.md` — Modelos de dados, schemas Astro/Zod propostos, rotas, estratégia de rascunhos/publicação, spoilers e vínculos com acervos.
4. `docs/EDITORIAL_IMAGES.md` — Inventário oficial de todos os assets pendentes, convenção de diretórios, regras de proporção, qualidade e lightbox.
5. `docs/ROADMAP.md` — Fase 7 (`EXP-00` a `EXP-07`) com dependências, critérios de conclusão e status real.

---

## 5. Critérios globais de aceitação da expansão

- [ ] `npm run verify` passa com 0 erros (`astro check`, testes unitários, Prettier, build Vercel e `build-integrity.test.ts`).
- [ ] `GITHUB_ACTIONS=true npm run build` + `build-integrity.test.ts` passam sem links ou imagens quebradas sob `/guilherme.dev-blog/`.
- [ ] Todas as novas páginas funcionam corretamente nos temas **escuro (padrão)** e **claro editorial** com contraste WCAG AA.
- [ ] Home, `/linux/`, `/artigos/`, `/projetos/` e todos os acervos existentes permanecem sem regressões.
- [ ] Nenhum placeholder visual, dado inventado ou rota não autorizada é publicado em produção.
- [ ] Todos os textos editoriais aprovados permanecem fiéis aos originais fornecidos pelo autor.
