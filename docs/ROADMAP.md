# Roadmap de desenvolvimento do blog

> **Status:** Em desenvolvimento · **Versão:** 0.4 · **Atualizado:** 2026-11-08
> Planejamento **não é execução**. Nenhuma tarefa abaixo está presumida como implementada.
> Fonte de requisitos: `REQUIREMENTS.md`. Guias: `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CONTENT_GUIDE.md`, `GIT_WORKFLOW.md`.

## 1. Como usar

Como o projeto é individual, **não há colunas Dono e Revisor**. O modelo foi adaptado para:

| Campo        | Significado                                                |
| ------------ | ---------------------------------------------------------- |
| ID           | Identificador estável da tarefa                            |
| Item         | Entrega pequena e verificável                              |
| Dependências | Tarefas anteriores necessárias                             |
| Prioridade   | P0 (MVP), P1 (pós-MVP principal), P2 (evolução)            |
| Data alvo    | Opcional: deixar `—` até definir                           |
| Commit/PR    | Hash, link ou identificador **somente depois** de existir  |
| Status       | Pendente, Em andamento, Em revisão, Concluído ou Bloqueado |

Atualize o status quando houver evidência de implementação; marcar `Concluído` exige checar os critérios de aceitação. Se uma tarefa crescer demais, crie subitens `ID.a`, `ID.b` ou IDs novos sem perder rastreabilidade.

## 2. Fases e entregas

### Fase 0 — Planejamento (P0)

| ID     | Item                                                                 | Dependências | Prioridade | Data alvo | Commit/PR | Status    |
| ------ | -------------------------------------------------------------------- | ------------ | ---------- | --------- | --------- | --------- |
| PLN-01 | Revisar e aprovar requisitos, arquitetura, design e guia de conteúdo | —            | P0         | 07/11     | 7c9c8a5   | Concluído |
| PLN-02 | Revisar e aprovar Git Workflow, Roadmap e AGENTS                     | PLN-01       | P0         | 07/11     | 7c9c8a5   | Concluído |
| PLN-03 | Definir textos reais mínimos e URLs sociais para o MVP               | PLN-01       | P0         | 08/11     | bc5938c   | Concluído |

**Aceitação:** decisões aprovadas e pendências claramente rotuladas; conteúdo factual não inventado.

### Fase 1 — Fundação do projeto (P0)

| ID     | Item                                                       | Dependências | Prioridade | Data alvo | Commit/PR | Status    |
| ------ | ---------------------------------------------------------- | ------------ | ---------- | --------- | --------- | --------- |
| DEV-01 | Criar repositório Git e inicializar Astro com TypeScript   | PLN-02       | P0         | 07/11     | 413ab01   | Concluído |
| DEV-02 | Configurar Tailwind CSS 4 e estilos globais                | DEV-01       | P0         | 07/11     | a459350   | Concluído |
| DEV-03 | Definir tokens provisórios: cores, tipografia, espaçamento | DEV-02       | P0         | 07/11     | 1bdc0e3   | Concluído |
| DEV-04 | Configurar scripts de checagem, formatação e build         | DEV-01       | P0         | 07/11     | 197c1b6   | Concluído |
| DEV-05 | Preparar README e configuração básica de desenvolvimento   | DEV-01       | P0         | 07/11     | 2bbf367   | Concluído |

**Aceitação:** projeto sobe localmente, comandos realmente configurados passam, estrutura é compreensível, sem backend ou banco.

### Fase 2 — Base visual e navegação (P0)

| ID    | Item                                                        | Dependências  | Prioridade | Data alvo | Commit/PR | Status    |
| ----- | ----------------------------------------------------------- | ------------- | ---------- | --------- | --------- | --------- |
| UI-01 | Implementar BaseLayout e container reutilizável             | DEV-03        | P0         | 08/11     | ad94927   | Concluído |
| UI-02 | Implementar cabeçalho e navegação desktop                   | UI-01         | P0         | 08/11     | 12f7a7e   | Concluído |
| UI-03 | Implementar menu mobile recolhível e acessível              | UI-02         | P0         | 08/11     | 0fce214   | Concluído |
| UI-04 | Implementar rodapé com links sociais reais                  | UI-01, PLN-03 | P0         | 08/11     | bc5938c   | Concluído |
| UI-05 | Criar primitives de UI necessárias: seção, botão/link, card | UI-01         | P0         | 09/11     | 756dc67   | Concluído |

**Aceitação:** navegação funcional em desktop/mobile, foco/teclado coerentes, nenhuma rota quebrada ou link social inventado.

### Fase 3 — MVP (P0)

