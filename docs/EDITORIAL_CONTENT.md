# Arquitetura de Conteúdo Editorial — Resenhas, Diário Linux e Recomendações (EXP-01)

> **Status:** Proposta arquitetural consolidada (`EXP-01`) · **Implementação:** Pendente (`EXP-02` a `EXP-05`).
> **Referências reais auditadas:** `src/content.config.ts`, `src/utils/seo.ts`, `src/utils/content-navigation.ts`, `src/utils/build-integrity.test.ts`.

---

## 1. Estratégia geral de dados e Content Collections

A expansão mantém a arquitetura **100% estática (SSG)** com **Astro Content Collections** (`src/content.config.ts`), separando conteúdo editorial em Markdown (`.md`) e dados estruturados em JSON (`.json`).

### Decisão sobre Markdown vs. MDX

- **Padrão adotado:** **Markdown (`.md`)** para todas as Resenhas e artigos do Diário Linux.
- **Avaliação de MDX:** O repositório atual não possui `@astrojs/mdx` instalado. Recomenda-se **evitar adicionar MDX** se recursos como spoilers, figuras com legenda, callouts técnicos e blocos copiáveis puderem ser resolvidos com:
  1. HTML semântico nativo dentro do `.md` (ex.: `<details class="v2-spoiler">` para spoilers, `<figure>` para capturas com legenda);
  2. Transformação/plugin rehype leve em TypeScript no build do Astro (para `withBase()` automático em imagens, atributos de lightbox, botões de copiar em `<pre>` e geração de headings para o sumário).
- Caso surja necessidade real de componentes interativos no meio do texto (como uma comparação interativa _Antes/Depois_ no tutorial de GNOME), `@astrojs/mdx` poderá ser avaliado de forma pontual na `EXP-02`/`EXP-04`, **sem** introduzir React, Vue ou Svelte.

---

## 2. Estratégia de rascunhos e publicação segura

Como o blog é estático e publicado via `main` (Vercel + GitHub Pages), **ocultar um link no Header não torna a página privada**. Adota-se defesa em três camadas:

1. **Campo `draft: z.boolean().default(true)`** nas novas coleções (`reviews`, `linuxDiary`, `recommendations`).
2. **Gate de build (`src/utils/editorial-flags.ts`) — zero geração em `dist/` antes da aprovação:**
   - Constantes explícitas por frente (`REVIEWS_ENABLED`, `LINUX_DIARY_ENABLED`, `RECOMMENDATIONS_ENABLED`, iniciando em `false` — mesmo padrão bem-sucedido de `LIGHT_THEME_ENABLED` na Fase THEME).
   - **Rotas dinâmicas (`[id].astro`):** em `getStaticPaths()`, retornam `[]` para itens com `draft: true` ou quando a flag da frente estiver `false` em produção.
   - **Rotas de índice (`/resenhas/`, `/diario-linux/`, `/diario-linux/meu-ambiente/`, `/recomendacoes/`):** como arquivos `index.astro` estáticos no Astro **sempre** geram HTML em `dist/`, páginas de seções ainda não aprovadas **não devem gerar arquivo no build público** (usar rota dinâmica/rest `[...path]` que retorne `[]` quando desabilitada, ou manter as páginas em branch de desenvolvimento não publicada até a aprovação).
   - **Prévia local controlada:** apenas em `npm run dev` ou build local explícito com variável de ambiente dedicada (`PREVIEW_EXPANSION=true`), nunca ativada em `.github/workflows/deploy.yml` nem na Vercel.
   - **Sitemap e navegação:** rotas não aprovadas ficam fora de `src/pages/sitemap.xml.ts` e com `available: false` em `src/data/navigation.ts`.
3. **Integridade garantida por testes:** `src/utils/build-integrity.test.ts` e `src/utils/content-integrity.test.ts` passam a validar explicitamente que nenhum item com `draft: true` vaze para `dist/` ou `sitemap.xml`.

---

