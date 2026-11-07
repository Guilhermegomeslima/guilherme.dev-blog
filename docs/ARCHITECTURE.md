# Arquitetura técnica do blog

> **Status:** proposta técnica para aprovação · **Versão:** 0.1 · **Atualizado:** 2026-11-07  
> Derivada de `REQUIREMENTS.md`. Nada aqui autoriza iniciar a implementação automaticamente.

## 1. Visão de arquitetura

**[CONFIRMADO]** Site pessoal multipáginas com **Astro**, **TypeScript**, **Tailwind CSS 4**, conteúdo local e identidade visual comum. A versão inicial será um **site estático (SSG)**, sem backend e sem banco de dados.

```text
Autor edita Markdown/JSON
          ↓
Validação e build Astro
          ↓
HTML/CSS/JS e recursos estáticos
          ↓
Hospedagem/CDN (provedor a definir)
          ↓
Navegador do visitante
```

**[PROPOSTO]** Arquitetura em três responsabilidades:

- **Conteúdo:** Markdown e dados estruturados, com validação.
- **Apresentação:** layouts, páginas, componentes e tokens visuais.
- **Infraestrutura:** scripts, build, configuração, testes e deploy.

## 2. Stack e justificativas

| Tecnologia                | Estado                 | Papel                                            |
| ------------------------- | ---------------------- | ------------------------------------------------ |
| Astro                     | [CONFIRMADO]           | Páginas, rotas e geração estática                |
| TypeScript                | [CONFIRMADO]           | Modelos, verificações e utilitários              |
| Tailwind CSS 4            | [CONFIRMADO]           | Estilos utilitários e tokens                     |
| Markdown                  | [CONFIRMADO]           | Artigos e textos                                 |
| JSON                      | [CONFIRMADO]           | Registros de jogos, projetos e outros dados      |
| Astro Content Collections | [PROPOSTO]             | Carregar/validar dados e conteúdo                |
| Zod                       | [PROPOSTO]             | Schemas de coleções, quando pertinente           |
| MDX                       | [OPCIONAL]             | Texto que necessite de componentes embutidos     |
| Lucide                    | [PROPOSTO]             | Ícones coerentes                                 |
| Git + GitHub              | [CONFIRMADO]           | Histórico e código público                       |
| Vercel                    | [PENDENTE]             | Candidata a hospedagem, não obrigatória          |
| React/Vue                 | [NÃO NECESSÁRIO AGORA] | Só se surgir uma interação complexa justificável |

**Nota:** Astro não implica “zero JS”. O objetivo é **JavaScript somente quando necessário** (menu, filtros, pesquisa, galeria interativa).

## 3. Estrutura sugerida de repositório

A árvore abaixo é **ilustrativa** e pode ser implementada por etapas. Não criar todos os diretórios vazios no início.

```text
/
├── public/
│   ├── favicon.svg
│   └── images/                 # Apenas assets públicos locais, quando necessários
├── src/
│   ├── assets/                 # Imagens locais que o Astro possa processar
│   ├── components/
│   │   ├── layout/             # Header, Nav, Footer
│   │   ├── home/               # Hero, AboutPreview, CategoryGrid
│   │   ├── content/            # ArticleCard, RatingCard, TagList
│   │   └── ui/                 # Button, Card, SectionHeading
│   ├── content/
│   │   ├── articles/
│   │   ├── linux/
│   │   ├── games/
│   │   ├── movies/
│   │   ├── books/
│   │   └── projects/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── sobre.astro
│   │   ├── projetos/
│   │   ├── linux/
│   │   ├── jogos/
│   │   ├── filmes/
│   │   ├── musica/
│   │   ├── livros/
│   │   ├── open-source/
│   │   ├── artigos/
│   │   └── galeria/
│   ├── styles/
│   │   └── global.css
│   ├── lib/                    # Funções puras, formatos e transformações
│   ├── data/                   # Configuração pequena (navegação, social)
│   └── content.config.ts       # Quando Content Collections forem adotadas
├── docs/
│   └── ...
├── REQUIREMENTS.md
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
├── CONTENT_GUIDE.md
├── README.md
├── astro.config.mjs
└── package.json
```

**Atenção:** a estrutura de arquivos de coleções e `content.config.ts` deve respeitar a versão do Astro instalada durante a implementação. **Não** pressupor que cada subpasta precise ser uma coleção; selecionar coleções com base no tipo e nos usos dos dados.

## 4. Rotas e navegação

**[PROPOSTO]** URLs legíveis e estáveis, sem extensão de arquivo: `/sobre/`, `/projetos/`, `/linux/`, `/jogos/`, `/artigos/` etc. Slugs de artigos e registros devem ser únicos e estáveis.

- `BaseLayout.astro`: estrutura HTML, SEO básico, cabeçalho, rodapé e estilos comuns.
- Páginas de listagem: carregam registros, ordenam e exibem cards.
- Páginas individuais: geradas estaticamente a partir dos slugs existentes.
- Cabeçalho: menu compacto/recolhível em telas menores, com destaque da página atual e estado acessível.

**[PROPOSTO]** A navegação é configurada em uma fonte única (`src/data/navigation.ts`, por exemplo). No MVP, links para seções não implementadas não devem levar a páginas quebradas.

## 5. Modelagem e validação

**[PROPOSTO]** Utilizar Content Collections para artigos e conjuntos de registros relevantes. Definir schemas de modo gradual, com campos opcionais quando apropriado. Evitar dois cadastros concorrentes para o mesmo conteúdo.

