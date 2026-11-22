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
├── reviews/
│   └── shinobido/                       # 27 assets preparados (capa, furtividade, facções, personagens, spoilers)
├── linux-diary/
│   └── gnome-personalizacao/            # 11 capturas preparadas para Como personalizo meu GNOME (+ pendências)
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

### 3.2 Resenhas — _Shinobido: uma joia esquecida do PS2_ (27 assets preparados; 14 integrados em `draft`)

Pasta definitiva: `public/images/reviews/shinobido/`. Todos os 27 arquivos recebidos em `public/aqui/` foram inventariados, convertidos/preservados em WebP sem alteração de proporção (redução total de **11,91 MB → 2,11 MB**, `-82,3%`) e validados. Na **EXP-03B**, **14 arquivos** aprovados pelo autor foram integrados ao rascunho `src/content/reviews/shinobido-uma-joia-esquecida.md` (1 capa + 9 imagens isoladas + 2 no par Uzumushi/Kabuto + 2 protegidas dentro dos blocos de spoiler); os outros 13 permanecem validados como reserva de acervo.

|    # | Arquivo original (`public/aqui/`)            | Arquivo definitivo (`public/images/reviews/shinobido/`) | Ação            | Resolução       | Antes → Depois   | Posição / Uso                             | Status      |
| ---: | -------------------------------------------- | ------------------------------------------------------- | --------------- | --------------- | ---------------- | ----------------------------------------- | ----------- |
| R-01 | `Captura de tela de 2026-11-22 00-14-53.png` | `tela-titulo-shinobido.webp`                            | PNG → WebP      | `1920×1080`     | 1,74 MB → 190 KB | Capa / Hero e card                        | `integrada` |
| R-02 | `maxresdefault.jpg`                          | `arte-promocional-goh-ps2.webp`                         | JPG → WebP      | `1280×720`      | 131 KB → 109 KB  | Reserva de acervo                         | `validada`  |
| R-03 | `images.jpg`                                 | `disco-ps2-shinobido.webp`                              | JPG → WebP      | `447×447`       | 30 KB → 37 KB    | Introdução (1º parágrafo)                 | `integrada` |
| R-04 | `e1f265729e518d3b72c34f9321b3bfab.jpg`       | `goh-telhado-santuario-furtividade.webp`                | JPG → WebP      | `1920×1080`     | 121 KB → 119 KB  | Reserva de acervo                         | `validada`  |
| R-05 | `4_1agmKRQ.webp`                             | `furtividade-gancho-noite.webp`                         | WebP preservado | `582×415` (4:3) | 47 KB → 47 KB    | Furtividade — gancho e verticalidade      | `integrada` |
| R-06 | `scstgv.webp`                                | `assassinato-furtivo-goh.webp`                          | WebP preservado | `3827×2160`     | 113 KB → 113 KB  | Furtividade — execuções                   | `integrada` |
| R-07 | `3_bCD2MBP.webp`                             | `combate-direto-guardas.webp`                           | WebP preservado | `582×414` (4:3) | 41 KB → 41 KB    | Furtividade vs. combate direto            | `integrada` |
| R-08 | `Captura de tela de 2026-11-22 00-15-21.png` | `missao-pergaminho-ichijo.webp`                         | PNG → WebP      | `1920×1080`     | 1,62 MB → 173 KB | Reserva de acervo                         | `validada`  |
| R-09 | `Captura de tela de 2026-11-22 00-15-30.png` | `lista-missoes-faccoes.webp`                            | PNG → WebP      | `1920×1080`     | 2,00 MB → 181 KB | Facções — quadro de missões               | `integrada` |
| R-10 | `Captura de tela de 2026-11-22 00-15-38.png` | `status-faccoes-utakata.webp`                           | PNG → WebP      | `1920×1080`     | 1,64 MB → 163 KB | Facções — evolução dos exércitos          | `integrada` |
| R-11 | `Captura de tela de 2026-11-22 00-15-42.png` | `confianca-lorde-ichijo.webp`                           | PNG → WebP      | `1920×1080`     | 1,55 MB → 160 KB | Facções — confiança de Lorde Ichijo       | `integrada` |
| R-12 | `Captura de tela de 2026-11-22 00-15-52.png` | `esconderijo-goh-menu.webp`                             | PNG → WebP      | `1920×1080`     | 2,24 MB → 175 KB | Conclusão — esconderijo de Goh            | `integrada` |
| R-13 | `Fudo_castle.webp`                           | `cenario-castelo-fudo.webp`                             | WebP preservado | `533×400` (4:3) | 65 KB → 65 KB    | Atmosfera — cenário noturno (sem legenda) | `integrada` |
| R-14 | `Goh_holding_soul_fragment_1.webp`           | `goh-fragmento-memoria.webp`                            | WebP preservado | `757×495`       | 51 KB → 51 KB    | **Spoiler 1** (passado de Goh)            | `integrada` |
| R-15 | `Goh.webp`                                   | `personagem-goh.webp`                                   | WebP preservado | `895×1400`      | 78 KB → 78 KB    | Reserva de acervo                         | `validada`  |
| R-16 | `Shinobido_2_ichijo.webp`                    | `personagem-lorde-ichijo.webp`                          | WebP preservado | `442×960`       | 48 KB → 48 KB    | Reserva de acervo                         | `validada`  |
| R-17 | `Akame_samurai.webp`                         | `personagem-lorde-akame.webp`                           | WebP preservado | `203×375`       | 18 KB → 18 KB    | Reserva de acervo                         | `validada`  |
| R-18 | `sadame_1785.webp`                           | `personagem-lorde-sadame.webp`                          | WebP preservado | `400×400`       | 12 KB → 12 KB    | Reserva de acervo                         | `validada`  |
| R-19 | `Zaji.webp`                                  | `personagem-zaji.webp`                                  | WebP preservado | `657×951`       | 90 KB → 90 KB    | Reserva de acervo                         | `validada`  |
| R-20 | `Kinu3.webp`                                 | `personagem-kinu.webp`                                  | WebP preservado | `300×500`       | 31 KB → 31 KB    | Reserva de acervo                         | `validada`  |
| R-21 | `Uzumushi_2.webp`                            | `personagem-uzumushi.webp`                              | WebP preservado | `376×514`       | 29 KB → 29 KB    | Personagens — par 2 colunas (1/2)         | `integrada` |
| R-22 | `Hebitonbo.webp`                             | `personagem-hebitonbo.webp`                             | WebP preservado | `247×400`       | 23 KB → 23 KB    | Reserva de acervo                         | `validada`  |
| R-23 | `Kabuto.webp`                                | `personagem-kabuto.webp`                                | WebP preservado | `1228×1120`     | 92 KB → 92 KB    | Personagens — par 2 colunas (2/2)         | `integrada` |
| R-24 | `Kagetora.webp`                              | `personagem-kagetora.webp`                              | WebP preservado | `373×400`       | 32 KB → 32 KB    | Reserva de acervo                         | `validada`  |
| R-25 | `Shinobido_gamuran.webp`                     | `personagem-gamuran.webp`                               | WebP preservado | `298×400`       | 60 KB → 60 KB    | Reserva de acervo                         | `validada`  |
| R-26 | `Taraba_2.webp`                              | `personagem-taraba.webp`                                | WebP preservado | `250×250`       | 13 KB → 13 KB    | Reserva de acervo                         | `validada`  |
| R-27 | `Neko.webp`                                  | `personagem-onji-gato.webp`                             | WebP preservado | `267×400`       | 14 KB → 14 KB    | **Spoiler 2** (Onji era um gato)          | `integrada` |

