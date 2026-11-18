# Design System 2.0 — guilherme.dev

> **Estado:** identidade visual **implementada em todas as páginas**; VIS-01 a VIS-07 concluídas no roadmap.  
> **Data da especificação original:** 14/11/2026 · **Revisão documental:** 15/11/2026.  
> **Escopo:** registro da identidade aprovada e das diretrizes de manutenção, preservando dados, URLs e funcionalidades.  
> **Regra de prioridade:** a implementação aprovada e as referências da Home prevalecem sobre exemplos ilustrativos antigos. Mudanças futuras exigem aprovação.

## 0. Referências oficiais e modo de utilização

### 0.1 Material aprovado

- **Referência principal e vinculante:** gravação de tela do protótipo Figma Make, `Gravação de tela de 2026-11-14 21-52-11.mp4`, fornecida pelo autor.
- **Capturas extraídas da gravação, fornecidas junto a este documento:**
  - `references/home-hero.png` — header, fotografia integrada e hero com grande título serifado.
  - `references/home-cards.png` — composição visual do acervo e cartões assimétricos.
  - `references/home-footer.png` — últimas categorias, faixa editorial e rodapé.
  - `references/home-cards-hover.png` e `references/home-footer-hover.png` — estados de hover (card de Galeria com borda clara e botão de seta vinho; faixa editorial com fundo elevado).
- **Referências complementares:** capturas do protótipo anterior do Figma compartilhadas pelo autor, úteis para compreender o percurso de design, mas **subordinadas** à Home aprovada na gravação.

> As capturas contêm a interface do navegador/Figma. Ao implementá-las, considerar **somente o site renderizado**; não reproduzir as barras do navegador ou do editor. Os arquivos de referência **não são os assets originais** das fotografias, fontes ou componentes. Obter/identificar esses recursos por vias adequadas antes da integração definitiva.

### 0.2 Distinção entre decisões

- **[APROVADO]** corresponde ao resultado e à intenção visual já validados pelo autor.
- **[DIRETRIZ]** estabelece como estender a linguagem visual a outras páginas mantendo coerência.
- **[PROVISÓRIO]** indica sugestões técnicas sujeitas a comparação com o protótipo.
- **[PENDENTE]** requer verificação do Figma, medição ou aprovação em telas reais.

**Não substituir a identidade aprovada por uma interpretação genérica de “tema japonês”, “minimalismo escuro” ou “cyberpunk”.** Se houver conflito visual, ajustar pela referência, não pelo gosto do implementador.

## 1. Identidade e conceito

**[APROVADO]** Conceito de trabalho: **“um arquivo pessoal nas sombras”**. Uma experiência sombria, cinematográfica, editorial e autoral. Japão feudal e _Shinobido: Way of the Ninja_ informam **atmosfera, sombras, arquitetura e senso de composição**, não uma temática literal de ninjas.

### 1.1 Objetivos de percepção

1. Escuridão profunda com imagem e tipografia altamente intencionais.
2. Abertura de impacto cinematográfico, sem aparência de landing page corporativa.
3. Sensação de curadoria pessoal: categorias como pôsteres, não cartões de dashboard.
4. Preto dominante; vermelho envelhecido como pequeno marcador de atenção.
5. Sofisticação e legibilidade: emoção na apresentação, clareza ao ler.
6. Referências orientais discretas, nunca anime, caricatura ou ideogramas aleatórios.

### 1.2 Antipadrões explícitos

- Não retornar aos cards azulados/ciano-magenta do conceito Blade Runner anterior.
- Não usar bordas neon intensas, gradientes coloridos, glassmorphism chamativo, cartões SaaS, sombras exageradas ou cantos muito arredondados.
- Não sobrecarregar de textura, símbolos orientais ou animações infinitas.
- Não repetir o mesmo layout em todas as páginas; consistência não significa uniformidade.
- Não reduzir contraste a ponto de a leitura ficar difícil.
- Não inventar biografia, projetos, datas, avaliações, texto editorial ou links para preencher espaços.

## 2. Fundamentos visuais

### 2.1 Cor e luz

**[APROVADO]** Preto quase absoluto como superfície dominante; fotografia de baixa saturação; texto off-white levemente aquecido; detalhe vermelho escuro usado parcimoniosamente. Fotografia e sombreamento criam profundidade mais do que camadas coloridas.