- Markdown: corpo textual + frontmatter (título, descrição, data, tags, capa quando houver).
- JSON: registros estruturados (por exemplo, jogo com avaliações por critério).
- Utilitários TS: cálculo de notas, ordenação e filtros; componentes **não** recalculam regras de negócio arbitrariamente.

**[CONFIRMADO] Jogos:** critérios `mechanics` (Mecânica), `plot` (Enredo), `aesthetics` (Estética), `retention` (Retenção) e `feeling` (Feeling). Cada nota vai de **0 a 100**, inclusive. Nota final = **média aritmética simples dos cinco critérios**, sem pesos.

**[CONFIRMADO] Filmes:** critérios `direction` (Direção), `screenplay` (Roteiro), `audiovisual` (Audiovisual), `acting` (Atuação), `pacing` (Ritmo) e `feeling` (Feeling), todos de **0 a 100**. Nota final = **média aritmética simples dos seis critérios**, sem pesos. `director` (Diretor) e `releaseYear` (Ano/lançamento) são metadados, não entram na média.

**[PROPOSTO]** Calcular as duas médias em utilitários TypeScript compartilhados e validar valores e quantidade de critérios no schema. **[PENDENTE]** Precisão de entrada, casas decimais de exibição e arredondamento; não alterar a média original.

**[PENDENTE]** Determinar schemas precisos para livros, música e galeria. Não inventar notas ou campos obrigatórios sem conteúdo real.

## 6. Estratégia de imagens

**[CONFIRMADO]** Inicialmente, usar URLs de imagens externas. **[PROPOSTO]** Armazenar metadados (`src`, `alt`, `credit`, `sourceUrl`, `license`, `width`, `height` quando conhecidos) junto ao registro.

- `public/`: recursos locais servidos sem processamento pelo Astro.
- `src/assets/`: recursos locais sujeitos ao pipeline de assets e otimização quando suportado.
- URLs externas: dependem do servidor de origem; podem falhar, bloquear hotlink ou restringir uso. O uso de processamento de imagem remota pelo Astro pode precisar de configuração de domínios permitidos, conforme o componente e a versão.
- Nunca incluir URLs de miniaturas do Google como fonte permanente.
- **[PROPOSTO]** Definir imagem de fallback e proporções estáveis para evitar saltos visuais.

## 7. Estilo e componentes

- Centralizar tokens e padrões visuais descritos em `DESIGN_SYSTEM.md`.
- Reutilizar `Header`, `Footer`, `Container`, `SectionHeading`, `Card`, `Link` e variantes específicas apenas quando necessário.
- Evitar um componente universal com dezenas de parâmetros que tente resolver todas as seções.
- CSS/Tailwind não devem ficar duplicados em cada rota; permitir variantes explícitas.
- O protótipo Figma é **referência de aparência**, não código-fonte nem especificação funcional integral.

## 8. Interatividade mínima

**[PROPOSTO]** Usar HTML/CSS e pequenas rotinas client-side antes de introduzir frameworks de componentes:

- Navegação mobile: menu com `aria-expanded`, foco, tecla Escape e clique/tap.
- Busca e filtros: só nas seções em que fizerem sentido; testar desempenho com o volume real de registros.
- Galeria: se houver lightbox, assegurar teclado, fechamento claro e foco.
- Movimento: respeitar `prefers-reduced-motion`.

## 9. Qualidade e segurança

**[PROPOSTO]** Checklist por entrega:

1. Build e checagem de tipos/validações sem erros.
2. Rotas e links funcionais.
3. Revisão de acessibilidade básica e contraste.
4. Teste de layout em telas estreitas e largas.
5. Dados sem informações pessoais privadas, tokens ou chaves.
6. Dependências justificadas e atualizadas de forma controlada.

**[PROPOSTO]** Acrescentar testes unitários para cálculos de avaliações, normalização de slugs e transformações de dados quando esses módulos existirem. CI e testes E2E são etapas posteriores, não pré-condições do MVP.

## 10. Git e entregas

**[CONFIRMADO]** Começar somente na branch `main`, com commits pequenos por funcionalidade ou etapa, evitando commits enormes. **[PROPOSTO]** Conventional Commits (`docs:`, `feat:`, `fix:`, `refactor:`, `test:`, `chore:`). Branch temporária é opcional para mudanças mais arriscadas.

**[PROPOSTO]** Fluxo: definir escopo → identificar arquivos → implementar apenas o combinado → executar build/testes → revisar diff → commit autorizado pelo autor. Não fazer commits automáticos sem solicitação.

## 11. Evolução para publicação remota própria

**[FUTURO]** Uma área privada própria para criar/editar conteúdo. Existem ao menos dois caminhos a estudar **mais tarde**:

1. Painel próprio que salva conteúdo por meio de um serviço autenticado e abre alterações no repositório, disparando novo build.
2. Painel próprio + API + persistência própria, com integração ao site.

Nenhum desses caminhos está aprovado. Ambos trazem autenticação, autorização, segurança, infraestrutura e custos operacionais que não fazem parte do MVP. Um repositório privado separado **não é necessário** para começar.

## 12. Decisões a confirmar

- [PENDENTE] Hospedagem e domínio.
- [PENDENTE] Versões exatas de bibliotecas na inicialização.
- [PENDENTE] Coleções efetivamente necessárias por domínio.
- [PENDENTE] Estrutura definitiva de busca/filtros.
- [PENDENTE] Organização de mídias remotas e tratamento de falhas.
- [PENDENTE] CI, testes visuais e ferramenta de deploy.

Este documento é uma proposta de arquitetura. Implementar somente após aprovação da etapa correspondente.
