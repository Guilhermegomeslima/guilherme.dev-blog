# Design System — blog pessoal

> **Status:** direção visual confirmada; tokens e componentes propostos · **Versão:** 0.1 · **Atualizado:** 2026-11-07

## 1. Identidade

**[CONFIRMADO]** A identidade é **cyberpunk cinematográfica**, inspirada na atmosfera de *Blade Runner*, aplicada a **todas as páginas**. O tema será **escuro apenas**, inicialmente. O objetivo não é copiar a franquia, e sim combinar tecnologia, fotografia noturna, hierarquia editorial e usabilidade.

**[CONFIRMADO] Referência preferida:** primeiro protótipo do Figma Make:  
https://www.figma.com/make/rcvx0jQ0gfulTn1owpG3bd/Blog-Pessoal-Cyberpunk?t=P4xgPHVx9xefWPZk-1

Aspectos observados no protótipo escolhido: foto urbana noturna no hero; títulos grandes, com parte em contorno; ciano em textos e detalhes; fundo extremamente escuro; linhas delimitadoras finas; cards com fotografias, grades assimétricas e navegação discreta.

## 2. Princípios de UI

1. **Conteúdo antes do efeito:** o neon realça; não concorre com a leitura.
2. **Atmosfera consistente:** a mesma identidade em Home, Sobre, artigos, Linux, jogos etc.
3. **Hierarquia editorial:** títulos expressivos, textos legíveis, espaços negativos.
4. **Responsividade real:** composições adaptadas a viewport pequena, não apenas reduzidas.
5. **Acessibilidade:** foco visível, contraste, links reconhecíveis e movimento opcional.
6. **Modularidade:** tokens e componentes padronizados.

## 3. Paleta provisória

Os valores abaixo são **[PROPOSTO]**, ponto de partida técnico, **não extraídos do Figma nem aprovados como cores finais**.

| Token | Hex inicial | Uso sugerido |
|---|---|---|
| `--color-bg` | `#060910` | Fundo principal |
| `--color-surface` | `#0D1320` | Cards e superfícies |
| `--color-surface-raised` | `#141D2B` | Elementos elevados |
| `--color-text` | `#EEF3F7` | Texto principal |
| `--color-text-muted` | `#A2ADBB` | Texto secundário |
| `--color-border` | `#273546` | Bordas e divisores |
| `--color-accent` | `#61EAF1` | Ciano, foco e ação principal |
| `--color-accent-alt` | `#C96AD9` | Magenta pontual |
| `--color-warm` | `#DC8C61` | Detalhes quentes opcionais |

**[PROPOSTO]** Regra prática: cerca de 80–90% de áreas neutras, 10–20% de acentos e imagens — orientação visual, não fórmula de implementação. Validar contraste do texto com as cores reais, inclusive sobre fotos.

## 4. Tipografia

**[CONFIRMADO]** Tipografia contemporânea, geométrica, de forte presença nos títulos e confortável para leitura em páginas longas.

**[PROPOSTO]** Três papéis, sem fixar famílias neste momento:

- **Display:** títulos de seção e hero; peso alto, letras grandes e uma segunda linha contornada quando fizer sentido.
- **Texto:** parágrafos, artigos e descrições; fonte de alta legibilidade, altura de linha generosa.
- **Mono:** etiquetas, índices, categorias e metadados; uso moderado.

**[PENDENTE]** Escolher famílias e licenças; avaliar desempenho (arquivos locais, subconjuntos e poucos pesos). Não usar `text-stroke` em texto essencial como única forma de contraste.

## 5. Layout, grade e espaçamento

**[PROPOSTO]**

- Container central com largura máxima consistente (valor ajustado ao design real).
- Grade fluida; 1 coluna no mobile e composições de 2 ou mais colunas em telas amplas, onde útil.
- Seções com respiro vertical amplo no desktop e proporcionais no celular.
- Cards de alturas diferentes apenas quando o conteúdo e a leitura justificarem.
- Separadores finos, pequenos identificadores em mono e acentos discretos.

**[PENDENTE]** Breakpoints, largura de container, escala de espaços, radius e efeitos finais devem ser validados no protótipo responsivo. Evitar inventar medidas rígidas antes dessa revisão.

## 6. Componentes visuais principais

