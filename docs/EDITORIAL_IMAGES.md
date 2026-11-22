# Inventário e Diretrizes de Imagens — Expansão Editorial (EXP-01)

> **Status:** Inventário inicial consolidado (`EXP-01`) · **Assets pendentes de envio/aprovação pelo autor.**
> **Regra fundamental:** Nenhuma imagem fictícia, gerada automaticamente ou externa não autorizada será usada. Nenhuma página será publicada com placeholders visíveis.

---

## 1. Organização de pastas recomendada

Todas as imagens locais definitivas da expansão seguem o padrão já adotado em `public/images/`, compatível com `withBase()` na Vercel e no GitHub Pages:

```text
public/images/
├── header/                              # Miniaturas dos 8 cards dos dropdowns do Header 2.0
│   ├── jogos.webp
│   ├── filmes.webp
│   ├── musica.webp
│   ├── livros.webp
│   ├── diario-linux.webp
│   ├── open-source.webp
│   ├── recomendacoes.webp
│   └── galeria.webp
├── resenhas/
│   └── shinobido-uma-joia-esquecida/    # Capa + capturas 4:3 / 16:9 do jogo
├── diario-linux/
│   └── como-personalizo-meu-gnome/      # Capa + capturas 01 a 09 (antes/depois)
└── recomendacoes/                       # Fotos reais dos itens recomendados
    ├── kz-edx-pro.webp
    └── editora-principis.webp
```

---

## 2. Regras técnicas de qualidade, proporção e acessibilidade

1. **Preservação de proporção (4:3 e 16:9):**
   - Capturas de jogos antigos (PS2 em 4:3) **nunca** devem ser esticadas nem cortadas à força para 16:9. O container editorial respeita a razão natural da imagem (`w-full h-auto` / `object-contain`).
   - No lightbox ampliado (`EditorialLightbox`), toda imagem é exibida com `object-contain`, fundo escuro dedicado (`--color-v2-media-stage`), botão de fechar e navegação por teclado (`Escape`, setas).
2. **Nitidez em capturas técnicas (Diário Linux):**
   - Screenshots de janelas do Extension Manager, Dash to Dock e Blur my Shell precisam manter textos legíveis — evitar compressão agressiva; preferir PNG otimizado ou WebP lossless/alta qualidade (`q ≥ 85`) com largura adequada (`1280px–1920px`).
3. **Desempenho:**
   - Imagens de capa/abertura (`above the fold`): `loading="eager"`, `decoding="async"`, dimensões explícitas (`width`/`height`).
   - Imagens ao longo do texto e miniaturas de dropdown: `loading="lazy"`, `decoding="async"`.
4. **Acessibilidade:**
   - Imagens decorativas de fundo (mini-cards do Header 2.0): `alt=""` (título e descrição já estão em texto visível no link).
   - Imagens editoriais e técnicas: `alt` descritivo específico + `<figcaption>` opcional quando houver legenda aprovada.
5. **Imagens sensíveis a spoilers:**
   - Só entram quando explicitamente autorizadas pelo autor e sempre dentro de um bloco recolhível `SpoilerBlock`, nunca como capa, `og:image` ou expostas no lightbox fora da área protegida.
6. **Privacidade, direitos e origem futura:**
   - Priorizar **arquivos locais** na primeira versão, preservando suporte técnico a URLs externas futuramente somente com verificação de direitos/licença e crédito quando aplicável.
   - Antes de publicar screenshots técnicas (Diário Linux / GNOME), conferir se não há dados pessoais, caminhos privados, notificações ou informações sensíveis visíveis nas capturas.

---

## 3. Inventário completo de imagens pendentes

Legenda de status: `pendente` | `recebida` | `validada` | `integrada`

### 3.1 Header 2.0 — Mini-cards dos dropdowns (8 imagens)