## 3. Frente B — Resenhas (`reviews`)

### 3.1 Rotas previstas

- Listagem: `/resenhas/`
- Página individual: `/resenhas/[id]/`
- Primeira entrada: `/resenhas/shinobido-uma-joia-esquecida/`

### 3.2 Schema proposto (`src/content/reviews/*.md`)

```ts
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(), // Resumo livre de spoilers (usado em cards e SEO)
    mediaType: z.enum(['jogo', 'filme', 'livro']),
    workTitle: z.string(), // Ex.: "Shinobido: Way of the Ninja"
    publishedAt: z.coerce.date().optional(), // Opcional até aprovação da data
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
      .optional(),
    /** Nota opcional e independente das avaliações das bibliotecas (nunca obrigatória). */
    rating: z.number().min(0).max(100).optional(),
    /** Vínculo opcional com registro já existente nas coleções de acervo (sem duplicar notas). */
    relatedWork: z
      .object({
        collection: z.enum(['games', 'movies', 'books']),
        id: z.string(),
      })
      .optional(),
    relatedLinks: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      )
      .default([]),
    hasSpoilers: z.boolean().default(false),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    isDemo: z.boolean().default(false),
  }),
});
```

### 3.3 Vínculo com acervos existentes (sem duplicação)

- A resenha _Shinobido: uma joia esquecida do PS2_ vincula-se opcionalmente a `{ collection: 'games', id: 'shinobido-the-way-of-the-ninja' }`.
- A página da resenha pode exibir um cartão discreto de referência ("Ver ficha e avaliação em Jogos →") lendo dados reais da coleção `games`, **sem exigir nota numérica na resenha** nem duplicar os critérios.
- Futuramente, a página `/jogos/[id]/` também poderá exibir um link contextual ("Ler resenha completa →") quando houver resenha publicada apontando para aquele `id`.

### 3.4 Arquitetura de proteção contra spoilers (`SpoilerBlock`)

- **Política padrão:** evitar spoilers por padrão; **não** exibir aviso em resenhas sem spoilers (`hasSpoilers: false`). Quando `hasSpoilers: true`, exibir um aviso geral discreto no topo da resenha.
- **Marcação no conteúdo:** `<details class="v2-spoiler" data-spoiler>` contendo `<summary>` com aviso claro (ex.: _"Spoiler — Trecho oculto sobre o passado do protagonista · Clique para revelar"_) e corpo recolhível (revelar/ocultar).
- **Acessibilidade e aprimoramento progressivo:**
  - Funciona nativamente sem JavaScript (teclado `Enter`/`Space`, leitores de tela anunciam estado aberto/fechado).
  - Pequeno aprimoramento visual via CSS/JS opcional para alternar rótulo ("Revelar spoiler" / "Ocultar spoiler") e respeitar `prefers-reduced-motion`.
- **Bloqueio de vazamento:**
  - Cards da listagem, `<meta name="description">`, Open Graph e JSON-LD utilizam **exclusivamente** `data.description` do frontmatter — nunca excertos automáticos do corpo Markdown.
  - Se houver imagens sensíveis a spoilers no futuro, elas só serão renderizadas **dentro** de um bloco `<details class="v2-spoiler">`, nunca como `coverImage`, `og:image` ou expostas no lightbox fora da área protegida.
- **Imagens inline e lightbox em Resenhas:**
  - Suporta múltiplas imagens distribuídas livremente entre parágrafos (quantidade orientada pela narrativa, sem cota fixa) e galerias opcionais.
  - O `EditorialLightbox` abre a imagem clicada preservando a proporção original (incluindo 4:3 de jogos antigos, sem esticar para 16:9), **sem obrigar navegação sequencial entre todas as imagens soltas do artigo** (navegação anterior/próximo opcional apenas quando pertencentes a uma galeria explícita).

---

## 4. Frente C — Diário Linux (`linuxDiary`)

### 4.1 Rotas previstas

