# Inventário e Diretrizes de Imagens — Expansão Editorial (EXP-01)

> **Status:** Inventário inicial consolidado (`EXP-01`) · **Assets pendentes de envio/aprovação pelo autor.**
> **Regra fundamental:** Nenhuma imagem fictícia, gerada automaticamente ou externa não autorizada será usada. Nenhuma página será publicada com placeholders visíveis.

---

## 1. Organização de pastas recomendada

Todas as imagens locais definitivas da expansão seguem o padrão já adotado em `public/images/`, compatível com `withBase()` na Vercel e no GitHub Pages:

```text
public/images/
├── header/                              # 2 assets novos (Diário Linux e Recomendações); demais 6 reutilizados de public/images/home/
│   ├── diario-linux.webp
│   └── recomendacoes.webp
├── reviews/
│   └── shinobido/                       # 27 assets preparados (capa, furtividade, facções, personagens, spoilers)
├── linux-diary/
│   └── gnome-personalizacao/            # 11 capturas mantidas (8 integradas em draft + reservas; captura de sistema removida por privacidade)
└── recommendations/                     # 2 imagens integradas em draft (KZ EDX Pro e Editora Principis)
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

### 3.1 Header 2.0 — Mini-cards dos dropdowns (8 imagens integradas na EXP-06B)

Conforme auditoria da **EXP-06B**, 6 destinos reutilizam diretamente assets horizontais já existentes em `public/images/home/` (sem duplicação de arquivo, via `withBase()`) e os 2 destinos inéditos (`Diário Linux` e `Recomendações`) receberam assets próprios convertidos para WebP em `public/images/header/`.

|    # | Seção      | Componente / Destino      | Posição prevista | Origem / Asset definitivo                  | Resolução   | Observação                                            | Status      |
| ---: | ---------- | ------------------------- | ---------------- | ------------------------------------------ | ----------- | ----------------------------------------------------- | ----------- |
| H-01 | Header 2.0 | Cultura → Jogos           | Card 1 (2×2)     | `public/images/home/jogos-card.webp`       | `1400×875`  | Mesma imagem do card Jogos na Home (sem duplicação)   | `integrada` |
| H-02 | Header 2.0 | Cultura → Filmes          | Card 2 (2×2)     | `public/images/home/filmes-card.webp`      | `1200×1600` | Mesma imagem do card Filmes na Home (sem duplicação)  | `integrada` |
| H-03 | Header 2.0 | Cultura → Música          | Card 3 (2×2)     | `public/images/home/musica-card.webp`      | `910×604`   | Mesma imagem do card Música na Home (sem duplicação)  | `integrada` |
| H-04 | Header 2.0 | Cultura → Livros          | Card 4 (2×2)     | `public/images/home/livros-card.webp`      | `768×1365`  | Mesma imagem do card Livros na Home (sem duplicação)  | `integrada` |
| H-05 | Header 2.0 | Tecnologia → Diário Linux | Card 1 (2×1)     | `public/images/header/diario-linux.webp`   | `1024×576`  | Novo asset enviado na EXP-06B (27 KB → 14 KB WebP)    | `integrada` |
| H-06 | Header 2.0 | Tecnologia → Open Source  | Card 2 (2×1)     | `public/images/home/open-source-card.webp` | `1170×1439` | Mesma imagem do card Open Source na Home (sem cópia)  | `integrada` |
| H-07 | Header 2.0 | Acervo → Recomendações    | Card 1 (2×1)     | `public/images/header/recomendacoes.webp`  | `1024×682`  | Novo asset enviado na EXP-06B (149 KB → 80 KB WebP)   | `integrada` |
| H-08 | Header 2.0 | Acervo → Galeria          | Card 2 (2×1)     | `public/images/home/galeria-card.webp`     | `1200×672`  | Mesma imagem do card Galeria na Home (sem duplicação) | `integrada` |

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

### 3.3 Diário Linux — _Como personalizo meu GNOME_ (12 assets preparados; 8 integrados em `draft`)

Pasta definitiva: `public/images/linux-diary/gnome-personalizacao/`. Todos os 12 arquivos recebidos foram inventariados, convertidos/preservados em WebP com nitidez preservada para textos pequenos de interface (redução de **3,00 MB → 647 KB**, `-78,9%`) e validados sem corte ou alteração de proporção. Na **EXP-04B.2**, **8 arquivos** foram integrados ao rascunho `src/content/linux-diary/como-personalizo-meu-gnome.md` (reutilizando `desktop-personalizado-limpo.webp` na capa e na seção _Antes e depois_, e `extension-manager-instaladas.webp` nas seções 1 e 5); 4 arquivos permanecem fora do tutorial (`arcmenu-detalhe.webp` como reserva, `sistema-sobre-fedora-gnome.webp` reservado para `/diario-linux/meu-ambiente/` mediante autorização, e `gnome-padrao-overview.webp` / `gnome-padrao-desktop.webp` aguardando confirmação de procedência/licença).

#### Mapeamento dos 12 arquivos preparados

|    # | Arquivo original                             | Arquivo definitivo (`public/images/linux-diary/gnome-personalizacao/`) | Ação               | Resolução   | Antes → Depois   | Marcação / Uso no tutorial                                                      | Privacidade / Observações                                                                                                          | Status      |
| ---: | -------------------------------------------- | ---------------------------------------------------------------------- | ------------------ | ----------- | ---------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| G-01 | `Captura de tela de 2026-11-22 13-06-04.png` | `flathub-extension-manager.webp`                                       | PNG → WebP         | `1920×1080` | 176 KB → 59 KB   | Seção 1 (_Instalando o Extension Manager_)                                      | Sem texto sensível                                                                                                                 | `integrada` |
| G-02 | `Captura de tela de 2026-11-22 13-00-00.png` | `extension-manager-instaladas.webp`                                    | PNG → WebP         | `1920×1080` | 130 KB → 57 KB   | `[CAPTURA 01]` (Extension Manager) e `[CAPTURA 08]` (10 extensões, reutilizada) | Sem dados sensíveis; lista exatamente as 10 extensões do texto                                                                     | `integrada` |
| G-03 | `Captura de tela de 2026-11-22 13-00-47.png` | `dash-to-dock-posicao-tamanho.webp`                                    | PNG → WebP         | `751×849`   | 65 KB → 35 KB    | `[CAPTURA 02]` (par 1/2 — Posição e tamanho)                                    | Sem dados sensíveis                                                                                                                | `integrada` |
| G-04 | `Captura de tela de 2026-11-22 13-00-55.png` | `dash-to-dock-aparencia.webp`                                          | PNG → WebP         | `751×849`   | 60 KB → 30 KB    | `[CAPTURA 02]` (par 2/2 — Aparência)                                            | Sem dados sensíveis                                                                                                                | `integrada` |
| G-05 | `Captura de tela de 2026-11-22 13-01-31.png` | `dash-to-dock-resultado.webp`                                          | PNG → WebP         | `881×94`    | 94 KB → 17 KB    | `[CAPTURA 03]` (dock inferior configurada)                                      | Sem dados sensíveis                                                                                                                | `integrada` |
| G-06 | `Captura de tela de 2026-11-22 12-59-42.png` | `desktop-arcmenu-aberto.webp`                                          | PNG → WebP         | `1920×1080` | 1,13 MB → 145 KB | `[CAPTURA 05]` (ArcMenu no canto superior esquerdo)                             | Exibe `guilherme gomes` no topo do menu (nome já público no blog)                                                                  | `integrada` |
| G-07 | `Captura de tela de 2026-11-22 13-04-02.png` | `arcmenu-detalhe.webp`                                                 | PNG → WebP         | `565×680`   | 208 KB → 23 KB   | Reserva de acervo (alternativa focada no menu ArcMenu)                          | Exibe `guilherme gomes` no topo do menu                                                                                            | `validada`  |
| G-08 | `Captura de tela de 2026-11-22 13-04-53.png` | `desktop-barra-superior-visivel.webp`                                  | PNG → WebP         | `1920×1080` | 947 KB → 141 KB  | `[CAPTURA 06]` (barra superior visível)                                         | Sem dados pessoais                                                                                                                 | `integrada` |
| G-09 | `Captura de tela de 2026-11-22 13-03-42.png` | `sistema-sobre-fedora-gnome.webp`                                      | Removida (EXP-07B) | `1920×1080` | —                | Não utilizada (removida de `public/` por privacidade)                           | **Removida em EXP-07B:** exibia hostname `Ggl-fedora` e hardware completo; excluída de `public/` e `dist/`                         | `removida`  |
| G-10 | `gnome-puroOverlay.jpg`                      | `gnome-padrao-overview.webp`                                           | JPG → WebP         | `578×346`   | 14 KB → 11 KB    | Reserva para `[CAPTURA 09 — Antes]` (não publicada ainda)                       | **Atenção:** baixa resolução (`578×346`), idioma inglês e papel de parede diferente; confirmar procedência/licença ou substituir   | `validada`  |
| G-11 | `gnomePuro.webp`                             | `gnome-padrao-desktop.webp`                                            | WebP preservado    | `768×480`   | 13 KB → 13 KB    | Reserva para `[CAPTURA 09 — Antes]` (não publicada ainda)                       | **Atenção:** baixa resolução (`768×480`), idioma italiano e papel de parede diferente; confirmar procedência/licença ou substituir | `validada`  |
| G-12 | Captura limpa enviada na EXP-04B.2           | `desktop-personalizado-limpo.webp`                                     | JPG → WebP         | `1024×576`  | 64 KB → 62 KB    | `[IMAGEM DE CAPA]` e `[CAPTURA 09 — Depois]` (mesmo arquivo reutilizado)        | Sem dados pessoais, notificações ou informações sensíveis                                                                          | `integrada` |

#### Marcações do tutorial ainda pendentes de captura

| Marcação no Markdown   | O que falta                                                                                                                                      | Status     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `[CAPTURA 04]`         | Captura do **Blur my Shell** (efeitos de transparência/desfoque ou preferências da extensão)                                                     | `pendente` |
| `[CAPTURA 07]`         | Captura do **Hide Top Bar** demonstrando a barra superior **oculta** (com aplicativo em tela cheia/maximizado)                                   | `pendente` |
| `[CAPTURA 09 — Antes]` | Captura do **GNOME padrão** confirmada quanto à procedência/licença (ou nova captura própria) para parear com `desktop-personalizado-limpo.webp` | `pendente` |

### 3.4 Recomendações (2 imagens integradas em `draft`)

Pasta definitiva: `public/images/recommendations/`. As 2 imagens enviadas pelo autor na **EXP-05B** foram convertidas para WebP preservando resolução (`1024×1024`), proporção original (1:1) e legibilidade (redução total de **203 KB → 87 KB**, `-57,4%`), e integradas aos rascunhos `kz-edx-pro.json` e `editora-principis.json`.

|    # | Seção         | Card              | Posição prevista         | Ação       | Resolução   | Antes → Depois | Arquivo definitivo (`public/images/recommendations/`) | Observação                                                               | Status      |
| ---: | ------------- | ----------------- | ------------------------ | ---------- | ----------- | -------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ | ----------- |
| C-01 | Recomendações | KZ EDX Pro        | Imagem principal do card | JPG → WebP | `1024×1024` | 127 KB → 77 KB | `kz-edx-pro.webp`                                     | Produto exato (KZ EDX Pro ciano translúcido com cabo e microfone)        | `integrada` |
| C-02 | Recomendações | Editora Principis | Imagem principal do card | PNG → WebP | `1024×1024` | 77 KB → 9 KB   | `editora-principis.webp`                              | Identidade oficial da editora (pode ser trocada por foto própria depois) | `integrada` |

---

## 4. Resumo quantitativo de pendências

- **Header 2.0:** 8 imagens **integradas** (6 reutilizadas de `public/images/home/` + 2 novas em `public/images/header/`).
- **Resenhas (Shinobido):** 27 imagens preparadas em `public/images/reviews/shinobido/`, sendo **14 integradas** no rascunho (`draft: true`) e 13 mantidas como reserva (`validada`).
- **Diário Linux (Personalização GNOME):** 11 assets ativos em `public/images/linux-diary/gnome-personalizacao/`, sendo **8 integradas** no rascunho (`draft: true`), 3 em reserva (`arcmenu-detalhe.webp`, `gnome-padrao-overview.webp`, `gnome-padrao-desktop.webp`) e 1 removida por privacidade (`sistema-sobre-fedora-gnome.webp`); pendências sinalizadas para Blur my Shell (`[CAPTURA 04]`), Hide Top Bar oculta (`[CAPTURA 07]`) e GNOME padrão (`[CAPTURA 09 — Antes]`).
- **Recomendações:** 2 imagens preparadas e **integradas** em `public/images/recommendations/` nos rascunhos (`draft: true`).