| ID     | Item                                                         | Dependências                                 | Prioridade | Data alvo | Commit/PR | Status    |
| ------ | ------------------------------------------------------------ | -------------------------------------------- | ---------- | --------- | --------- | --------- |
| MVP-01 | Hero e introdução da Home                                    | UI-01, PLN-03                                | P0         | 10/11     | 069564d   | Concluído |
| MVP-02 | Resumo Sobre na Home                                         | MVP-01                                       | P0         | 10/11     | 8cf6b09   | Concluído |
| MVP-03 | Cards/atalhos para seções, sem links quebrados               | UI-05                                        | P0         | 10/11     | 876e6dd   | Concluído |
| MVP-04 | Página Sobre completa para a primeira versão                 | UI-01, PLN-03                                | P0         | 11/11     | 2381d33   | Concluído |
| MVP-05 | Revisar responsividade, acessibilidade, imagens e desempenho | MVP-01, MVP-02, MVP-03, MVP-04, UI-03, UI-04 | P0         | 11/11     | dcc8a93   | Concluído |
| MVP-06 | Revisar SEO básico, metadados e página 404                   | MVP-05                                       | P0         | 11/11     | 8f7278e   | Concluído |
| MVP-07 | Escolher hospedagem e publicar primeira versão               | MVP-06                                       | P0         | 11/11     | 4a89c22   | Concluído |

**Aceitação do MVP:** Home, Sobre e rodapé social funcionais; tema escuro consistente; layout responsivo; build sem erros; URLs válidas; README explica execução/deploy. Hospedagem definida: Vercel e GitHub Pages.

### Fase 4 — Conteúdo e páginas temáticas (P1)

| ID     | Item                                                              | Dependências | Prioridade | Data alvo | Commit/PR | Status    |
| ------ | ----------------------------------------------------------------- | ------------ | ---------- | --------- | --------- | --------- |
| CNT-01 | Definir schemas/content collections por tipo realmente necessário | MVP-07       | P1         | 12/11     | 0f6d04e   | Concluído |
| CNT-02 | Criar listagens e páginas de artigos                              | CNT-01       | P1         | 13/11     | 91a80c2   | Concluído |
| CNT-03 | Criar seção Linux e conteúdos de experiência/timeline             | CNT-01       | P1         | 14/11     | e7be65f   | Concluído |
| CNT-04 | Criar seção Projetos e links GitHub                               | CNT-01       | P1         | 16/11     | f5808d9   | Concluído |
| CNT-05 | Criar seção Jogos e validação dos cinco critérios                 | CNT-01       | P1         | 20/11     | a58d7b6   | Concluído |
| CNT-06 | Criar cálculo/testes da média simples de jogos                    | CNT-05       | P1         | 22/11     | 40b06c5   | Concluído |
| CNT-07 | Criar seção Filmes e validação dos seis critérios                 | CNT-01       | P1         | 28/11     | 4f749bb   | Concluído |
| CNT-08 | Criar cálculo/testes da média simples de filmes                   | CNT-07       | P1         | 29/11     | 3fa44b7   | Concluído |
| CNT-09 | Criar seções Música e Open Source                                 | CNT-01       | P1         | 06/12     | 4db1780   | Concluído |
| CNT-10 | Definir modelo e criar seção Livros                               | CNT-01       | P1         | 16/12     | a6c4cc2   | Concluído |
| CNT-11 | Criar galeria com metadados e imagens externas permitidas         | CNT-01       | P1         | 20/12     | 2d324c8   | Concluído |

**Aceitação:** conteúdo separado da interface; dados validados no build; notas entre 0 e 100; média sem pesos; URLs de imagens e créditos documentados; evitar seções vazias.

> Ordem das seções na Fase 4 é **sugerida** e pode mudar conforme o conteúdo disponível. Não implementar toda a fase em um único commit.

## Fase 4.5 — Inserção de conteúdo real (P1)

> **Objetivo:** substituir gradualmente os conteúdos demonstrativos pelos meus dados, textos, avaliações e imagens reais, mantendo a separação entre conteúdo e interface.
>
> **Datas-alvo:** por enquanto, **sem datas fixas (`—`)**. O cadastro depende da preparação de conteúdo autoral e não precisa acompanhar o ritmo de programação. A ordem abaixo representa a **prioridade de execução**, não impede cadastrar dados de outra seção já pronta.
>
> **Critério de conclusão:** não considerar conteúdo fictício como informação pessoal real. Manter avisos de demonstração enquanto houver mocks publicados.