### 6.1 Cabeçalho / navegação

**[CONFIRMADO]** Nome ou marca pessoal, links entre áreas, menu recolhível e fácil acesso.

**[PROPOSTO]** Cabeçalho discreto e com borda inferior; estado ativo em ciano. Em telas pequenas, botão de menu com rótulo acessível, estado expandido e fechamento por teclado. Não exibir dezenas de links comprimidos numa única linha.

### 6.2 Hero da Home

**[PROPOSTO]** Fotografia panorâmica noturna com camada escura para contraste, título de alto impacto em múltiplas linhas, breve apresentação e, se necessário, um link de ação discreto. A fotografia é decorativa se não transmitir informação específica; nesse caso, usar `alt=""` quando renderizada como `<img>`.

### 6.3 Seção Sobre resumida

**[PROPOSTO]** Título editorial, descrição pessoal real e área de conhecimentos técnicos; não criar uma lista de habilidades que não foi fornecida/confirmada. Link para página `/sobre/`.

### 6.4 Cards de categoria

**[CONFIRMADO]** Cards conduzem às seções do blog.

**[PROPOSTO]** Variantes: destaque (projetos), padrão (Linux, filmes, jogos) e compacta (categorias restantes). Estrutura semântica consistente: imagem, categoria opcional, título, descrição e link. O card inteiro pode ser clicável **sem criar links aninhados**.

### 6.5 Rodapé

**[CONFIRMADO]** Links sociais e autoria.

**[PROPOSTO]** Fundo escuro contínuo, divisores finos, links discretos com foco/hover claros. Não colocar dados fictícios ou links temporários como definitivos.

### 6.6 Componentes para páginas de conteúdo

**[PROPOSTO]** `ArticleHeader`, `ArticleBody`, `Breadcrumbs`, `TagList`, `RatingBreakdown`, `FilterBar`, `GalleryGrid` e estados vazios. Só criá-los quando uma seção real exigir.

## 7. Imagens e atmosfera

**[CONFIRMADO]** Imagens externas por URL na fase inicial. Fotografia urbana noturna, luzes em ciano/magenta, reflexos e cenas atmosféricas são referências adequadas para a Home.

**[PROPOSTO]** Aplicar overlays/gradientes para manter contraste, definir proporção consistente, evitar fundos carregados atrás de parágrafos e preservar crédito/licença. Cada seção pode ter imagens do próprio assunto (jogos, livros, Linux) mantendo moldura, tipografia e cores do site.

**[PENDENTE]** Selecionar imagens reais, com permissão de uso, e política para URLs quebradas. Não tratar Google Imagens como CDN.

## 8. Interações e movimento

**[PROPOSTO]** Transições suaves em hover/foco, discreta elevação ou iluminação de borda, sem parallax pesado por padrão. Evitar piscadas, glows intensos e animações contínuas. Suportar `prefers-reduced-motion: reduce`.

## 9. Acessibilidade e legibilidade

**[PROPOSTO] Checklist:**

- [ ] Contraste suficiente em corpo, botões e links.
- [ ] Foco visível em todos os elementos interativos.
- [ ] Fonte e espaçamento confortáveis para leitura longa.
- [ ] Tamanho de toque adequado no celular.
- [ ] Fotos de fundo nunca escondem títulos ou CTAs.
- [ ] Estrutura semântica, títulos hierárquicos e navegação por teclado.
- [ ] Estados não dependem exclusivamente da cor.
- [ ] O layout permanece compreensível com imagens indisponíveis.

## 10. Coerência entre páginas

A Home pode ser mais cinematográfica e usar grids assimétricos; Artigos, Sobre e Linux podem ter colunas de leitura; Jogos pode ter filtros e rankings. **Isso não altera o sistema visual:** fundo, tokens, tipografia, padrões de navegação, detalhes e comportamento permanecem compartilhados.

## 11. Aprovações futuras

- [PENDENTE] Validar paleta em telas reais.
- [PENDENTE] Escolher fontes.
- [PENDENTE] Definir menu em mobile.
- [PENDENTE] Refinar variantes de cards e proporções.
- [PENDENTE] Revisar screenshots mobile do protótipo.
- [PENDENTE] Definir imagens e créditos.

Nenhum valor visual proposto neste arquivo deve ser tratado como especificação imutável.
