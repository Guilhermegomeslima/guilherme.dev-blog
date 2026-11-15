# Guia de conteúdo e publicação

> **Status:** guia editorial da versão estática em produção · **Revisado:** 2026-11-15. Exemplos abaixo são ilustrativos; schemas válidos em `src/content.config.ts`.

## 1. Objetivo e princípio

**[IMPLEMENTADO]** O autor publica editando arquivos locais Markdown/JSON, validando o projeto e enviando as mudanças ao Git para gerar novo deploy. Não há CMS, painel administrativo, API de escrita ou banco de dados nesta versão.

**[PROPOSTO]** Conteúdo deve ser independente da interface; novos registros são adicionados sem editar o código dos cards e páginas.

## 2. Qual formato usar?

| Tipo de informação      | Formato implementado             | Local no repositório                            |
| ----------------------- | -------------------------------- | ----------------------------------------------- |
| Artigos e ensaios       | Markdown (`.md`)                 | `src/content/articles/`                         |
| Projetos                | Markdown (`.md`)                 | `src/content/projects/`                         |
| Relato e timeline Linux | Componentes + dados TypeScript   | `src/pages/linux/`, `src/data/linuxTimeline.ts` |
| Jogos, Filmes, Livros   | JSON (`.json`)                   | `src/content/games/`, `movies/`, `books/`       |
| Música, Open Source     | JSON (`.json`)                   | `src/content/music/`, `opensource/`             |
| Galeria                 | Metadados JSON + URLs de imagens | `src/content/gallery/`                          |

O padrão `glob` das coleções contempla `.md`/`.mdx`, mas o snapshot contém apenas `.md` e o `package.json` não inclui integração MDX. Não tratar `.mdx` como recurso operacional aprovado sem conferir dependências e suporte real.

## 3. Informações editoriais comuns

**[PROPOSTO]** Campos úteis onde fizerem sentido:

- `title`: título humano.
- `slug`: identificador legível na URL, sem mudanças frequentes.
- `description`: resumo curto.
- `publishedAt`: data de publicação, caso exista.
- `updatedAt`: data de atualização, quando aplicável.
- `tags`: assuntos para navegação e filtro.
- `isDemo`: indicador de demonstração previsto nos schemas; não confundir com fluxo completo de rascunhos. O schema atual de artigos **não define `draft`**.
- `cover`: imagem com metadados.

Não obrigar todos os tipos a ter todos esses campos. Campos pessoais não fornecidos não devem ser preenchidos com dados fictícios.

## 4. Exemplo: artigo em Markdown

**[PROPOSTO]** Modelo ilustrativo, não artigo publicado:

```md
---
title: 'Como organizei meu ambiente Linux'
description: 'Notas sobre organização e ferramentas no desktop.'
publishedAt: 2026-11-07
tags: ['linux', 'desktop']
isDemo: true
---

# Como organizei meu ambiente Linux

Texto de abertura do artigo...

## Organização

Conteúdo...
```

**Cuidados:** o exemplo é fictício e usa `isDemo: true`; **não o publique como artigo real**. `isDemo` não equivale a um sistema seguro de rascunhos privados: conteúdos ainda não aprovados devem ficar fora das coleções utilizadas no build público. Confira os filtros de indexação e a renderização das listas ao preparar demonstrações.

## 5. Avaliações de jogos

**[IMPLEMENTADO]** Cada critério numérico recebe nota de **0 a 100**. O campo `plot` (Enredo) pode ser `null` se não se aplicar; `calculateGameScore` calcula a **média aritmética simples dos critérios não nulos**, sem pesos (cinco notas ou quatro quando Enredo é nulo).

| Jogo               | Mecânica | Enredo | Estética | Retenção | Feeling | Nota |
| ------------------ | -------: | -----: | -------: | -------: | ------: | ---: |
| _Exemplo fictício_ |       80 |     90 |       85 |       75 |      95 |   85 |

**[IMPLEMENTADO]** Campos internos em inglês; rótulos apresentados no site em português:

| Rótulo   | Campo técnico | Tipo                               |
| -------- | ------------- | ---------------------------------- |
| Jogo     | `title`       | Texto                              |
| Mecânica | `mechanics`   | Número de 0 a 100                  |
| Enredo   | `plot`        | Número de 0 a 100, ou `null`       |
| Estética | `aesthetics`  | Número de 0 a 100                  |
| Retenção | `retention`   | Número de 0 a 100                  |
| Feeling  | `feeling`     | Número de 0 a 100                  |
| Nota     | `finalScore`  | Calculada, não editada manualmente |