- Listagem + filtros + busca local exclusiva: `/diario-linux/`
- Página individual (template técnico): `/diario-linux/[id]/`
- Página institucional de ambiente: `/diario-linux/meu-ambiente/` (estrutura planejada; publicação condicionada à confirmação dos dados reais pelo autor)
- Primeira publicação: `/diario-linux/como-personalizo-meu-gnome/`
- **Preservação absoluta:** `/linux/` continua intocada como página autobiográfica.

### 4.2 Categorias oficiais (enum fechado)

1. `tutoriais` — Tutoriais
2. `configuracoes` — Configurações do sistema
3. `relatos` — Relatos pessoais
4. `solucoes` — Soluções de problemas
5. `programas` — Recomendações de programas
6. `comandos` — Comandos e scripts

### 4.3 Schema proposto (`src/content/linux-diary/*.md`)

```ts
const linuxDiary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/linux-diary' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'tutoriais',
      'configuracoes',
      'relatos',
      'solucoes',
      'programas',
      'comandos',
    ]),
    level: z
      .enum([
        'iniciante',
        'intermediario',
        'iniciante_intermediario',
        'avancado',
      ])
      .optional(),
    environment: z
      .object({
        distro: z.string(), // Ex.: "Fedora Workstation 45"
        desktop: z.string().optional(), // Ex.: "GNOME"
        testedVersions: z.array(z.string()).default([]),
      })
      .optional(),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(), // Data da última revisão
    tags: z.array(z.string()).default([]),
    coverImage: z
      .object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
      .optional(),
    relatedSlugs: z.array(z.string()).default([]), // Seleção manual complementar a tags/categoria
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    isDemo: z.boolean().default(false),
  }),
});
```

### 4.4 Recursos do template técnico (`/diario-linux/[id]/`)

- **Sumário automático (TOC):** gerado a partir do array `headings` retornado nativamente por `await render(entry)` do Astro (`h2` e `h3`).
  - Desktop (`xl+`): coluna lateral sticky à direita ou esquerda, sem poluir a leitura.
  - Mobile/tablet: elemento nativo `<details>` recolhível no topo do documento (funciona sem JS).
- **Blocos de código com botão de copiar:** aprimoramento progressivo via script leve sobre `<pre><code>` (botão aparece apenas quando JS está ativo, com feedback acessível `aria-live="polite"`).
- **Avisos técnicos e de risco:** padrão visual discreto para notas (`Nota`), atenções (`Atenção`) e riscos (`Aviso de risco`) utilizando **texto e ícone explícito (nunca apenas cor)**, coerente com os dois temas. Comandos com impacto de sistema só são publicados após revisão técnica de efeitos, privilégios e reversão.
- **Data de última revisão:** exibida de forma distinta da data de publicação quando `updatedAt` (revisão técnica) estiver preenchida.
- **Artigos relacionados:** prioriza `relatedSlugs` (seleção manual) e completa automaticamente por correspondência de tags/categoria entre registros publicáveis, evitando duplicatas.
- **Busca local exclusiva:** reutiliza `normalizeSearchText` e `matchesSearchTerms` de `src/utils/search.ts` sobre título, resumo, tags (e termos-chave/corpo indexável, se viável), combinada com os filtros das 6 categorias na página `/diario-linux/` (sem criar busca global no blog).

### 4.5 Página `/diario-linux/meu-ambiente/`

- Estruturada por blocos opcionais alimentados por um arquivo de dados local (ex.: `src/data/linuxEnvironment.ts`) contendo seções para hardware, Fedora/GNOME, extensões, personalizações, memória/armazenamento, energia/otimizações, ferramentas e links para artigos do Diário Linux.
- **Regra de veracidade:** nenhum dado técnico presumido ou desatualizado será preenchido; a publicação da página depende de o autor confirmar cada item real.

---

## 5. Frente D — Recomendações (`recommendations`)

### 5.1 Rota prevista

