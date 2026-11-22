# Header 2.0 — Especificação Técnica e Arquitetura (EXP-06)

> **Status:** Especificado na fase `EXP-01` · **Implementação:** Pendente (`EXP-06`).
> **Alvo principal:** `src/components/layout/HeaderV2.astro`, `src/data/navigation.ts` e novo componente de dropdown cinematográfico.
> **Referência visual:** `docs/DESIGN_SYSTEM_V2.md` (paleta escura padrão + modo claro editorial; cards dos dropdowns como ilhas cinematográficas escuras).

---

## 1. Estrutura de navegação aprovada (Desktop)

O Header 2.0 substitui a lista plana de 11 links atuais por uma barra horizontal discreta de linha única com **6 links diretos**, **3 menus expansíveis** e o **alternador de tema existente**:

```text
Logo (guilherme.dev) | Home | Sobre | Projetos | Linux | Artigos | Resenhas | Cultura ▾ | Tecnologia ▾ | Acervo ▾ | [Tema]
```

### 1.1 Links diretos (6)

| Ordem | Rótulo   | Rota canônica | Observação                                                                    |
| ----: | -------- | ------------- | ----------------------------------------------------------------------------- |
|     1 | Home     | `/`           | Preservar exatamente como hoje                                                |
|     2 | Sobre    | `/sobre/`     | Preservar                                                                     |
|     3 | Projetos | `/projetos/`  | Preservar                                                                     |
|     4 | Linux    | `/linux/`     | Página autobiográfica — **não duplicar em Tecnologia**                        |
|     5 | Artigos  | `/artigos/`   | Preservar                                                                     |
|     6 | Resenhas | `/resenhas/`  | Exibir somente quando `EXP-03` estiver aprovada — **não duplicar em Cultura** |

### 1.2 Menus expansíveis (3)

| Grupo          | Grade desktop        | Itens (Título — Descrição curta)                                                                                                                | Rota canônica                                       |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Cultura**    | 2 colunas × 2 linhas | **Jogos** — Biblioteca e avaliações<br>**Filmes** — Cinema e avaliações<br>**Música** — Artistas e álbuns<br>**Livros** — Leituras e biblioteca | `/jogos/`<br>`/filmes/`<br>`/musica/`<br>`/livros/` |
| **Tecnologia** | 2 colunas × 1 linha  | **Diário Linux** — Tutoriais e configurações<br>**Open Source** — Programas e ferramentas                                                       | `/diario-linux/`<br>`/opensource/`                  |
| **Acervo**     | 2 colunas × 1 linha  | **Recomendações** — Produtos e coleções<br>**Galeria** — Imagens e wallpapers                                                                   | `/recomendacoes/`<br>`/galeria/`                    |

> **Regra de publicação incremental:** Cada item em `src/data/navigation.ts` mantém `available: boolean`. Itens de seções ainda não publicadas (`Resenhas`, `Diário Linux`, `Recomendações`) permanecem com `available: false` até aprovação final da respectiva frente, evitando links quebrados ou rotas vazias.

---

## 2. Aparência dos dropdowns cinematográficos

Os painéis dropdown seguem estritamente o Design System 2.0 — **sem mega menus corporativos, sem banners gigantes e sem empurrar o conteúdo da página**:

- **Posicionamento:** absoluto (`position: absolute; top: 100%`) ancorado **abaixo do respectivo botão acionador** (não centralizado em relação ao header inteiro), com `z-index` acima do conteúdo principal (`z-40`).
- **Prevenção de corte na janela (viewport clamping):**
  - `Cultura`: alinhamento padrão abaixo do botão acionador, com verificação de limite direito/esquerdo.
  - `Tecnologia` e `Acervo` (próximos à borda direita): alinhamento ancorado ao botão acionador com ajuste automático à direita (`right-0` ou deslocamento leve via JS no momento da abertura) para garantir margem mínima de segurança (`16px`) em relação aos limites da janela.