### 3.3 Diário Linux — _Como personalizo meu GNOME_ (11 assets preparados; pendências sinalizadas)

Pasta definitiva: `public/images/linux-diary/gnome-personalizacao/`. Todos os 11 arquivos recebidos em `public/aqui/` foram inventariados, convertidos/preservados em WebP com nitidez preservada para textos pequenos de interface (redução de **2,94 MB → 585 KB**, `-80,5%`) e validados sem corte ou alteração de proporção.

#### Mapeamento dos 11 arquivos preparados

|    # | Arquivo original (`public/aqui/`)            | Arquivo definitivo (`public/images/linux-diary/gnome-personalizacao/`) | Ação            | Resolução   | Antes → Depois   | Marcação / Uso previsto no tutorial                                                   | Privacidade / Observações                                                                                                          | Status     |
| ---: | -------------------------------------------- | ---------------------------------------------------------------------- | --------------- | ----------- | ---------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| G-01 | `Captura de tela de 2026-11-22 13-06-04.png` | `flathub-extension-manager.webp`                                       | PNG → WebP      | `1920×1080` | 176 KB → 59 KB   | Seção 1 (_Instalando o Extension Manager_, complementar)                              | Sem texto sensível                                                                                                                 | `validada` |
| G-02 | `Captura de tela de 2026-11-22 13-00-00.png` | `extension-manager-instaladas.webp`                                    | PNG → WebP      | `1920×1080` | 130 KB → 57 KB   | `[CAPTURA 01]` (Extension Manager) e `[CAPTURA 08]` (10 extensões)                    | Sem dados sensíveis; lista exatamente as 10 extensões do texto                                                                     | `validada` |
| G-03 | `Captura de tela de 2026-11-22 13-00-47.png` | `dash-to-dock-posicao-tamanho.webp`                                    | PNG → WebP      | `751×849`   | 65 KB → 35 KB    | `[CAPTURA 02]` (parte 1/2 — Posição e tamanho)                                        | Sem dados sensíveis                                                                                                                | `validada` |
| G-04 | `Captura de tela de 2026-11-22 13-00-55.png` | `dash-to-dock-aparencia.webp`                                          | PNG → WebP      | `751×849`   | 60 KB → 30 KB    | `[CAPTURA 02]` (parte 2/2 — Aparência)                                                | Sem dados sensíveis                                                                                                                | `validada` |
| G-05 | `Captura de tela de 2026-11-22 13-01-31.png` | `dash-to-dock-resultado.webp`                                          | PNG → WebP      | `881×94`    | 94 KB → 17 KB    | `[CAPTURA 03]` (dock inferior configurada)                                            | Sem dados sensíveis                                                                                                                | `validada` |
| G-06 | `Captura de tela de 2026-11-22 12-59-42.png` | `desktop-arcmenu-aberto.webp`                                          | PNG → WebP      | `1920×1080` | 1,13 MB → 145 KB | `[CAPTURA 05]` (ArcMenu no canto superior esquerdo) / alternativa de capa             | Exibe `guilherme gomes` no topo do menu (nome já público no blog)                                                                  | `validada` |
| G-07 | `Captura de tela de 2026-11-22 13-04-02.png` | `arcmenu-detalhe.webp`                                                 | PNG → WebP      | `565×680`   | 208 KB → 23 KB   | `[CAPTURA 05]` (alternativa focada no menu ArcMenu)                                   | Exibe `guilherme gomes` no topo do menu                                                                                            | `validada` |
| G-08 | `Captura de tela de 2026-11-22 13-04-53.png` | `desktop-barra-superior-visivel.webp`                                  | PNG → WebP      | `1920×1080` | 947 KB → 141 KB  | `[CAPTURA 06]` (barra superior visível)                                               | Sem dados pessoais                                                                                                                 | `validada` |
| G-09 | `Captura de tela de 2026-11-22 13-03-42.png` | `sistema-sobre-fedora-gnome.webp`                                      | PNG → WebP      | `1920×1080` | 146 KB → 54 KB   | Referência para `/diario-linux/meu-ambiente/` (confirma Fedora 45 + GNOME Shell 51.1) | **Sinalização:** mostra hostname `Ggl-fedora` e hardware completo; publicar em _Meu ambiente_ apenas se autorizado                 | `validada` |
| G-10 | `gnome-puroOverlay.jpg`                      | `gnome-padrao-overview.webp`                                           | JPG → WebP      | `578×346`   | 14 KB → 11 KB    | `[CAPTURA 09 — Antes]` (referência de GNOME padrão — Overview)                        | **Atenção:** baixa resolução (`578×346`), idioma inglês e papel de parede diferente; confirmar procedência/licença ou substituir   | `validada` |
| G-11 | `gnomePuro.webp`                             | `gnome-padrao-desktop.webp`                                            | WebP preservado | `768×480`   | 13 KB → 13 KB    | `[CAPTURA 09 — Antes]` (referência de GNOME padrão — Desktop)                         | **Atenção:** baixa resolução (`768×480`), idioma italiano e papel de parede diferente; confirmar procedência/licença ou substituir | `validada` |