Exemplo fictício de arquivo JSON (a nota final é calculada pelo site):

```json
{
  "title": "Jogo de exemplo",
  "releaseYear": 2020,
  "genre": "Exemplo",
  "platform": "PC",
  "status": "Concluido",
  "coverImage": {
    "url": "https://example.org/imagem-ilustrativa.jpg",
    "alt": "Imagem ilustrativa do jogo",
    "isPlaceholder": true
  },
  "scores": {
    "mechanics": 80,
    "plot": 90,
    "aesthetics": 85,
    "retention": 75,
    "feeling": 95
  },
  "isDemo": true
}
```

**Cálculo:** `(mechanics + plot + aesthetics + retention + feeling) / 5` quando os cinco forem numéricos; se `plot: null`, excluir esse campo da soma e dividir por quatro. No exemplo completo: **85**. O `id` da coleção vem do nome do arquivo, não de um campo `slug` exigido no JSON.

## 6. Avaliações de filmes e demais seções

**[CONFIRMADO]** Cada critério de filme recebe uma nota de **0 a 100**, incluindo os extremos. A nota final é a **média aritmética simples dos seis critérios, sem pesos**.

| Filmes             | Diretor            | Ano/lançamento | Direção | Roteiro | Audiovisual | Atuação | Ritmo | Feeling | Nota |
| ------------------ | ------------------ | -------------: | ------: | ------: | ----------: | ------: | ----: | ------: | ---: |
| _Exemplo fictício_ | Direção de exemplo |           2020 |      80 |      90 |          85 |      75 |    95 |      85 |   85 |

**Importante:** `Diretor` e `Ano/lançamento` são informações sobre o filme, **não são critérios numéricos de avaliação** e não entram na média.

| Rótulo         | Campo técnico proposto | Tipo                               |
| -------------- | ---------------------- | ---------------------------------- |
| Filmes         | `title`                | Texto                              |
| Diretor        | `director`             | Texto                              |
| Ano/lançamento | `releaseYear`          | Ano                                |
| Direção        | `direction`            | Número de 0 a 100                  |
| Roteiro        | `screenplay`           | Número de 0 a 100                  |
| Audiovisual    | `audiovisual`          | Número de 0 a 100                  |
| Atuação        | `acting`               | Número de 0 a 100                  |
| Ritmo          | `pacing`               | Número de 0 a 100                  |
| Feeling        | `feeling`              | Número de 0 a 100                  |
| Nota           | `finalScore`           | Calculada, não editada manualmente |

Exemplo fictício de arquivo JSON:

```json
{
  "title": "Filme de exemplo",
  "director": "Direção de exemplo",
  "releaseYear": 2020,
  "genre": "Exemplo",
  "scores": {
    "direction": 80,
    "screenplay": 90,
    "audiovisual": 85,
    "acting": 75,
    "pacing": 95,
    "feeling": 85
  },
  "isDemo": true
}
```

**Cálculo:** `(direction + screenplay + audiovisual + acting + pacing + feeling) / 6`. No exemplo: **85**. O `id` vem do nome do arquivo JSON. Os exemplos usam `isDemo: true` e URLs ilustrativas, portanto **não são conteúdo a publicar como real**.

**[IMPLEMENTADO]** O site calcula a média a partir de `scores` em `src/utils/ratings.ts`, sem armazenar uma segunda nota divergente. `formatScore` exibe inteiros sem decimal e valores não inteiros com **uma casa decimal**; os schemas permitem notas numéricas decimais dentro da escala.

**Outras seções [IMPLEMENTADO; descrição resumida]:**

- **Livros:** título, autor, status de leitura (`lendo`, `lido`, `quero_ler`), favorito, comentário e capa opcional; não há avaliação numérica padronizada.
- **Projetos:** registros Markdown com título, descrição, categoria, tags, links para repositório/publicação e imagem opcional, segundo o schema.
- **Linux:** narrativa da página `/linux/` e timeline em `src/data/linuxTimeline.ts`.
- **Música:** entradas JSON com `type` igual a `artist`, `album` ou `track`, segundo `src/content.config.ts`.
- **Open Source:** nome da ferramenta, categoria, experiência pessoal e link oficial.
- **Galeria:** arquivo ou URL, título, descrição, licença e créditos quando aplicáveis.

