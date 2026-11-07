# Guia de conteúdo e publicação

> **Status:** guia inicial, com modelos sugeridos · **Versão:** 0.1 · **Atualizado:** 2026-11-07

## 1. Objetivo e princípio

**[CONFIRMADO]** O autor será a única pessoa a publicar. Inicialmente, criará/editará arquivos locais e os versionará no Git. Nenhum CMS externo ou painel de administração será necessário no MVP. **[FUTURO]** Construir um painel de publicação próprio acessível remotamente.

**[PROPOSTO]** Conteúdo deve ser independente da interface; novos registros são adicionados sem editar o código dos cards e páginas.

## 2. Qual formato usar?

| Tipo de informação | Formato sugerido | Por quê |
|---|---|---|
| Artigos, ensaios e tutoriais | Markdown (`.md`) | Texto longo, seções, links, imagens |
| Textos de experiência com Linux | Markdown (`.md`) | Conteúdo narrativo |
| Jogos com critérios de avaliação | JSON (`.json`) | Dados consistentes e comparáveis |
| Filmes e livros como catálogo | JSON (`.json`) inicialmente | Campos, listas e filtros |
| Resenhas longas de filmes/livros | Markdown relacionado ao registro | Texto editorial |
| Projetos | JSON ou Markdown | Depende do tamanho da descrição |
| Música e Open Source | JSON ou Markdown | A definir pela natureza do conteúdo |
| Galeria | Metadados JSON + URLs de imagens | Organizar nome, origem e descrição |

**[PROPOSTO]** Não usar MDX por padrão: só quando o artigo realmente precisar de componentes interativos ou visuais personalizados. Formatos definitivos e schemas serão definidos por coleção, quando sua seção for desenvolvida.

## 3. Informações editoriais comuns

**[PROPOSTO]** Campos úteis onde fizerem sentido:

- `title`: título humano.
- `slug`: identificador legível na URL, sem mudanças frequentes.
- `description`: resumo curto.
- `publishedAt`: data de publicação, caso exista.
- `updatedAt`: data de atualização, quando aplicável.
- `tags`: assuntos para navegação e filtro.
- `draft`: rascunho não publicado, quando suportado.
- `cover`: imagem com metadados.

Não obrigar todos os tipos a ter todos esses campos. Campos pessoais não fornecidos não devem ser preenchidos com dados fictícios.

## 4. Exemplo: artigo em Markdown

**[PROPOSTO]** Modelo ilustrativo, não artigo publicado:

```md
---
title: "Como organizei meu ambiente Linux"
description: "Notas sobre organização e ferramentas no desktop."
publishedAt: 2026-11-07
tags: ["linux", "desktop"]
draft: true
---

# Como organizei meu ambiente Linux

Texto de abertura do artigo...

## Organização

Conteúdo...
```

**Cuidados:** utilizar títulos informativos, links descritivos, texto alternativo relevante e não inventar data de publicação ao migrar registros antigos. Rascunhos não devem aparecer no site público.

## 5. Avaliações de jogos

**[CONFIRMADO]** Cada critério recebe uma nota de **0 a 100**, incluindo os extremos. A nota final é a **média aritmética simples dos cinco critérios, sem pesos**.

| Jogo | Mecânica | Enredo | Estética | Retenção | Feeling | Nota |
|---|---:|---:|---:|---:|---:|---:|
| *Exemplo fictício* | 80 | 90 | 85 | 75 | 95 | 85 |

**[PROPOSTO]** Campos internos em inglês para manter consistência com TypeScript; rótulos apresentados no site sempre em português:

| Rótulo | Campo técnico | Tipo |
|---|---|---|
| Jogo | `title` | Texto |
| Mecânica | `mechanics` | Número de 0 a 100 |
| Enredo | `plot` | Número de 0 a 100 |
| Estética | `aesthetics` | Número de 0 a 100 |
| Retenção | `retention` | Número de 0 a 100 |
| Feeling | `feeling` | Número de 0 a 100 |
| Nota | `finalScore` | Calculada, não editada manualmente |

Exemplo fictício de arquivo JSON (a nota final é calculada pelo site):

```json
{
  "slug": "jogo-exemplo",
  "title": "Jogo de exemplo",
  "scores": {
    "mechanics": 80,
    "plot": 90,
    "aesthetics": 85,
    "retention": 75,
    "feeling": 95
  },
  "cover": {
    "src": "https://example.org/imagem-com-permissao.jpg",
    "alt": "Imagem ilustrativa do jogo"
  }
}
```

**Cálculo:** `(mechanics + plot + aesthetics + retention + feeling) / 5`. No exemplo: **85**.

## 6. Avaliações de filmes e demais seções

**[CONFIRMADO]** Cada critério de filme recebe uma nota de **0 a 100**, incluindo os extremos. A nota final é a **média aritmética simples dos seis critérios, sem pesos**.