**[PROVISÓRIO]** Tokens de partida — **não foram amostrados diretamente do Figma**:

| Token sugerido     | Cor inicial | Uso                                                 |
| ------------------ | ----------- | --------------------------------------------------- |
| `--bg`             | `#080808`   | fundo principal                                     |
| `--surface`        | `#141210`   | blocos e elementos elevados muito discretos         |
| `--surface-raised` | `#1B1715`   | superfícies pontuais                                |
| `--text`           | `#E7DED2`   | títulos e conteúdo de destaque                      |
| `--text-body`      | `#C3BAB0`   | leitura longa, crônicas e parágrafos principais     |
| `--text-muted`     | `#A89F95`   | parágrafos auxiliares, metadados e legendas         |
| `--border`         | `#332B26`   | linhas, cartões e separadores                       |
| `--accent`         | `#79382F`   | acento vermelho de navegação e estados selecionados |
| `--accent-warm`    | `#A18A70`   | eventual detalhe quente, não obrigatório            |

**[IMPLEMENTADO]** Os tokens de cores V2 estão definidos em `src/styles/global.css` e aplicados globalmente. Os valores acima são a especificação de partida; não alterá-los apenas para reproduzir valores hipotéticos do protótipo.

### 2.2 Fotografia e sobreposições

- **[APROVADO]** O hero apresenta telhados tradicionais japoneses recortados em silhueta, vegetação e névoa/céu desaturado; a esquerda mergulha em preto, enquanto a foto ganha presença à direita.
- A integração é **sem moldura** e sem impressão de “imagem num card”.
- Usar sombreado/gradientes e composição da imagem, nunca um filtro preto indiscriminado que elimine seus detalhes.
- Nas categorias, imagens distintas e atmosfericamente coerentes; cada card deve ter foco visual próprio.
- Priorizar origem/licença documentada para fotografias; não usar thumbnails do Google Imagens como CDN.
- Manter legibilidade dos títulos independentemente da fotografia, usando gradiente inferior quando necessário.

### 2.3 Tipografia

**[APROVADO]** Forte contraste editorial entre display serifado expressivo e textos funcionais simples. O hero usa escala grande, linhas curtas e tratamento em itálico para a palavra **“histórias”**. As categorias têm títulos serifados na base; navegação, índices e rótulos usam fonte discreta com espaçamento.

**[DIRETRIZ]** Hierarquia tipográfica:

| Papel                     | Tratamento                                                                  |
| ------------------------- | --------------------------------------------------------------------------- |
| Hero                      | serifada elegante, muito grande, com quebras deliberadas e itálico seletivo |
| Títulos de seções e cards | serifada editorial, escalada por importância                                |
| Texto de leitura          | sans-serif acessível, entrelinha confortável                                |
| Microtextos e navegação   | sans-serif discreta, caixa alta e tracking moderado quando apropriado       |
| Numeração/labels          | tipografia pequena, legível, sem excesso de contraste reduzido              |

**[HISTÓRICO]** Na concepção, as famílias do protótipo ainda precisavam ser identificadas. A implementação aprovada adotou **Cormorant Garamond, Inter e JetBrains Mono**, com fontes locais WOFF2 em `public/fonts/` (ver §11.2 e `src/styles/global.css`). Não substituir fontes por exemplos antigos.

### 2.4 Geometria, respiro e molduras

- Cantos quase retos, linhas muito finas, quinas eventualmente trabalhadas de maneira sutil.
- Ritmo editorial: hero amplo, transição deliberada, acervo visual denso o bastante para não parecer vazio.
- Alinhamentos e espaçamentos constantes nos limites da grid, embora os cartões tenham dimensões distintas.
- A assimetria é **intencional** e exclusiva das áreas que dela se beneficiem; não copiar essa composição em catálogos com centenas de registros.
- **[IMPLEMENTADO]** Larguras, espaçamentos, alturas e breakpoints estão no CSS e nos componentes atuais. A comparação com protótipo foi etapa de VIS-07; não tratar números ilustrativos deste documento como substitutos do código.

## 3. Header global

**[APROVADO na Home]** Marca `guilherme.dev` à esquerda, links horizontais discretos à direita, base preta/translúcida com divisor fino; link ativo com traço vermelho discreto.