#### Marcações do tutorial ainda pendentes de captura

| Marcação no Markdown                         | O que falta                                                                                                                                 | Status     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `[IMAGEM DE CAPA]` e `[CAPTURA 09 — Depois]` | Captura limpa do desktop personalizado em `1920×1080` (sem janelas/menus abertos), caso não deseje reutilizar `desktop-arcmenu-aberto.webp` | `pendente` |
| `[CAPTURA 04]`                               | Captura do **Blur my Shell** (efeitos de transparência/desfoque ou preferências da extensão)                                                | `pendente` |
| `[CAPTURA 07]`                               | Captura do **Hide Top Bar** demonstrando a barra superior **oculta** (com aplicativo em tela cheia/maximizado)                              | `pendente` |

|    # | Arquivo original (`public/aqui/`)            | Arquivo definitivo (`public/images/linux-diary/gnome-personalizacao/`) | Ação            | Resolução   | Antes → Depois   | Marcação / Uso previsto no tutorial                                                   | Privacidade / Observações                                                                                                          | Status     |
| ---: | -------------------------------------------- | ---------------------------------------------------------------------- | --------------- | ----------- | ---------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| G-01 | `Captura de tela de 2026-11-22 13-06-04.png` | `flathub-extension-manager.webp`                                       | PNG → WebP      | `1920×1080` | 176 KB → 59 KB   | Seção 1 (_Instalando o Extension Manager_, complementar)                              | Sem texto sensível                                                                                                                 | `validada` |
| G-02 | `Captura de tela de 2026-11-22 13-00-00.png` | `extension-manager-instaladas.webp`                                    | PNG → WebP      | `1920×1080` | 130 KB → 57 KB   | `[CAPTURA 01]` (Extension Manager) e `[CAPTURA 08]` (10 extensões)                    | Sem dados sensíveis; lista exatamente as 10 extensões do texto                                                                     | `validada` |
| G-03 | `Captura de tela de 2026-11-22 13-00-47.png` | `dash-to-dock-posicao-tamanho.webp`                                    | PNG → WebP      | `751×849`   | 65 KB → 35 KB    | `[CAPTURA 02]` (parte 1/2 — Posição e tamanho)                                        | Sem dados sensíveis                                                                                                                | `validada` |
| G-04 | `Captura de tela de 2026-11-22 13-00-55.png` | `dash-to-dock-aparencia.webp`                                          | PNG → WebP      | `751×849`   | 60 KB → 30 KB    | `[CAPTURA 02]` (parte 2/2 — Aparência)                                                | Sem dados sensíveis                                                                                                                | `validada` |
| G-05 | `Captura de tela de 2026-11-22 13-01-31.png` | `dash-to-dock-resultado.webp`                                          | PNG → WebP      | `881×94`    | 94 KB → 17 KB    | `[CAPTURA 03]` (dock inferior configurada)                                            | Sem dados sensíveis                                                                                                                | `validada` |
| G-06 | `Captura de tela de 2026-11-22 12-59-42.png` | `desktop-arcmenu-aberto.webp`                                          | PNG → WebP      | `1920×1080` | 1,13 MB → 145 KB | `[CAPTURA 05]` (ArcMenu no canto superior esquerdo) / alternativa de capa             | Exibe `guilherme gomes` no topo do menu (nome já público no blog)                                                                  | `validada` |
| G-07 | `Captura de tela de 2026-11-22 13-04-02.png` | `arcmenu-detalhe.webp`                                                 | PNG → WebP      | `565×680`   | 208 KB → 23 KB   | `[CAPTURA 05]` (alternativa focada no menu ArcMenu)                                   | Exibe `guilherme gomes` no topo do menu                                                                                            | `validada` |
| G-08 | `Captura de tela de 2026-11-22 13-04-53.png` | `desktop-barra-superior-visivel.webp`                                  | PNG → WebP      | `1920×1080` | 947 KB → 141 KB  | `[CAPTURA 06]` (barra superior visível)                                               | Sem dados pessoais                                                                                                                 | `validada` |
| G-09 | `Captura de tela de 2026-11-22 13-03-42.png` | `sistema-sobre-fedora-gnome.webp`                                      | PNG → WebP      | `1920×1080` | 146 KB → 54 KB   | Referência para `/diario-linux/meu-ambiente/` (confirma Fedora 45 + GNOME Shell 51.1) | **Sinalização:** mostra hostname `Ggl-fedora` e hardware completo; publicar em _Meu ambiente_ apenas se autorizado                 | `validada` |
| G-10 | `gnome-puroOverlay.jpg`                      | `gnome-padrao-overview.webp`                                           | JPG → WebP      | `578×346`   | 14 KB → 11 KB    | `[CAPTURA 09 — Antes]` (referência de GNOME padrão — Overview)                        | **Atenção:** baixa resolução (`578×346`), idioma inglês e papel de parede diferente; confirmar procedência/licença ou substituir   | `validada` |
| G-11 | `gnomePuro.webp`                             | `gnome-padrao-desktop.webp`                                            | WebP preservado | `768×480`   | 13 KB → 13 KB    | `[CAPTURA 09 — Antes]` (referência de GNOME padrão — Desktop)                         | **Atenção:** baixa resolução (`768×480`), idioma italiano e papel de parede diferente; confirmar procedência/licença ou substituir | `validada` |