**[IMPLEMENTADO]** Livros têm status de leitura e marcação de favoritos; Música distingue artistas, álbuns e faixas. Nenhuma dessas coleções usa a média numérica de jogos ou filmes no código atual.

## 7. Política de imagens locais e externas

**[IMPLEMENTADO]** Há fotografias e imagens locais em `public/images/`, além de URLs públicas nos registros; preservar os dois mecanismos. **Importante:** um resultado do Google Imagens **não é uma licença** nem hospedagem garantida.

**[PROPOSTO]** Fluxo seguro:

1. Localizar a imagem em buscador ou fonte confiável.
2. Abrir o site **original**.
3. Confirmar licença, autorização e eventuais requisitos de atribuição; respeitar direitos de terceiros.
4. Confirmar que o endereço da imagem é utilizável fora do site original, sem bloqueio de hotlink.
5. Salvar `src`, `alt`, `sourceUrl`, crédito e licença (quando conhecidos).
6. Verificar como a interface se comporta se a URL quebrar.

**[PROPOSTO]** Modelo de metadados:

```json
{
  "src": "https://example.org/foto-autorizada.jpg",
  "alt": "Rua noturna com reflexos de luz na chuva",
  "sourceUrl": "https://example.org/pagina-da-foto",
  "credit": "Autoria e licença a preencher",
  "license": "A confirmar"
}
```

`example.org` é ilustrativo: não é fonte real para uso no site. **Não publicar** metadados “a confirmar” como se a licença tivesse sido verificada. Para imagens de capas e materiais protegidos, avaliar uso permitido caso a caso; ser público na internet não significa estar livre para reutilização.

**Limite desta revisão:** não propor mudança de hospedagem ou migração de mídia; conferir origem, permissões e créditos de cada recurso em sua tarefa específica.

## 8. Escrita e organização

**[PROPOSTO]**

- Português como idioma principal.
- Títulos claros e descritivos.
- Uso coerente de nomes de seções e tags.
- Arquivos com nomes previsíveis, preferencialmente minúsculos e hifens.
- Datas reais, nunca geradas para simular atividade.
- Opiniões pessoais sinalizadas como opiniões.
- Links externos revisados e sem redirecionamentos suspeitos.
- Texto alternativo útil, evitando repetir “imagem de” em todo `alt`.
- URLs estáveis; ao mudar slug futuramente, considerar redirecionamento.

## 9. Fluxo de publicação local

**[EM USO]**

1. Criar ou editar Markdown/JSON.
2. Adicionar imagens por URL autorizada e metadados correspondentes.
3. Executar validações de schema e build do Astro.
4. Visualizar localmente e revisar texto, links, layout e mobile.
5. Inspecionar mudanças com Git.
6. Criar commit pequeno e descritivo.
7. Enviar para GitHub e verificar deploy, quando configurado.

**[CONFIRMADO]** O autor decide quando realizar cada commit. O assistente ou agente não deve publicar/commitar sem autorização.

## 10. Limite de escopo

Este guia documenta **somente o fluxo de conteúdo atual**. O roadmap mantém eventuais tarefas de evolução como pendentes; não estão sendo especificadas neste documento. Não adicionar credenciais, API administrativa, banco de dados ou mecanismos de publicação alternativos por iniciativa própria.

## 11. Estado das decisões

- **Schemas atuais:** implementados em `src/content.config.ts`; não inventar campos ao criar novos registros.
- **Notas:** calculadas por `ratings.ts`, sem pesos; Enredo de jogos admite `null` e a exibição é formatada por `formatScore`.
- **Filtros e busca:** implementados nas listagens correspondentes; não assumir que todos os catálogos compartilham os mesmos controles.
- **Imagens:** verificar individualmente licenças, créditos, URLs e texto alternativo; uma auditoria automatizada de links não prova licença de uso.
- **Rascunhos:** o campo `draft` não consta no schema atual de artigos; não prometer fluxo privado de rascunho.

Conferir sempre a coleção e a página real antes de copiar exemplos deste guia.