Navegação existente a preservar: **Home, Sobre, Projetos, Linux, Jogos, Filmes, Música, Livros, Artigos, Open Source, Galeria**.

**[DIRETRIZ]** O header não deve competir com o hero. No mobile, preferir menu recolhível acessível à compressão dos 11 links numa linha. Suportar teclado, foco visível, estado ativo sem depender apenas da cor e fechamento coerente.

## 4. Home — composição aprovada (referência-mestra)

**[IMPLEMENTADO]** A Home foi desenvolvida a partir da gravação e é a referência visual vigente. Não solicitar uma nova geração criativa em substituição à composição aprovada. Preservar **fidelidade visual**, performance, acessibilidade e responsividade.

### 4.1 Hero

Referência: `references/home-hero.png`.

- Hero de praticamente uma dobra de tela após o header, com altura generosa.
- Fotografia dramática de arquitetura japonesa e vegetação, com tratamento quase monocromático, misturando-se ao fundo preto.
- Área de texto no lado esquerdo; imagem mais evidente à direita, **sem limite rígido de coluna**.
- Pequeno indicador editorial sobre o título: `ARQUIVO PESSOAL / GUILHERME.DEV`.
- Título conforme protótipo: **“Ideias, código e histórias.”**, com divisão editorial em duas linhas e **“histórias.”** em itálico de destaque.
- Subtítulo curto e pessoal conforme o protótipo: espaço sobre tecnologia, Linux, jogos, cinema, música e o que merece registro.
- Ação discreta e sublinhada: `EXPLORAR O ACERVO`, com seta; rolar para a seção de categorias, não navegar para rota inexistente.
- Marcação pequena de rolagem na parte inferior e pequenos elementos editoriais laterais **somente** se existirem na referência, sem inventar decoração funcionalmente irrelevante.
- Proteger o contraste texto/fundo em larguras intermediárias; preservar foco legível.

**Não usar:** foto em retângulo independente, botões chamativos, três CTAs, parallax pesado, personagens japoneses, animação de glitch ou estética de terminal.

### 4.2 Introdução ao acervo

**[APROVADO]** Após o hero há uma passagem editorial com título serifado expressivo e descrição curta, conduzindo às categorias. O protótipo trabalha com a ideia **“Notas de campo, projetos e referências.”** e um arquivo pessoal vivo.

- Posicionamento e dimensão devem seguir referência audiovisual.
- Não criar bloco “Sobre mim” completo na Home. A biografia continua na rota própria.

### 4.3 Grade assimétrica das nove categorias

Referência: `references/home-cards.png` e capturas fornecidas pelo autor.

**[APROVADO]** Organização editorial em três linhas, com cartões de diferentes larguras, formando uma composição proporcionalmente próxima ao Figma:

| Linha | Esquerda                   | Centro                 | Direita               |
| ----- | -------------------------- | ---------------------- | --------------------- |
| 1     | **Projetos** — largo       | **Linux** — estreito   | **Jogos** — estreito  |
| 2     | **Filmes** — estreito      | **Música** — largo     | **Livros** — estreito |
| 3     | **Open Source** — estreito | **Artigos** — estreito | **Galeria** — largo   |

Uma implementação em **12 colunas com distribuição aproximada 6/3/3, 3/6/3, 3/3/6** é uma sugestão técnica, **não medida exata do Figma**. As dimensões finais deverão ser calibradas visualmente.

**Padrão de card aprovado:**

1. Foto de fundo dominante, muito escura, bem escolhida, com profundidade.
2. Pequeno índice numérico / rótulo editorial discreto.
3. Título serifado em off-white, geralmente na base à esquerda.
4. Gradiente inferior suficiente para leitura.
5. Contorno delicado, quinas com acabamento sóbrio.
6. Pequena seta de ação, usualmente no canto inferior direito.
7. Hover/foco com discreto realce luminoso de borda, seta e imagem.
8. Link funcional para a seção correspondente, sem links aninhados.

**Manter todos os nove destinos reais**, mesmo em telas pequenas. As imagens da Home são atmosfera **editorial**; não substituir as capas reais dos jogos ou prints reais dos projetos nas páginas internas por imagens japonesas aleatórias.