| Filmes | Diretor | Ano/lançamento | Direção | Roteiro | Audiovisual | Atuação | Ritmo | Feeling | Nota |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| *Exemplo fictício* | Direção de exemplo | 2020 | 80 | 90 | 85 | 75 | 95 | 85 | 85 |

**Importante:** `Diretor` e `Ano/lançamento` são informações sobre o filme, **não são critérios numéricos de avaliação** e não entram na média.

| Rótulo | Campo técnico proposto | Tipo |
|---|---|---|
| Filmes | `title` | Texto |
| Diretor | `director` | Texto |
| Ano/lançamento | `releaseYear` | Ano |
| Direção | `direction` | Número de 0 a 100 |
| Roteiro | `screenplay` | Número de 0 a 100 |
| Audiovisual | `audiovisual` | Número de 0 a 100 |
| Atuação | `acting` | Número de 0 a 100 |
| Ritmo | `pacing` | Número de 0 a 100 |
| Feeling | `feeling` | Número de 0 a 100 |
| Nota | `finalScore` | Calculada, não editada manualmente |

Exemplo fictício de arquivo JSON:

```json
{
  "slug": "filme-exemplo",
  "title": "Filme de exemplo",
  "director": "Direção de exemplo",
  "releaseYear": 2020,
  "scores": {
    "direction": 80,
    "screenplay": 90,
    "audiovisual": 85,
    "acting": 75,
    "pacing": 95,
    "feeling": 85
  }
}
```

**Cálculo:** `(direction + screenplay + audiovisual + acting + pacing + feeling) / 6`. No exemplo: **85**.

**[PROPOSTO]** O site deve calcular `finalScore` a partir dos campos de `scores`, sem armazenar manualmente uma segunda nota divergente. Validar a escala e exigir todos os critérios no momento de publicar uma avaliação completa. **[PENDENTE]** Definir se as notas individuais aceitam decimais e como exibir/arredondar a média; a regra matemática continuará sendo a média simples.

**Outras seções [PROPOSTO]:**

- **Livros:** título, autor, status de leitura, comentário e capa autorizada; metodologia de avaliação ainda pendente.
- **Projetos:** nome, descrição verdadeira, tecnologias efetivamente usadas, URL do GitHub e outras URLs válidas.
- **Linux:** relatos em Markdown; timeline de sistemas/distribuições como dados estruturados se necessário.
- **Música:** entradas de artistas, álbuns ou faixas, ainda sem modelagem final.
- **Open Source:** nome da ferramenta, categoria, experiência pessoal e link oficial.
- **Galeria:** arquivo ou URL, título, descrição, licença e créditos quando aplicáveis.

**[PENDENTE]** Definir modelo e eventual metodologia de avaliação de livros e música; não presumir que usam os critérios de jogos ou filmes.

## 7. Política inicial de imagens externas

**[CONFIRMADO]** Usar links públicos inicialmente. **Importante:** um resultado do Google Imagens **não é uma licença** nem hospedagem garantida.

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

**[PENDENTE]** Serviço futuro de armazenamento de mídia e cópias próprias de imagens autorizadas.

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

**[PROPOSTO]**

1. Criar ou editar Markdown/JSON.
2. Adicionar imagens por URL autorizada e metadados correspondentes.
3. Executar validações de schema e build do Astro.
4. Visualizar localmente e revisar texto, links, layout e mobile.
5. Inspecionar mudanças com Git.
6. Criar commit pequeno e descritivo.
7. Enviar para GitHub e verificar deploy, quando configurado.

**[CONFIRMADO]** O autor decide quando realizar cada commit. O assistente ou agente não deve publicar/commitar sem autorização.

## 10. Preparação para painel próprio futuro

**[FUTURO]** A meta é preencher formulários em uma interface própria e publicar conteúdo remotamente. Para facilitar essa mudança, manter:

- Estrutura de dados consistente e validada.
- Funções de transformação separadas dos componentes.
- Identificadores de conteúdos estáveis.
- Estratégia clara de rascunho/publicação.

**Não implementar agora:** autenticação, APIs de escrita, banco de dados, upload privado, integração de administração com Git ou infraestrutura de backend. Planejar quando o fluxo local estiver consolidado.

## 11. Itens pendentes para a etapa de cada seção

- [PENDENTE] Schemas finais e campos obrigatórios.
- [CONFIRMADO] Jogos e filmes usam critérios próprios de 0 a 100 e média simples sem pesos.
- [PENDENTE] Política de notas para livros e outras seções, se houver.
- [PENDENTE] Casas decimais de entrada e exibição das médias.
- [PENDENTE] Categorias e filtros de cada catálogo.
- [PENDENTE] Origem/licenciamento de imagens reais.
- [PENDENTE] Estratégia de migração para painel próprio.

Este guia descreve a forma inicial de trabalhar com conteúdo; não exige cadastrar todo o acervo antes da publicação do MVP.
