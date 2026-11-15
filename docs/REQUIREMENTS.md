# Requisitos do blog pessoal — produto atual

> **Status:** requisitos atuais e histórico do MVP consolidado · **Revisão documental:** 2026-11-15.
> **Referência:** código do ZIP recebido e `docs/ROADMAP.md`. Este arquivo descreve o site em produção; não aprova novas tecnologias.

## Convenções

- **[IMPLEMENTADO]**: comportamento presente no código examinado.
- **[CONFIRMADO]**: regra do autor preservada no projeto.
- **[HISTÓRICO]**: escopo ou decisão de etapa concluída.
- **[PENDENTE]**: não foi implementado nem aprovado como solução neste projeto.

## 1. Visão e objetivos

O `guilherme.dev-blog` reúne portfólio e acervo pessoal em português, com seções sobre programação, Linux, projetos, jogos, filmes, livros, música, software livre, artigos e imagens. A intenção é apresentar experiências e opiniões reais, documentar a evolução técnica no Git e oferecer leitura acessível, rápida e responsiva.

**Público:** autor, amigos, contatos profissionais e visitantes. Não é uma loja nem serviço comercial.

**Status:** o blog já está no ar em `https://guilhermegomesdev-blog.vercel.app/`, com espelho em `https://guilhermegomeslima.github.io/guilherme.dev-blog/`.

## 2. Páginas e rotas implementadas

| Área        | Rota atual                        | Conteúdo principal                                                        |
| ----------- | --------------------------------- | ------------------------------------------------------------------------- |
| Home        | `/`                               | Hero cinematográfico, grade editorial de nove categorias, faixa de artigo |
| Sobre       | `/sobre/`                         | Perfil e trajetória pessoal                                               |
| Projetos    | `/projetos/`                      | Portfólio e links                                                         |
| Linux       | `/linux/`                         | Relato e timeline                                                         |
| Jogos       | `/jogos/` e `/jogos/[id]/`        | Catálogo, notas e análises                                                |
| Filmes      | `/filmes/` e `/filmes/[id]/`      | Catálogo, avaliações e análises                                           |
| Livros      | `/livros/` e `/livros/[id]/`      | Biblioteca e comentários                                                  |
| Música      | `/musica/`                        | Artistas, álbuns e faixas                                                 |
| Open Source | `/opensource/`                    | Ferramentas e recomendações                                               |
| Artigos     | `/artigos/` e `/artigos/[id]/`    | Publicações autorais                                                      |
| Galeria     | `/galeria/` e `/galeria/[album]/` | Coleções de imagens e lightbox                                            |

O código também possui a rota auxiliar `/open-source/`, 404, sitemap e robots. Não inventar novas rotas nem alterar os slugs existentes sem análise e aprovação.

## 3. Home e identidade visual

**[IMPLEMENTADO]** A Home reúne marca e navegação, hero com o texto “Ideias, código e histórias.”, nove cards assimétricos de categorias e encerramento editorial. A página Sobre é independente; a Home não reproduz a versão longa da biografia.

**[IMPLEMENTADO]** Identidade global **Design System 2.0**: preto quase absoluto, superfícies discretas, off-white, vermelho envelhecido e bronze; tipografia Cormorant Garamond, Inter e JetBrains Mono. A referência visual completa é `docs/DESIGN_SYSTEM_V2.md` e seus arquivos de referência. A direção cyberpunk/Blade Runner é **histórico**, arquivado em `docs/DESIGN_SYSTEM.md`.

## 4. Requisitos funcionais

| ID    | Requisito                                                        | Estado                                                                |
| ----- | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| RF-01 | Navegar entre páginas com links e teclado                        | [IMPLEMENTADO]                                                        |
| RF-02 | Exibir Home com apresentação e atalhos para seções               | [IMPLEMENTADO] — a composição evoluiu desde o MVP                     |
| RF-03 | Exibir rodapé com links sociais reais                            | [IMPLEMENTADO]                                                        |
| RF-04 | Navegação responsiva e menu recolhível                           | [IMPLEMENTADO]                                                        |
| RF-05 | Exibir conteúdo de arquivos locais em páginas temáticas          | [IMPLEMENTADO]                                                        |
| RF-06 | Busca local em catálogos relevantes                              | [IMPLEMENTADO] — Jogos, Filmes, Livros, Música, Open Source e Galeria |
| RF-07 | Filtros, ordenação e estados vazios conforme cada catálogo       | [IMPLEMENTADO]                                                        |
| RF-08 | Galeria de imagens e wallpapers                                  | [IMPLEMENTADO]                                                        |
| RF-09 | Artigos autorais com URLs próprias                               | [IMPLEMENTADO]                                                        |
| RF-10 | Editar registros locais e publicar pelo fluxo Git + build/deploy | [IMPLEMENTADO]                                                        |
| RF-11 | Área de administração remota própria                             | [PENDENTE] — fora do escopo da versão atual e desta revisão           |

