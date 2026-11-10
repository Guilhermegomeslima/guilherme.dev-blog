# CONTENT_SECTIONS.md — Planejamento das seções de conteúdo

> **Projeto:** `guilherme.dev-blog`  
> **Status:** planejamento aprovado em linhas gerais; detalhes marcados como propostas  
> **Versão:** 1.0  
> **Data:** 2026-11-10  
> **Escopo:** Fase 4 — `CNT-01` a `CNT-11`

## 1. Objetivo e hierarquia

Especificar a estrutura visual, a experiência de navegação e as regras dos conteúdos da Fase 4. Este arquivo **complementa**, sem substituir, `REQUIREMENTS.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CONTENT_GUIDE.md`, `GIT_WORKFLOW.md`, `ROADMAP.md` e `AGENTS.md`.

- **[CONFIRMADO]** O blog é um site multipáginas em Astro, com TypeScript e Tailwind CSS 4, e conteúdo inicialmente gerenciado em arquivos locais.
- **[CONFIRMADO]** Identidade visual global escura, cyberpunk cinematográfica, baseada na referência de Figma Make escolhida para a Home.
- **[CONFIRMADO]** As seções devem ser implementadas progressivamente, conforme o roadmap; evitar implementação simultânea de toda a Fase 4.
- **[CONFIRMADO]** Primeiro desenvolver e validar com conteúdos demonstrativos; depois substituí-los por conteúdo real.
- **[PROPOSTO]** Centralizar a apresentação dos avisos e dos metadados de demonstração em componentes reutilizáveis, sem acoplamento entre schemas e interface.

**Regra de precedência:** seguir a orientação explícita mais recente do autor. Ao detectar divergência técnica relevante entre documentos ou código existente, relatar o conflito antes da implementação afetada. Não reestruturar o projeto apenas para se ajustar a exemplos deste arquivo.

## 2. Padrão global de demonstração (_mock data_)

### 2.1 Identificação

Enquanto uma seção estiver em implementação, utilizar registros claramente fictícios: `Artigo Teste 01`, `Jogo Teste 01`, `Filme Teste 01`, `Projeto Teste 01`, `Livro Teste 01`, etc. Em textos narrativos, utilizar conteúdo de demonstração **explicitamente apresentado como teste**, não fatos biográficos ou experiências inventadas.

O campo conceitual `isDemo: true` identifica dados temporários quando aplicável. Adaptar o campo ao schema/collection realmente usado no projeto, sem impor um formato único para todas as coleções. Em conteúdo Markdown, um frontmatter equivalente pode ser usado.

- Exibir um aviso visível na listagem enquanto houver itens demonstrativos exibidos: **“Conteúdo de demonstração: os itens e avaliações desta seção são fictícios e utilizados para testar a interface.”**
- Exibir também aviso nas páginas individuais de itens demonstrativos: **“Registro de teste. As informações e notas desta página são fictícias.”**
- Para seções narrativas, exibir: **“Esta seção está em desenvolvimento. Os textos abaixo são provisórios e servem apenas para demonstrar a estrutura da página.”**
- Os avisos devem ser texto HTML acessível, não apenas imagens ou efeitos visuais, e usar o design global do site.
- Não apresentar fictícios como experiências, gostos, recomendações, análises ou opiniões reais do autor.
- Não criar links externos falsos que pareçam válidos. Se ainda não houver destino, omitir/desabilitar a ação de forma acessível ou direcionar apenas para uma rota de demonstração realmente existente.

### 2.2 Dados e qualidade

- Os registros devem ter variações suficientes para testar estados: títulos curtos/longos, com/sem imagem (se o campo for opcional), diferentes descrições, categorias e notas nos limites 0 e 100.
- Priorizar dados versionados em arquivos Markdown/JSON e validados pelos schemas realmente necessários.
- Evitar valores finais de nota digitados manualmente; calcular a partir dos critérios.
- Manter uma forma simples de remover/substituir todos os registros demonstrativos sem refatorar componentes.
- Não gerar um volume artificial de dados que dificulte revisão do Git. Dois ou três registros por tipo costumam bastar, salvo necessidade de testar paginação, filtros ou grids.
- Ao publicar uma página demonstrativa, evitar sua indexação (por exemplo, `noindex` quando aplicável) e excluir entradas demonstrativas do sitemap quando tecnicamente possível. Remover essas restrições quando o conteúdo real estiver pronto. Não aplicar `noindex` global que oculte páginas reais do blog por acidente.
- Não usar conteúdo fictício para alimentar metadados públicos que possam ser confundidos com informação real do autor.