#### Marcações do tutorial ainda pendentes de captura

| Marcação no Markdown                         | O que falta                                                                                                                                 | Status     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `[IMAGEM DE CAPA]` e `[CAPTURA 09 — Depois]` | Captura limpa do desktop personalizado em `1920×1080` (sem janelas/menus abertos), caso não deseje reutilizar `desktop-arcmenu-aberto.webp` | `pendente` |
| `[CAPTURA 04]`                               | Captura do **Blur my Shell** (efeitos de transparência/desfoque ou preferências da extensão)                                                | `pendente` |
| `[CAPTURA 07]`                               | Captura do **Hide Top Bar** demonstrando a barra superior **oculta** (com aplicativo em tela cheia/maximizado)                              | `pendente` |

### 3.4 Recomendações (2 imagens)

|    # | Seção         | Card              | Posição prevista         | Tipo                                             | Arquivo sugerido                                     | Proporção recomendada | Legenda / Alt previsto                                   | Status     |
| ---: | ------------- | ----------------- | ------------------------ | ------------------------------------------------ | ---------------------------------------------------- | --------------------- | -------------------------------------------------------- | ---------- |
| C-01 | Recomendações | KZ EDX Pro        | Imagem principal do card | Foto real do produto (modelo exato KZ EDX Pro)   | `public/images/recomendacoes/kz-edx-pro.webp`        | 16:10 ou 4:3          | Fotografia do fone intra-auricular KZ EDX Pro            | `pendente` |
| C-02 | Recomendações | Editora Principis | Imagem principal do card | Foto própria dos livros/boxes físicos da editora | `public/images/recomendacoes/editora-principis.webp` | 16:10 ou 4:3          | Livros e boxes físicos publicados pela Editora Principis | `pendente` |

---

## 4. Resumo quantitativo de pendências

- **Header 2.0:** 8 imagens temáticas (`pendente`).
- **Resenhas (Shinobido):** 27 imagens preparadas em `public/images/reviews/shinobido/`, sendo **14 integradas** no rascunho (`draft: true`) e 13 mantidas como reserva (`validada`).
- **Diário Linux (Personalização GNOME):** 11 assets preparados em `public/images/linux-diary/gnome-personalizacao/` (`validada`); pendências sinalizadas para Blur my Shell (`[CAPTURA 04]`), Hide Top Bar oculta (`[CAPTURA 07]`) e eventual desktop limpo (`[IMAGEM DE CAPA]` / `[CAPTURA 09]`).
- **Recomendações:** 2 fotografias reais (`pendente`).