- Catálogo único: `/recomendacoes/` (sem obrigatoriedade de página individual por item).

### 5.2 Schema proposto (`src/content/recommendations/*.json`)

```ts
const recommendations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/recommendations' }),
  schema: z.object({
    name: z.string(),
    /** Diferencia produto, edição, coleção ou editora (opcional). */
    kind: z.enum(['produto', 'edicao', 'colecao', 'editora']).optional(),
    category: z.enum(['audio_perifericos', 'livros_editoras']), // Expansível no futuro
    subcategory: z.string().optional(),
    status: z.enum(['ja_utilizei', 'pesquisado', 'lista_interesse']),
    currentlyUsing: z.boolean().default(false),
    highlights: z.array(z.string()).default([]),
    /** Parágrafos literais aprovados pelo autor (preserva quebras sem alterar texto). */
    commentParagraphs: z.array(z.string()).min(1),
    /** Prós e contras opcionais para futuras entradas (nunca inventar nas entradas iniciais). */
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    externalLinks: z
      .array(
        z.object({
          url: z.string().url(),
          label: z.string(), // Ex.: "Site oficial", "Ver catálogo", "Ver loja"
        }),
      )
      .default([]),
    /** Opcional: nunca inventar datas. Ordenação usa addedAt descendente quando presente. */
    addedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    order: z.number().int().optional(), // Desempate estável caso addedAt ainda não esteja definida
    draft: z.boolean().default(true),
    isDemo: z.boolean().default(false),
  }),
});
```

### 5.3 Entradas inaugurais, regras editoriais e pendências

1. `kz-edx-pro.json`: `kind: 'produto'`, categoria `audio_perifericos`, status `ja_utilizei`, `currentlyUsing: true`, comentário reproduzido literalmente (2 parágrafos). Link oficial a validar: `https://kz-audio.com/kz-edx-pro.html`.
2. `editora-principis.json`: `kind: 'editora'`, categoria `livros_editoras`, status `ja_utilizei`, comentário reproduzido literalmente (2 parágrafos). Link institucional a validar: `https://www.cirandacultural.com.br/principis`.

- **Regra de veracidade do estado:** o estado de experiência exibe apenas o estado atual e **não equivale a endosso** — itens futuros em `pesquisado` ou `lista_interesse` nunca podem ser apresentados como testados ou recomendados por experiência direta.
- **Pendências editoriais:** datas reais de adição (`addedAt`) a confirmar com o autor; verificação de disponibilidade dos links oficiais; fornecimento/aprovação das 2 fotografias reais.

---

## 6. Componentes compartilhados a criar na EXP-02

| Componente / Utilitário                            | Responsabilidade                                                                                                                            | Dependência de JS               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `src/utils/editorial-flags.ts`                     | Feature flags de publicação (`REVIEWS_ENABLED`, `LINUX_DIARY_ENABLED`, `RECOMMENDATIONS_ENABLED`)                                           | Não                             |
| `src/styles/global.css` (extensão)                 | Estilos `.v2-spoiler`, `.v2-callout`, `.v2-editorial-prose` e figuras compatíveis com temas claro/escuro                                    | Não                             |
| `src/components/editorial/EditorialLightbox.astro` | Lightbox acessível (`<dialog>`) para imagens dentro de Resenhas e Diário Linux, preservando 4:3 e 16:9, sem alterar `GalleryLightbox.astro` | Sim (aprimoramento progressivo) |
| `src/components/editorial/TableOfContents.astro`   | Sumário lateral (desktop) e recolhível `<details>` (mobile) a partir dos `headings` do Astro                                                | Não (apenas highlight opcional) |
| `src/utils/markdown-media.ts`                      | Processamento centralizado de imagens inline (`withBase()`, preservação de proporção, `loading="lazy"`, hook para lightbox)                 | Não                             |
| `src/utils/seo.ts` (extensão)                      | Helpers JSON-LD para Resenhas e artigos técnicos do Diário Linux                                                                            | Não                             |