### 2.3 Imagens temporárias — Lorem Picsum

**[CONFIRMADO]** Durante o desenvolvimento, usar placeholders de imagem externos do [Lorem Picsum](https://picsum.photos/) quando uma imagem ajudar a testar o layout.

Exemplos de URLs com imagem estável por `seed`:

```text
https://picsum.photos/seed/jogo-teste-01/600/800
https://picsum.photos/seed/projeto-teste-01/1200/675
https://picsum.photos/seed/album-teste-01/600/600
https://picsum.photos/seed/galeria-teste-01/1200/800
```

- Preferir `seed` estável para evitar mudanças aleatórias entre recarregamentos e screenshots de revisão.
- Registrar tamanho/proporção adequados ao componente; tratar ausência, falha de carregamento, `loading="lazy"` e texto alternativo apropriado (ex.: “Imagem ilustrativa temporária do Jogo Teste 01”).
- Não presumir que a fotografia gerada retrata o jogo, filme, álbum ou livro; ela é um **placeholder visual**.
- Não depender dessas URLs como ativos permanentes. O serviço externo pode mudar ou ficar indisponível.
- Quando substituídas por imagens reais, verificar licença, origem, direitos relevantes e créditos; buscar no Google Imagens não concede direito de reutilização.
- Para a galeria pública definitiva, **não** apresentar fotos aleatórias do Picsum como se fossem obras autorais ou wallpapers disponibilizados para download. Usá-las apenas em álbuns identificados como demonstração.
- O Picsum utiliza fotografias de terceiros e oferece metadados de autores; quando necessário, consultar `https://picsum.photos/id/{id}/info` ou os metadados do serviço, em vez de inventar crédito. Conferir termos/licenças da fonte antes de uso definitivo.

## 3. Identidade e padrões de interface

- Tema escuro global, neon ciano/magenta usado com moderação, composições editoriais e tipografia legível.
- Header, navegação, rodapé, tokens e componentes existentes devem ser reutilizados.
- Responsividade para desktop, tablet e celular; navegação por teclado, foco visível, sem informação transmitida apenas por cor.
- Interfaces de leitura precisam priorizar conforto, contraste e espaçamento sobre animações.
- Efeitos de glitch/scanline apenas quando agregarem valor e respeitando `prefers-reduced-motion`.
- Criar componentes reaproveitáveis **quando houver reutilização concreta**, não de forma antecipada.
- Cards clicáveis precisam ser links semânticos para rotas reais. Não criar páginas vazias sem propósito.

## 4. CNT-01 — Modelagem de conteúdo e Content Collections

**Natureza:** tarefa arquitetural; não requer página ou design próprio.

**[CONFIRMADO]** Conteúdos editoriais em Markdown; registros estruturados em JSON ou outro formato local compatível com Astro Content Collections, conforme o tipo e o código existente.

**[PROPOSTO]** A CNT-01 estabelece uma organização geral e implementa de fato **somente** os schemas necessários à próxima seção (Artigos). Os restantes serão detalhados nas respectivas tarefas.

Campos comuns sugeridos (quando fizerem sentido): `title`, `description`, `slug`, `publishedAt`/ano, `category`/tags, `image`, `isDemo`. Evitar campos universais obrigatórios que não façam sentido para todos os conteúdos.

**Aceitação:** schemas necessários validados, exemplos demonstrativos com erros detectáveis, conteúdo separado do componente visual, compatibilidade com build estático e documentação do fluxo de adição de registros.

## 5. CNT-02 — Artigos

**[CONFIRMADO]** Página de artigos com **artigo em destaque** seguido de **lista dos mais recentes**. Cada artigo abre uma página própria de leitura.

**Visual:** revista digital futurista/editorial, cabeçalho com título da seção, card destacado e cards menores para os recentes. Na página individual, priorizar leitura e tipografia clara.

**Dados:** título, resumo, data, categoria/tags, corpo Markdown, slug, destaque e marcador de demonstração.

**[PROPOSTO]** `featured: true` para escolha manual do destaque, com regra consistente caso nenhum artigo esteja destacado. Ordenar recentes por data decrescente; filtros de categorias só quando houver volume que justifique.

**Demo:** `Artigo Teste 01`, conteúdo claramente fictício, aviso na listagem e na página individual.

**Aceitação:** destaque e recentes corretos, link para artigo real/demonstrativo, markdown renderizado, funcionamento mobile, nenhum conteúdo fictício tratado como verdadeiro.

## 6. CNT-03 — Linux

**[CONFIRMADO]** Uma única página longa com narrativa e **timeline neon** de **todos os sistemas operacionais usados** (inclusive não Linux).

Ordem narrativa desejada:

1. Introdução: o que é Linux no desktop;
2. Motivos da migração;
3. Primeiras impressões;
4. Ponto de virada definitivo;
5. Experiência atual com Fedora;
6. Linha do tempo dos sistemas operacionais utilizados.

**Visual:** capítulos editoriais com espaços para screenshots; timeline vertical neon com nós e cards, podendo alternar lados no desktop e usar uma coluna no celular.

**Dados:** capítulos com título/corpo e entradas de timeline com nome do sistema, período (se conhecido), descrição, imagem opcional e ordem cronológica.

**Demo:** títulos e textos explícitos de teste, sistemas fictícios ou marcados como exemplos, sem inventar datas ou experiências pessoais. O Fedora pode aparecer como referência conhecida, mas a narrativa concreta deve ser fornecida pelo autor.

**Aceitação:** narrativa fluida, timeline responsiva e acessível, conteúdo editável sem alterar layout e identificação clara de exemplos.

## 7. CNT-04 — Projetos

**[CONFIRMADO]** Catálogo simples de cards contendo imagem, título, descrição e link(s) para o projeto.

**[PROPOSTO]** Tecnologias utilizadas como metadado opcional; grid de 2–3 colunas em desktop e uma coluna no mobile; borda/luz ciano discreta no hover/foco.

**Demo:** `Projeto Teste 01` com imagem Picsum; não inventar GitHub ou demo externos.

**Aceitação:** cards responsivos, links reais quando fornecidos, textos e imagens substituíveis por dados locais.

## 8. CNT-05 — Jogos

**[CONFIRMADO]** Catálogo de cards clicáveis com informações resumidas e imagens na maioria dos jogos. Cada jogo leva a **página individual** com dados completos, imagens e avaliação.

**Dados sugeridos:** título, slug, ano, gênero, desenvolvedora (opcional), imagens/capa, descrição, opinião (quando real), `isDemo`, e cinco critérios obrigatórios entre 0 e 100:

- Mecânica
- Enredo
- Estética
- Retenção
- Feeling

**Visual:** capas em cards, título e média; página individual com hero/galeria e painel de notas.

**Demo:** `Jogo Teste 01` a `03`, imagens Picsum como placeholders, notas fictícias marcadas; nenhuma avaliação atribuída ao autor como real.

**Aceitação:** catálogo, navegação individual, responsividade, validação dos cinco critérios e conteúdo de teste identificado.

## 9. CNT-06 — Média e testes de jogos

**[CONFIRMADO]** Nota final = média aritmética simples de Mecânica, Enredo, Estética, Retenção e Feeling, sem pesos. Escala de cada critério: 0–100.

**[PROPOSTO]** Função TypeScript pura, centralizada e testada; média calculada, não mantida manualmente nos dados. Exibir as cinco notas em barras ou linhas legíveis, com resultado final em destaque.

**Testes mínimos:** entradas válidas, todos 0, todos 100, valores distintos, rejeição de notas fora do intervalo, ausência de critério e comportamento para valores não numéricos. Regra definitiva de arredondamento/exibição: **pendente**; não confundir exibição com cálculo.

## 10. CNT-07 — Filmes

**[CONFIRMADO]** Mesma lógica geral de Jogos: catálogo de cards clicáveis e **páginas individuais**, mas **sem imagens inicialmente**.

**Visual:** arquivo cinematográfico com cards tipográficos bem resolvidos, sem espaços vazios simulando pôsteres ausentes. Layout preparado para imagens futuras opcionais.

**Dados:** título, diretor, ano de lançamento, slug, descrição/opinião e seis critérios de 0 a 100:

- Direção
- Roteiro
- Audiovisual
- Atuação
- Ritmo
- Feeling

Diretor e ano são **metadados**, nunca fatores da nota.

**Demo:** `Filme Teste 01` a `03`, títulos e notas fictícios explicitamente identificados.

**Aceitação:** listagem e rotas individuais, legibilidade sem imagens, dados validados e avisos.

## 11. CNT-08 — Média e testes de filmes

**[CONFIRMADO]** Nota final = média aritmética simples dos **seis** critérios de filmes, sem pesos.

**[PROPOSTO]** Reutilizar utilitário genérico de média se isso não prejudicar clareza e tipagem; regras de notas e testes equivalentes à CNT-06, com seis entradas. Exibir avaliações individualmente e a média com destaque.

**Teste adicional:** garantir que campos `director` e `releaseYear` não influenciem o cálculo. Casas decimais de exibição: pendentes.

## 12. CNT-09 — Música e Open Source

### Música

**[CONFIRMADO]** Combinação de **artistas, álbuns e músicas** em uma mesma seção.

**[PROPOSTO]** Agrupar visualmente por tipo, com cards e comentários pessoais opcionais; capas/imagens externas de fonte permitida e links para ouvir. Não presumir ranking ou notas numéricas.

**Demo:** `Artista Teste 01`, `Álbum Teste 01`, `Música Teste 01`, com capas Picsum somente como referência visual. Não usar reprodução automática nem links falsos.

### Open Source

**[PROPOSTO]** Catálogo de ferramentas/programas recomendados ou usados, com nome, ícone/imagem, categoria, breve comentário, site oficial real e indicação opcional: “Uso atualmente”, “Já utilizei”, “Recomendo”.

**Demo:** `Ferramenta Teste 01`, sem inventar recomendações reais ou site oficial.

**Aceitação:** agrupamentos claros, cards responsivos, ausência de afirmações pessoais fictícias e dados editáveis.

## 13. CNT-10 — Livros

**[CONFIRMADO]** Biblioteca completa com status **Lidos**, **Lendo** e **Quero ler**, além de identificação de **Favoritos**.

**[PROPOSTO]** Cards de capa, título e autor; ao clicar, página de detalhes com informações e opinião quando real. Não criar notas numéricas antes de definir metodologia.

**Dados:** título, autor, ano opcional, status, favorito, capa opcional, descrição, comentário, `isDemo`.

**Demo:** `Livro Teste 01` a `03`, cobrindo três estados de leitura e pelo menos um favorito fictício.

**Aceitação:** catálogo, status/favoritos, detalhes por livro, responsividade e avisos de teste.

## 14. CNT-11 — Galeria

**[CONFIRMADO]** Galeria organizada em **álbuns por categoria**.

**[PROPOSTO]** Categorias iniciais ilustrativas: Wallpapers, Linux/Desktop, Imagens geradas por IA e Fotografia. Tela de álbuns → grid de imagens do álbum → ampliação/lightbox acessível, se viável na tarefa.

**Dados:** álbum, categoria, título/descrição da imagem, URL, dimensões opcionais, origem/créditos/licença e `isDemo`.

**Demo:** álbuns e fotos temporárias do Picsum, **sempre** identificados como demonstração; não oferecer download como se fossem obras autorais ou wallpapers licenciados para redistribuição.

**Aceitação:** navegação entre álbuns, grades responsivas, metadados e avisos claros, imagens com fallback, teclado para visualização ampliada quando houver lightbox.

## 15. Componentes candidatos (não implementar antecipadamente)

- `PageHeader` — cabeçalhos de seções;
- `ContentCard` — listagens editoriais;
- `CatalogCard` — itens de catálogos;
- `RatingPanel` — apresentação dos critérios de jogos/filmes;
- `Timeline` — história de sistemas operacionais;
- `DemoNotice` — aviso global/individual de demonstração;
- `GalleryGrid`/`Lightbox` — álbuns e imagens.

Usar nomes e localização que façam sentido **na arquitetura existente**. Criar somente quando a tarefa atual realmente necessitar e houver justificativa de reutilização.

## 16. Fluxo de implementação da Fase 4

1. Confirmar uma tarefa CNT do `ROADMAP.md` e os documentos pertinentes.
2. Antes de editar, apresentar plano de arquivos, dados, componentes e verificações.
3. Implementar primeiro com registros fictícios identificados e imagens temporárias quando necessárias.
4. Validar schemas, navegação, acessibilidade, responsividade, desempenho e build conforme a tarefa.
5. Revisar visualmente em desktop e mobile.
6. Substituir os registros demonstrativos por dados reais **somente quando o autor fornecê-los e autorizar a troca**.
7. Relatar alterações e sugerir commit; **não fazer commit/push sem autorização explícita**.

## 17. Pendências legítimas

- Quantidade de casas decimais exibidas nas médias;
- Conteúdo pessoal real para artigos, Linux, opiniões e avaliações;
- Filtros que se justifiquem pelo volume de conteúdo;
- Imagens reais, licenças e respectivos créditos;
- Detalhes finais de Música, Open Source e livros, conforme uso real;
- Infraestrutura e painel administrativo próprios (etapa futura, fora da Fase 4).

**Não transformar as propostas deste documento em requisitos imutáveis.** Preservar as decisões confirmadas e aperfeiçoar detalhes ao avançar pelas tarefas.