- **Superfície do painel:**
  - Moldura discreta com `bg-v2-surface`, borda `border-v2-border`, sombra `v2-shadow-elevated` e cantos retos (coerente com ambos os temas).
  - Largura compacta e proporcional ao grid de 2 colunas (~`460px–520px`, com `gap-3` e padding `p-3`).
- **Mini-cards cinematográficos (ilhas escuras `--color-v2-media-*`):**
  - Cada item do dropdown é um único `<a>` sem links aninhados.
  - Dimensão compacta e equilibrada: altura de referência inicial entre **`90px` e `115px`** (calibrada no teste visual de `EXP-06`, evitando cards gigantes ou banners largos).
  - Formato aprovado: **título + descrição curta, sem ícones adicionais**.
  - Fundo com imagem temática local (`object-cover`, baixa saturação e brilho reduzido) + overlay gradiente escuro (`from-v2-media-bg/92 via-v2-media-bg/45 to-v2-media-bg/20`) garantindo contraste WCAG AA nos dois temas. Diretrizes temáticas de cada imagem estão registradas em `docs/EDITORIAL_IMAGES.md` §3.1.
  - Fallback neutro sólido em `bg-v2-media-surface` com borda discreta caso a imagem não carregue ou enquanto o asset definitivo estiver pendente (nunca exibir ícone de imagem quebrada).
  - Conteúdo interno: título em `font-v2-display` (`text-v2-media-text`), descrição curta em `font-v2-sans` (`text-v2-media-muted`), borda discreta `border-v2-media-border` e iluminação discreta no hover/foco (sem zoom exagerado, efeitos neon ou animações constantes).

---

## 3. Interações, teclado e acessibilidade

| Comportamento             | Especificação                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hover no botão**        | Apenas realce visual (cor do texto / seta). **Nunca abre o menu no hover.**                                                                                                                                                    |
| **Clique no botão**       | Abre o dropdown correspondente (`aria-expanded="true"`). Segundo clique fecha.                                                                                                                                                 |
| **Exclusividade**         | Abrir outro dropdown fecha imediatamente o anterior (apenas 1 aberto por vez).                                                                                                                                                 |
| **Fechamento externo**    | Clique fora do header/dropdown fecha o menu aberto.                                                                                                                                                                            |
| **Tecla `Escape`**        | Fecha o dropdown aberto e devolve o foco ao botão acionador correspondente.                                                                                                                                                    |
| **Seleção de destino**    | Clicar em um mini-card fecha o menu antes/durante a navegação.                                                                                                                                                                 |
| **Navegação por teclado** | `Tab`/`Shift+Tab` navega naturalmente pelos acionadores e links; `Enter`/`Space` alterna o botão; `ArrowDown` no botão aberto move o foco para o primeiro card; `ArrowUp`/`ArrowDown`/`Home`/`End` opcionais dentro do painel. |
| **Animação**              | Transição curta em fade/opacity (`150ms–180ms`), desativada com `motion-reduce:transition-none` (`prefers-reduced-motion`).                                                                                                    |
| **Semântica ARIA**        | Botão acionador usa `<button type="button" aria-expanded="false" aria-controls="dropdown-<id>">`. Não usar `role="menu"`/`menuitem` para links de navegação (padrão WAI-ARIA Disclosure Navigation).                           |
| **Sem JavaScript**        | No desktop/mobile sem JS, a navegação principal permanece utilizável e acessível (menu mobile visível por padrão como já ocorre hoje em `HeaderV2.astro`).                                                                     |

### 3.1 Estado ativo vs. foco de teclado