### 4.4 Fechamento editorial e rodapé

Referência: `references/home-footer.png`.

- Após os cards, uma faixa editorial larga e discreta, sem repetir o padrão dos cartões de categoria.
- Na gravação, a faixa utiliza uma mensagem do tipo **“Um espaço reservado para o próximo registro.”**; reproduzir o texto efetivamente aprovado após conferir o protótipo, sem publicar conteúdo fictício atribuído ao autor.
- Rodapé minimalista, linha separadora, marca, informação editorial breve e links sociais reais já existentes no projeto; opção discreta de voltar ao topo.
- **Não inserir** grande seção Sobre, formulário de newsletter, métricas inventadas ou novos links sociais.

## 5. Páginas internas — diretrizes aprovadas conceitualmente

**Importante:** a Home foi aprovada **visualmente**; as páginas internas abaixo **ainda exigem protótipos ou verificações específicas** antes de declarar fidelidade de implementação.

| Página          | Composição e prioridades                                                                                 | Preservar                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Sobre**       | página autoral com foto, biografia, interesses e trajetória; layout intimista com boa hierarquia         | informações reais, links, componentes úteis; sem seção Sobre extensa na Home |
| **Linux**       | crônica de leitura centralizada e timeline iluminada discretamente; marcadores com refinamento editorial | capítulos reais, ordem dos SO e datas não inventadas                         |
| **Jogos**       | biblioteca de capas **verticais**, grid coerente e página individual rica em avaliação                   | imagens, jogos, critérios Mecânica/Enredo/Estética/Retenção/Feeling, médias  |
| **Projetos**    | cards **horizontais grandes**, print à esquerda e texto/ações à direita; screenshots sem corte indevido  | títulos, descrições, tecnologias, links e prints reais                       |
| **Filmes**      | painéis de arquivo/registro, capazes de funcionar sem pôster                                             | diretor, ano, seis critérios, avaliações completas e páginas individuais     |
| **Livros**      | arquivo/biblioteca pessoal, status de leitura e favoritos                                                | títulos, autores, status, conteúdo opcional                                  |
| **Artigos**     | coluna confortável para leitura, título editorial, imagens pontuais                                      | artigos, datas, tags, rotas, metadados, destaque                             |
| **Música**      | bandas em cards dramáticos; álbuns visuais; músicas em listas compactas                                  | artistas, imagens reutilizadas e links reais                                 |
| **Open Source** | catálogo objetivo de ferramentas, estilo editorial de baixa ornamentação                                 | softwares, descrições e links oficiais                                       |
| **Galeria**     | álbuns como grandes portais visuais; grid interna funcional                                              | 3 álbuns reais, lightbox, arquivo original, proporções                       |

**Consistência global:** header, paleta, tipografia, bordas, iluminação, acessibilidade e rodapé. **Variação local:** composição conforme o tipo de conteúdo; **não** aplicar hero gigante ou assimetria 6/3/3 indiscriminadamente.

## 6. Sistema de componentes e estados

**[DIRETRIZ]** Reutilização por comportamento, evitando tanto duplicação quanto “um componente universal” repleto de condições.

- `SiteHeader` / `SiteFooter`: navegação e autoria.
- `HomeHero`: composição exclusiva e fiel ao protótipo.
- `CategoryPosterCard` / `CategoryGrid`: a grade editorial de nove destinos.
- `ProjectShowcaseCard`: screenshot íntegra + informações + ações.
- `CatalogCoverCard`: capas de jogos, com foco legível em título/nota.
- `ArchiveRecordCard`: filmes/livros sem dependência de imagem.
- `ArticleReadingLayout`: controle de largura, hierarquia e imagens de leitura.
- `Timeline`: progressão dos sistemas operacionais.
- `GalleryAlbumCard` / lightbox existente: composição e navegação por fotos.

Nomes acima são **exemplos**, não ordem para criar arquivos ou reescrever componentes que já existem. Primeiro inspecionar a implementação atual.

**Estados obrigatórios:** padrão, hover, foco por teclado, ativo/selecionado, carregamento, ausência de imagem, dados opcionais vazios e layouts pequenos. Não criar informação fictícia para compensar falta de imagem.

## 7. Responsividade e acessibilidade