**Regra atual:** a publicação exige alterar arquivos de conteúdo, validar e enviar mudanças ao repositório conforme `docs/GIT_WORKFLOW.md`. O blog público não oferece escrita por visitantes.

## 5. Dados, conteúdo e avaliações

- O conteúdo fica em **oito Astro Content Collections** definidas em `src/content.config.ts`.
- `articles` e `projects` usam Markdown; `games`, `movies`, `books`, `music`, `opensource` e `gallery` usam JSON.
- **Jogos:** Mecânica, Enredo, Estética, Retenção e Feeling são os cinco campos de avaliação, cada nota numérica entre 0 e 100. `plot` pode ser `null` quando não aplicável; a média usa somente os critérios numéricos, sem pesos.
- **Filmes:** Direção, Roteiro, Audiovisual, Atuação, Ritmo e Feeling são seis notas obrigatórias de 0 a 100; média simples sem pesos. Diretor e ano são metadados.
- A formatação vigente usa `formatScore`: inteiros sem decimal; notas não inteiras com uma casa decimal.
- Livros usam status de leitura e favorito; música distingue artista, álbum e faixa. Não aplicar a esses registros a metodologia de notas de jogos/filmes.
- Conteúdo demonstrativo pode ser identificado por `isDemo`; não publicar dados fictícios como opiniões reais.

A descrição dos schemas exatos e campos opcionais deve ser conferida diretamente em `src/content.config.ts`; exemplos históricos dos guias não prevalecem sobre o código.

## 6. Imagens e direitos

**[IMPLEMENTADO]** Imagens locais estão em `public/images/` e há URLs externas nos registros. Fontes locais ficam em `public/fonts/`. Manter imagens dimensionadas, texto alternativo útil, atribuição quando pertinente e comportamento resiliente para URLs remotas. Buscadores de imagens não são provedores de licença nem hospedagem.

Não substituir imagens, fotografias autorais, capas, wallpapers ou metadados de direitos sem autorização do autor.

## 7. Requisitos não funcionais

| ID     | Requisito       | Diretriz atual                                                                     |
| ------ | --------------- | ---------------------------------------------------------------------------------- |
| RNF-01 | Responsividade  | Desktop/mobile sem overflow involuntário                                           |
| RNF-02 | Desempenho      | SSG; JavaScript limitado às interações; imagens priorizadas/lazy quando pertinente |
| RNF-03 | Acessibilidade  | HTML semântico, foco visível, teclado, `prefers-reduced-motion`                    |
| RNF-04 | SEO             | Canonical da Vercel, metadados sociais, sitemap, robots e dados estruturados       |
| RNF-05 | Segurança       | Não versionar segredos; validar registros e URLs; permissões mínimas               |
| RNF-06 | Compatibilidade | Validar navegadores e tamanhos variados; teste real quando possível                |
| RNF-07 | Modularidade    | Conteúdo e regras de negócio separados dos componentes                             |
| RNF-08 | Manutenção      | Git, CI, formatação, testes e builds reproduzíveis                                 |
| RNF-09 | Consistência    | Design System 2.0 em todas as seções, com layouts editoriais próprios              |

Não afirmar métricas Lighthouse/Core Web Vitals sem medições em navegador.

## 8. MVP e evolução visual — histórico concluído

O MVP original compreendia Home, Sobre e rodapé social. Foi publicado, e o site recebeu progressivamente as seções da Fase 4, conteúdo real, o redesign completo VIS-01 a VIS-07 e verificações QLT-01 a QLT-05 (ver `docs/ROADMAP.md`).

A identidade cyberpunk, os exemplos e os critérios de aceitação antigos documentam **a trajetória**, não requisitos de implementação atualmente pendentes. O Design System 2.0 é a referência visual que prevalece.

## 9. Pendências e limites

As tarefas EVO-01 a EVO-03 constam como **pendentes** no roadmap, mas nenhuma tecnologia ou desenho de infraestrutura futura é especificado aqui. **Não iniciar** migrações, backend, login, banco ou painel como consequência desta atualização documental.

## 10. Política de mudanças

Alterar conteúdo real, schemas, scores, rotas, links, infraestrutura ou aparência exige tarefa autorizada e testes relevantes. Uma sugestão de agente, IA ou protótipo não se torna requisito confirmado sem aprovação do autor. Preservar produção, histórico e acessibilidade.