| ID      | Item                                                                                | Dependências técnicas | Prioridade | Data alvo | Commit/PR | Status   |
| ------- | ----------------------------------------------------------------------------------- | --------------------- | ---------- | --------- | --------- | -------- |
| DATA-01 | Inserir jogos reais, informações, imagens e notas dos cinco critérios               | CNT-05, CNT-06        | P1         | —         | 3f4fb7e   | Concluído |
| DATA-02 | Cadastrar projetos reais com imagens, descrições e links conferidos                 | CNT-04                | P1         | —         | 3a5ea16   | Concluído |
| DATA-03 | Escrever a trajetória no Linux e completar a timeline dos sistemas utilizados       | CNT-03                | P1         | —         | —         | Pendente |
| DATA-04 | Inserir filmes reais, diretor, ano e avaliações dos seis critérios                  | CNT-07, CNT-08        | P1         | —         | —         | Pendente |
| DATA-05 | Cadastrar livros reais com status de leitura, favoritos e opiniões                  | CNT-10                | P1         | —         | —         | Pendente |
| DATA-06 | Publicar artigos autorais reais, revisando títulos, datas e categorias              | CNT-02                | P1         | —         | —         | Pendente |
| DATA-07 | Cadastrar artistas, álbuns e músicas reais e recomendações de Open Source           | CNT-09                | P1         | —         | —         | Pendente |
| DATA-08 | Substituir álbuns de teste por galerias reais, imagens autorizadas e créditos       | CNT-11                | P1         | —         | —         | Pendente |
| DATA-09 | Remover ou despublicar os dados de demonstração restantes e validar todo o conteúdo | DATA-01 a DATA-08     | P1         | —         | —         | Pendente |

**Aceitação:**

1. Os conteúdos foram fornecidos ou aprovados pelo autor; não inventar experiências, opiniões, notas ou dados biográficos.
2. As notas de jogos e filmes são calculadas pela média aritmética simples dos critérios definidos, sem pesos; validar cada nota entre 0 e 100.
3. Imagens externas possuem URL funcional e uso permitido, com créditos quando exigidos; imagens do Lorem Picsum devem ser removidas ou mantidas apenas onde a demonstração ainda estiver explicitamente sinalizada.
4. Links, rotas, metadados e apresentação em desktop/mobile foram conferidos.
5. A tarefa DATA-09 só será concluída quando as seções publicadas não exibirem conteúdo fictício como real; caso uma seção permaneça demonstrativa, seu aviso deve continuar claro e a pendência registrada.
6. Cada tarefa pode gerar vários commits pequenos, conforme `GIT_WORKFLOW.md`; o campo `Commit/PR` será preenchido somente após o versionamento.

**Nota sobre o escopo:** a seção **Open Source** está incluída em `DATA-07`, junto da tarefa `CNT-09`, para não ficar sem cadastro real. A ordem dos nove itens acima segue a prioridade definida para o projeto.

### Fase 5 — Descoberta, qualidade e evolução (P1/P2)

| ID     | Item                                                                      | Dependências   | Prioridade | Data alvo | Commit/PR | Status   |
| ------ | ------------------------------------------------------------------------- | -------------- | ---------- | --------- | --------- | -------- |
| QLT-01 | Adicionar filtros úteis a jogos/filmes e outras listagens                 | CNT-05, CNT-07 | P1         | 24/12     | —         | Pendente |
| QLT-02 | Adicionar busca local quando houver volume que justifique                 | CNT-02         | P1         | 26/12     | —         | Pendente |
| QLT-03 | Revisar SEO por conteúdo, sitemap e compartilhamento social               | CNT-02         | P1         | 28/12     | —         | Pendente |
| QLT-04 | Ampliar testes, verificações automáticas e CI quando necessário           | DEV-04         | P1         | 31/12     | —         | Pendente |
| QLT-05 | Refinar desempenho, imagens e movimento reduzido                          | CNT-11         | P1         | 02/01     | —         | Pendente |
| EVO-01 | Especificar autenticação e backend para painel próprio remoto             | MVP-07         | P2         | 09/01     | —         | Pendente |
| EVO-02 | Decidir armazenamento externo próprio/de mídia                            | CNT-11         | P2         | 10/01     | —         | Pendente |
| EVO-03 | Implementar painel administrativo próprio, após nova arquitetura aprovada | EVO-01, EVO-02 | P2         | 30/01     | —         | Pendente |

**Aceitação:** mudanças adicionais não comprometem a publicação atual; soluções externas são opcionais e justificadas, não introduzidas antecipadamente.

## 3. Política de execução

- Escolher um item por vez, ou um pequeno grupo inseparável.
- Solicitar ao agente primeiro um plano de arquivos e impacto.
- Implementar, executar verificações pertinentes, revisar e só então solicitar autorização de commit.
- Commits correspondem a mudanças coerentes; **não** é necessário que uma tarefa inteira seja um único commit.
- Atualizar este roadmap ao encerrar cada entrega.

## 4. Critérios globais de pronto

Uma tarefa somente vira **Concluído** quando:

1. Entrega funciona conforme escopo e dependências;
2. Build/checagens configuradas passam ou impedimentos são documentados;
3. Alterações de interface foram verificadas em desktop/mobile, quando pertinente;
4. Segurança, acessibilidade e comportamento de links foram examinados;
5. Existe referência de commit/PR **se a mudança já foi versionada**.

## 5. Decisões que não devem ser inventadas

- Domínio próprio, links pessoais e biografia final que ainda não tenham sido definidos;
- Cores/tokens finais (a paleta é provisória);
- Quantidade de casas decimais das médias;
- Modelo definitivo de livros/música;
- Provedor futuro de imagens e backend do painel.