|    # | Seção      | Componente / Destino      | Posição prevista | Direção temática aprovada (`HEADER_2_0.md` §5)                                          | Arquivo sugerido                          | Proporção recomendada | Legenda prevista | Status     |
| ---: | ---------- | ------------------------- | ---------------- | --------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------- | ---------------- | ---------- |
| H-01 | Header 2.0 | Cultura → Jogos           | Card 1 (2×2)     | Atmosfera de jogos sombria, aventura ou estética japonesa feudal coerente com o blog    | `public/images/header/jogos.webp`         | 16:10 ou 16:9         | — (decorativa)   | `pendente` |
| H-02 | Header 2.0 | Cultura → Filmes          | Card 2 (2×2)     | Cinema, iluminação dramática, projetores, salas escuras ou composições cinematográficas | `public/images/header/filmes.webp`        | 16:10 ou 16:9         | — (decorativa)   | `pendente` |
| H-03 | Header 2.0 | Cultura → Música          | Card 3 (2×2)     | Instrumentos, discos, fones ou estúdios com iluminação controlada                       | `public/images/header/musica.webp`        | 16:10 ou 16:9         | — (decorativa)   | `pendente` |
| H-04 | Header 2.0 | Cultura → Livros          | Card 4 (2×2)     | Bibliotecas, livros, madeira, papel, estantes e ambientes contemplativos                | `public/images/header/livros.webp`        | 16:10 ou 16:9         | — (decorativa)   | `pendente` |
| H-05 | Header 2.0 | Tecnologia → Diário Linux | Card 1 (2×1)     | Terminal, desktop Linux, ambiente de desenvolvimento ou documentação/configuração       | `public/images/header/diario-linux.webp`  | 16:10 ou 16:9         | — (decorativa)   | `pendente` |
| H-06 | Header 2.0 | Tecnologia → Open Source  | Card 2 (2×1)     | Código, ferramentas de desenvolvimento, software livre ou elementos tecnológicos        | `public/images/header/open-source.webp`   | 16:10 ou 16:9         | — (decorativa)   | `pendente` |
| H-07 | Header 2.0 | Acervo → Recomendações    | Card 1 (2×1)     | Produtos, equipamentos ou objetos sobre superfícies escuras                             | `public/images/header/recomendacoes.webp` | 16:10 ou 16:9         | — (decorativa)   | `pendente` |
| H-08 | Header 2.0 | Acervo → Galeria          | Card 2 (2×1)     | Composições fotográficas ou artísticas, wallpapers e atmosferas da galeria              | `public/images/header/galeria.webp`       | 16:10 ou 16:9         | — (decorativa)   | `pendente` |

> **Nota:** Se o autor desejar, alguns destinos já existentes (`jogos`, `filmes`, `musica`, `livros`, `open-source`, `galeria`) possuem fotos temáticas em `public/images/home/*-card.webp`, mas nenhuma será reaproveitada no Header 2.0 sem aprovação explícita.

### 3.2 Resenhas — _Shinobido: uma joia esquecida do PS2_

O texto original não fixa ainda os arquivos definitivos; a arquitetura suportará capa e capturas distribuídas entre seções conforme o autor enviar os screenshots reais:

|     # | Seção    | Artigo    | Posição prevista                                          | Tipo                                                              | Arquivo sugerido                                                | Proporção recomendada  | Legenda prevista     | Status     |
| ----: | -------- | --------- | --------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------- | -------------------- | ---------- |
|  R-01 | Resenhas | Shinobido | Abertura / Capa + Card                                    | Capa / Hero                                                       | `public/images/resenhas/shinobido-uma-joia-esquecida/capa.webp` | 16:9 ou 4:3 (original) | A definir pelo autor | `pendente` |
|  R-02 | Resenhas | Shinobido | Seção "A liberdade de agir nas sombras"                   | Captura de mecânica (furtividade / gancho)                        | `.../shinobido-furtividade.webp`                                | 4:3 original (PS2)     | A definir pelo autor | `pendente` |
|  R-03 | Resenhas | Shinobido | Seção "Suas ações realmente tinham consequências"         | Captura do mapa/facções                                           | `.../shinobido-faccoes.webp`                                    | 4:3 original (PS2)     | A definir pelo autor | `pendente` |
|  R-04 | Resenhas | Shinobido | Seção "O mundo misterioso de Goh"                         | Atmosfera / personagens                                           | `.../shinobido-atmosfera.webp`                                  | 4:3 original (PS2)     | A definir pelo autor | `pendente` |
| R-05+ | Resenhas | Shinobido | Galerias opcionais / outras posições definidas pelo autor | Capturas adicionais (incluindo eventuais spoilers se autorizados) | `.../shinobido-extra-NN.webp`                                   | 4:3 original (PS2)     | A definir pelo autor | `pendente` |

### 3.3 Diário Linux — _Como personalizo meu GNOME_ (10 marcações explícitas no Markdown)

Todas as posições abaixo correspondem exatamente às marcações presentes no texto original fornecido pelo autor:

|     # | Seção        | Artigo               | Posição prevista no Markdown                                        | Tipo                                                             | Arquivo sugerido                                                          | Proporção recomendada           | Legenda proposta no Markdown                                                             | Status     |
| ----: | ------------ | -------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------- | ---------- |
|  L-00 | Diário Linux | Personalização GNOME | `[IMAGEM DE CAPA]` — Topo do tutorial                               | Capa / Desktop                                                   | `public/images/diario-linux/como-personalizo-meu-gnome/capa-desktop.webp` | 16:9 (resolução nativa)         | Captura do desktop personalizado (dock inferior e tema escuro)                           | `pendente` |
|  L-01 | Diário Linux | Personalização GNOME | `[CAPTURA 01]` — Fim da seção 1 (_Como instalar extensões_)         | Captura técnica (com marcação de pesquisa/ativação/preferências) | `.../01-extension-manager.webp`                                           | Nativa da janela                | Minhas extensões instaladas no GNOME, gerenciadas pelo Extension Manager.                | `pendente` |
|  L-02 | Diário Linux | Personalização GNOME | `[CAPTURA 02]` — Seção 2 (_Minhas configurações_ do Dash to Dock)   | Captura técnica (preferências com destaques)                     | `.../02-dash-to-dock-preferencias.webp`                                   | Nativa da janela                | As configurações que utilizo para deixar a dock na parte inferior.                       | `pendente` |
|  L-03 | Diário Linux | Personalização GNOME | `[CAPTURA 03]` — Seção 2 (logo após CAPTURA 02)                     | Captura de desktop                                               | `.../03-dash-to-dock-resultado.webp`                                      | 16:9                            | Resultado do Dash to Dock com meus ajustes.                                              | `pendente` |
|  L-04 | Diário Linux | Personalização GNOME | `[CAPTURA 04]` — Fim da seção 3 (_Blur my Shell_)                   | Captura de desktop / preferências                                | `.../04-blur-my-shell.webp`                                               | 16:9 / nativa                   | Efeitos de transparência e desfoque utilizados na minha personalização.                  | `pendente` |
|  L-05 | Diário Linux | Personalização GNOME | `[CAPTURA 05]` — Seção 4 (_ArcMenu_)                                | Captura de desktop                                               | `.../05-arcmenu-aberto.webp`                                              | 16:9                            | O ArcMenu no canto superior esquerdo do meu GNOME.                                       | `pendente` |
|  L-06 | Diário Linux | Personalização GNOME | `[CAPTURA 06]` — Seção 4 (_Hide Top Bar_, barra visível)            | Captura de desktop                                               | `.../06-hide-top-bar-visivel.webp`                                        | 16:9                            | O Hide Top Bar permite ocultar a barra superior e revelá-la quando necessário. (par 1/2) | `pendente` |
|  L-07 | Diário Linux | Personalização GNOME | `[CAPTURA 07]` — Seção 4 (_Hide Top Bar_, barra oculta)             | Captura de desktop                                               | `.../07-hide-top-bar-oculta.webp`                                         | 16:9                            | O Hide Top Bar permite ocultar a barra superior e revelá-la quando necessário. (par 2/2) | `pendente` |
|  L-08 | Diário Linux | Personalização GNOME | `[CAPTURA 08]` — Fim da seção 5 (_Minhas outras seis extensões_)    | Captura técnica                                                  | `.../08-lista-dez-extensoes.webp`                                         | Nativa da janela                | As dez extensões que utilizo no meu GNOME.                                               | `pendente` |
| L-09a | Diário Linux | Personalização GNOME | `[CAPTURA 09]` — Seção 6 (_Antes e depois_ — GNOME padrão)          | Comparação (Antes)                                               | `.../09-antes-gnome-padrao.webp`                                          | 16:9 (mesma resolução de L-09b) | Comparação da aparência do GNOME antes e depois da personalização.                       | `pendente` |
| L-09b | Diário Linux | Personalização GNOME | `[CAPTURA 09]` — Seção 6 (_Antes e depois_ — Desktop personalizado) | Comparação (Depois)                                              | `.../09-depois-gnome-personalizado.webp`                                  | 16:9 (mesma resolução de L-09a) | Comparação da aparência do GNOME antes e depois da personalização.                       | `pendente` |

### 3.4 Recomendações (2 imagens)

|    # | Seção         | Card              | Posição prevista         | Tipo                                             | Arquivo sugerido                                     | Proporção recomendada | Legenda / Alt previsto                                   | Status     |
| ---: | ------------- | ----------------- | ------------------------ | ------------------------------------------------ | ---------------------------------------------------- | --------------------- | -------------------------------------------------------- | ---------- |
| C-01 | Recomendações | KZ EDX Pro        | Imagem principal do card | Foto real do produto (modelo exato KZ EDX Pro)   | `public/images/recomendacoes/kz-edx-pro.webp`        | 16:10 ou 4:3          | Fotografia do fone intra-auricular KZ EDX Pro            | `pendente` |
| C-02 | Recomendações | Editora Principis | Imagem principal do card | Foto própria dos livros/boxes físicos da editora | `public/images/recomendacoes/editora-principis.webp` | 16:10 ou 4:3          | Livros e boxes físicos publicados pela Editora Principis | `pendente` |

---

## 4. Resumo quantitativo de pendências

- **Header 2.0:** 8 imagens temáticas (`pendente`).
- **Resenhas (Shinobido):** 1 capa + capturas de gameplay/personagens a definir (`pendente`).
- **Diário Linux (Personalização GNOME):** 11 arquivos para as 10 marcações (capa + capturas 01–08 + par antes/depois da captura 09) (`pendente`).
- **Recomendações:** 2 fotografias reais (`pendente`).