**[APROVADO conceitualmente]** Mesmo design em desktop e mobile, com simplificação compositiva no celular.

- Desktop: hero integrado com texto à esquerda e foto à direita; grade assimétrica; menu horizontal quando couber.
- Tablet: reorganizar a grid de forma coerente, em geral dois blocos por linha se houver espaço; não manter largura mínima que cause rolagem horizontal.
- Mobile: hero verticalizado ou integrado por sobreposição controlada; tipografia com escala fluida; cards em coluna ou composição simplificada; menu recolhível.
- Manter alvos de toque adequados, contraste WCAG como referência, títulos sem truncamento, foco claramente perceptível e navegação completa por teclado.
- Respeitar `prefers-reduced-motion`; transições curtas, sem efeitos infinitos, rolagem forçada ou parallax que prejudique uso.
- Imagens decorativas usam descrição vazia quando correto; imagens informativas têm texto alternativo específico.

**[HISTÓRICO]** A etapa de implementação exigiu testar desktop, tablet e celular. Revisões futuras de responsividade devem ser feitas no produto atual; a gravação desktop isolada não comprova a experiência mobile.

## 8. Imagens, carregamento e publicação

- Não tratar screenshots da gravação como arquivos finais das fotografias; localizar as imagens-fonte usadas pelo protótipo quando legalmente e tecnicamente possível.
- Imagens locais no Astro devem respeitar a configuração de `base` para GitHub Pages e também funcionar na Vercel.
- Usar formatos adequados, dimensões apropriadas, carregamento preguiçoso fora da primeira dobra e prioridade de carregamento para o hero quando necessário.
- Não impor `object-cover` indiscriminadamente a prints informativos de projetos; recortar apenas imagens fotográficas nos contextos visuais em que isso for aprovado.
- Não alterar a fonte de verdade dos conteúdos, nomes dos jogos, notas, imagens da galeria ou links.
- Verificar direitos/autorização de uso das fotografias e outros recursos do protótipo antes da publicação definitiva.

## 9. Histórico da migração visual concluída

**[HISTÓRICO]** As etapas abaixo documentam como a migração VIS-01 a VIS-07 foi executada, sempre preservando a base real de conteúdo. **Não constituem um novo plano de implementação**:

1. **Inventário prévio:** ler `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/CONTENT_SECTIONS.md`, `docs/ROADMAP.md` e componentes atuais; mapear dependências.
2. **Registrar referências:** adicionar o novo documento e as imagens de referência, sem mexer no site.
3. **Aprovar estratégia:** identificar fontes e assets, construir plano de atualização de tokens e layout, riscos e rollback.
4. **Fundação visual:** tokens, tipografia, elementos compartilhados e header, sem alterar conteúdos.
5. **Home fiel ao protótipo:** hero, grade 9 cards, transições e rodapé; comparar visualmente com a gravação.
6. **Sobre e Linux:** priorizar as duas páginas pessoais, com aprovação visual separada.
7. **Demais seções:** Projetos, Jogos, Filmes, Livros, Artigos, Música, Open Source, Galeria — conforme componentes e dependências.
8. **Regressão e revisão:** verificar rotas, conteúdo, imagens, notas, lightbox, SEO, mobile, desempenho e deploy.

**Controle de mudanças:** commits pequenos e convencionais; **não commitar nem fazer push sem autorização do autor**. Não reexecutar importações reais, não mudar schemas, não remover dados reais e não redesenhar todos os catálogos de uma vez.

### 9.1 Backlog original (já registrado e concluído no roadmap)

| ID sugerido | Trabalho                           | Condição de conclusão                           |
| ----------- | ---------------------------------- | ----------------------------------------------- |
| VIS-01      | Referências e Design System 2.0    | documentação revisada e referências arquivadas  |
| VIS-02      | Tokens, fontes e identidade global | aparência base coerente, sem regressões         |
| VIS-03      | Header + Home aprovada             | comparação visual satisfatória desktop e mobile |
| VIS-04      | Sobre                              | conteúdo preservado e layout aprovado           |
| VIS-05      | Linux                              | narrativa e timeline preservadas e aprovadas    |
| VIS-06      | Catálogos e páginas restantes      | funcionalidade preservada, visual consistente   |
| VIS-07      | QA visual, a11y e deploy           | verificações e revisão final aprovadas          |