- **Rota ativa direta:** sublinhado vermelho discreto (`bg-v2-accent`, `2px`) e `aria-current="page"`.
- **Rota ativa dentro de um grupo** (ex.: `/jogos/shinobido-the-way-of-the-ninja/` pertence a `Cultura`):
  - O botão do grupo recebe indicação discreta de rota ativa (sublinhado vermelho fino ou ponto/marcador `bg-v2-accent`), sem alterar `aria-expanded`.
  - O mini-card correspondente dentro do dropdown recebe `aria-current="page"` e destaque discreto na borda/indicador vermelho.
- **Separação de foco:** o foco de teclado usa exclusivamente o utilitário global `.v2-focus` (contorno visível nos dois temas), nunca confundido com o sublinhado vermelho de página ativa.

---

## 4. Responsividade e breakpoint

- **Desktop (linha única):** o breakpoint de transição deve ser determinado pela largura real dos 6 links + 3 dropdowns + marca + `ThemeToggle` sem encolher a tipografia abaixo de `0.8125rem` (`13px`) e sem overflow horizontal.
  - **Estimativa técnica inicial:** `xl` (`1280px`) para desktop completo, ou breakpoint customizado (ex.: `min-[1120px]:`) a ser validado nas larguras `1024px`, `1120px`, `1280px` e `1440px` durante `EXP-06`.
  - Em `1024px`, se os 9 itens não couberem com folga e legibilidade, acionar o menu unificado recolhível.
- **Mobile e larguras intermediárias (`320px`, `375px`, `393px`, `768px`, e até o breakpoint desktop):**
  - Barra superior compacta: `Logo` à esquerda; `ThemeToggle` (fora do menu expansível) + botão hambúrguer (`min-h-11 min-w-11`) à direita.
  - **Menu único em lista** (com rolagem vertical segura em telas baixas/paisagem e sem reproduzir os mini-cards grandes de imagem) organizado em 4 seções com separadores visuais:
    1. **Navegação principal** (Home, Sobre, Projetos, Linux, Artigos, Resenhas)
    2. **Cultura** (Jogos, Filmes, Música, Livros)
    3. **Tecnologia** (Diário Linux, Open Source)
    4. **Acervo** (Recomendações, Galeria)
- **Alternador de tema:** mantém integralmente `src/components/ui/ThemeToggle.astro` (somente ícone lua/sol, sem texto visível, `44×44 px`, `aria-live="polite"`).

---

## 5. Modelo de dados proposto (`src/data/navigation.ts`)

```ts
export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  available: boolean;
}

export interface NavDropdownItem extends NavLinkItem {
  description: string;
  /** Caminho relativo em public/images/header/ (quando disponível e aprovado). */
  image?: {
    src: string;
    width: number;
    height: number;
    position?: string;
  };
}

export interface NavDropdownGroup {
  id: 'cultura' | 'tecnologia' | 'acervo';
  label: string;
  columns: 2;
  /** Prefixos de rota que ativam o indicador discreto neste grupo. */
  matchPrefixes: string[];
  items: NavDropdownItem[];
}
```

> **Compatibilidade:** manter exportações auxiliares se algum teste ou componente depender da lista plana de rotas, garantindo zero regressão na migração da `EXP-06`.

---

## 6. Checklist de validação da fase EXP-06

- [ ] Testado em `320px`, `375px`, `393px`, `768px`, `1024px`, breakpoint real e `1440px` sem overflow horizontal.
- [ ] Hover não abre dropdown; clique abre/fecha; apenas 1 aberto por vez; clique fora e `Escape` fecham.
- [ ] Nenhum dropdown ultrapassa a borda direita/esquerda da viewport.
- [ ] Estado ativo correto em rotas raiz e subrotas (`/jogos/[id]/`, `/diario-linux/[id]/`, `/galeria/[album]/`).
- [ ] Foco visível por teclado e leitura correta em ambos os temas (escuro e claro).
- [ ] `ThemeToggle` preservado sem regressão de persistência, anti-FOUC ou acessibilidade.
- [ ] Compatibilidade de `withBase()` validada na Vercel e no GitHub Pages (`/guilherme.dev-blog/`).