A execução e seus commits estão em `docs/ROADMAP.md`. Este backlog resumido é histórico; o roadmap registra também as subetapas VIS-06a a VIS-06h.

## 10. Critérios originais de aceitação (checklist histórico)

O checklist abaixo foi escrito para a migração. O roadmap registra a conclusão das etapas VIS; as caixas não são um relatório de testes executados nesta revisão documental.

### 10.1 Home — fidelidade

- [ ] Ao lado das referências aprovadas, hero tem **a mesma lógica de composição** e hierarquia de texto.
- [ ] A fotografia está integrada ao fundo, sem painel separado.
- [ ] A tipografia serifada e o itálico de “histórias.” são coerentes com a referência.
- [ ] A paleta é preta e desaturada; vermelho só em acentos muito pontuais.
- [ ] O header é discreto; links reais preservados.
- [ ] Exatamente nove categorias, na sequência e assimetria aprovadas.
- [ ] Cards têm imagens dominantes, títulos na base, rótulos, setas e realce sutil.
- [ ] Há encerramento editorial e rodapé discretos, **sem seção Sobre extensa**.
- [ ] Desktop e mobile apresentam leitura e interação satisfatórias, sem overflow.

### 10.2 Integridade do projeto

- [ ] Nenhum artigo, jogo, filme, livro, projeto, artista ou imagem real foi removido/alterado indevidamente.
- [ ] Médias e critérios de Jogos e Filmes seguem iguais.
- [ ] Todas as rotas e links existentes continuam válidos.
- [ ] Imagens de Projetos não sofrem cortes indevidos.
- [ ] Galeria e lightbox permanecem funcionais.
- [ ] Build e testes disponíveis passam; verificar Vercel e GitHub Pages.
- [ ] Elementos interativos acessíveis por teclado; foco perceptível; movimento reduzido respeitado.

### 10.3 Revisão visual

Fazer comparação por capturas **lado a lado** entre protótipo e implementação com tamanho de viewport equivalente. Documentar diferenças, classificando-as em:

- **A corrigir:** composição, tipografia, escala, imagens, proporções, contraste, hierarquia e assimetria.
- **Adaptação aceitável:** diferenças necessárias para responsividade, conteúdo real, acessibilidade, carregamento e limitações documentadas.
- **Pendência de recurso:** imagem/fonte original ainda não obtida ou sem permissão de uso.

Não declarar “pixel-perfect” sem medir/comparar; tampouco prometer cópia exata quando os assets originais não estiverem disponíveis.

## 11. Questões abertas no documento original (histórico)

Os itens abaixo foram registrados antes da implementação e **não devem ser reinterpretados como tarefas pendentes**. O código atual já contém fontes, tokens, breakpoints, imagens e componentes; conferir o repositório antes de reabrir qualquer decisão.

- [ ] Famílias tipográficas reais e licenças.
- [ ] Arquivos originais e direitos das fotografias do hero e dos nove cards.
- [ ] Valores exatos da paleta mediante inspeção no Figma.
- [ ] Breakpoints e tamanhos finais de desktop/tablet/mobile.
- [ ] Detalhes específicos de quinas, iluminação, transições e comportamento de menu.
- [ ] Prototipação/aprovação das páginas internas e da versão mobile.
- [ ] Aprovação dos textos finais no fechamento editorial, caso o protótipo tenha placeholders.

---

## 11.1 Decisões aprovadas pelo autor (14/11/2026)

- **Documentação:** este documento é a referência visual vigente; `DESIGN_SYSTEM.md` permanece como histórico e registro dos tokens atuais.
- **Tokens (decisão histórica):** a V2 começou escopada à Home; após VIS-06h, os tokens compartilhados foram consolidados em `src/styles/global.css` para todo o site.
- **Fontes:** tentar identificar as fontes reais do protótipo; se impossível, usar Cormorant Garamond (display) e Inter (texto/rótulos) como provisórias, comparadas visualmente com as referências. Sem dependências desnecessárias; preferir arquivos locais com licença OFL.
- **Fotografias:** verificar se os arquivos originais do protótipo podem ser obtidos (nunca extrair das capturas). Caso contrário, apresentar opções de Unsplash/Pexels, com origem e licença, para aprovação **antes** de incorporar.
- **Faixa editorial (§4.4):** usar o artigo real "Por que escolhi Fedora (e por que continuo nele)", com título, descrição e data lidos da Content Collection, sem rótulo "demonstrativo" e sem texto inventado. Se o artigo não estiver disponível, registrar a pendência.
- **Rodapé e navegação:** apenas links sociais reais já existentes (sem RSS). Ordem do menu conforme §3. `AboutPreview` sai da Home (componente preservado) e a página Sobre permanece independente.
- **Validação visual:** quadros da gravação podem ser extraídos com `ffmpeg` (vídeo original preservado) para analisar efeitos, animações e rolagem; comparação desktop e mobile durante a implementação.
- **Preservação:** nenhum conteúdo real, avaliação, schema, rota ou imagem de conteúdo é alterado; compatibilidade com Vercel e GitHub Pages mantida.

## 11.2 Recursos confirmados na VIS-02 (14/11/2026) — registro original

Esta seção documenta os recursos disponíveis no momento da fundação V2. A implementação final evoluiu na VIS-03 e nas demais etapas; os cards atuais da Home também usam arquivos locais `*-card.webp` definidos em `src/data/homeCategories.ts`. Para referências operacionais, consultar esse arquivo e `public/images/home/`.

**Tipografia (código do protótipo, confirmada pelo autor):** Cormorant Garamond (500, 600, itálico 500), Inter (300, 400, 500) e JetBrains Mono (400). Hospedadas localmente em `public/fonts/` (subset latin, WOFF2 variável, licença OFL, `font-display: swap`), sem `@import` externo. Tokens: `--font-v2-display`, `--font-v2-sans`, `--font-v2-mono`.

**Fotografias (URLs do protótipo, Unsplash License):** convertidas para WebP em `public/images/home/` (arquivos `hero`, `projetos`, `linux`, `jogos`, `filmes`, `musica`, `livros`, `open-source`, `artigos`, `galeria`). Identificadores Unsplash de origem:

| Uso         | Identificador `photo-…`    | Largura baixada |
| ----------- | -------------------------- | --------------- |
| hero        | 1683455235050-a87ed1e92b84 | 2200            |
| projetos    | 1791276077168-b144ddc6b8d5 | 1400            |
| linux       | 1683560485483-181974bbec9b | 900             |
| jogos       | 1753164717773-2a876ce888ba | 900             |
| filmes      | 1674880944509-7a85ece31e1e | 900             |
| musica      | 1697037491746-8c206af749de | 1400            |
| livros      | 1582740512100-ffdf7c317826 | 900             |
| open-source | 1545659705-c769b5c3d132    | 900             |
| artigos     | 1610338732118-09d3b6fd030c | 900             |
| galeria     | 1755146759567-cfc7ef9d9dcc | 1400            |

As fotografias originais são coloridas; o aspecto escuro e dessaturado é obtido com tratamento de CSS. **Registro original:** a identificação nominal dos fotógrafos não estava consolidada neste documento; conferir metadados/licenças existentes antes de alterar créditos.

**Tokens V2** (`--color-v2-*`, `--container-v2`) e utilitários (`v2-eyebrow`, `v2-focus`, `.v2-scope`) estão em `src/styles/global.css` e já foram consolidados. Os valores documentados como provisórios na fase de design correspondem ao ponto de partida do sistema atual; mudanças de cor exigem revisão visual.

**Comportamento observado na gravação:** sem animação contínua nem parallax; header não fixo; hover dos cards com borda clara e botão de seta preenchido em vinho; hover da faixa editorial com fundo elevado; detalhes do hero (coordenadas, índice `001` com linha vermelha, `DESCER`).

---

## 12. Instrução curta para agentes de implementação

> A Home mostrada em `references/home-hero.png`, `references/home-cards.png`, `references/home-footer.png` e na gravação aprovada em 14/11/2026 é uma **referência visual prioritária já implementada**. Não a reinvente. Consulte a implementação atual e preserve dados, rotas, notas, imagens e funcionalidades. Qualquer redesign necessita de tarefa e aprovação. Jamais execute commit ou push sem autorização.

**Status final deste documento:** registro do Design System 2.0 **vigente**, não autorização para editar o projeto automaticamente.
