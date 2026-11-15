# Planejamento futuro — Painel administrativo e conteúdo dinâmico

> **Projeto:** `guilherme.dev-blog`  
> **Status:** estudo preliminar; decisões técnicas pendentes  
> **Registro inicial:** 15/11/2026  
> **Escopo:** EVO-01 (autenticação e backend), EVO-02 (mídia) e EVO-03 (painel)  
> **Natureza:** documentação de intenção futura, **não** especificação aprovada nem autorização para implementar.

## 1. Contexto e objetivo

O `guilherme.dev` já está publicado, com o site principal na Vercel e uma versão estática no GitHub Pages. A implementação atual utiliza **Astro, TypeScript, Tailwind CSS 4, Content Collections, Markdown/JSON e geração estática (SSG)**. O **Design System 2.0** está vigente.

A proposta futura é criar uma ferramenta administrativa **própria, privada e acessível pelo navegador**, usada somente pelo autor, para gerenciar conteúdo de todas as seções sem precisar editar arquivos localmente.

**Mudança de requisito importante:** o autor **não quer que cada edição ou publicação de conteúdo gere commits, `git push` ou rebuild do site**. A publicação deve ocorrer por uma operação autenticada e refletir-se na experiência pública dinamicamente, respeitando cache e propagação. Git continuará sendo usado para versionar **código e infraestrutura**, não como mecanismo de publicação dos registros.

O objetivo desta nota é preservar as decisões e dúvidas para consulta futura, inclusive com outros desenvolvedores. **Não há urgência de implementação**: a prioridade é manter a versão em produção estável, rápida e segura.

## 2. Decisões e preferências expressas pelo autor

| Assunto                | Diretriz                                                                       | Estado                                          |
| ---------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| Público administrativo | Um único administrador, sem planos atuais de equipe                            | **Definido**                                    |
| Dispositivos           | Principalmente computador; interface remota via navegador                      | **Definido**                                    |
| Acesso                 | Privado e com segurança forte                                                  | **Definido**                                    |
| Autenticação           | Comparar GitHub, passkeys, Cloudflare Access e outras opções                   | **Em estudo**                                   |
| Recursos               | Criar, editar, excluir, pré-visualizar, revisar e publicar todas as seções     | **Definido como objetivo**                      |
| Revisão                | Pré-visualizar e confirmar antes de publicar                                   | **Definido**                                    |
| Rascunhos              | Preferência inicial por manter no navegador até a revisão                      | **Preferência**, com risco de perda documentado |
| Publicação             | Ação no painel → validação → atualização pública; sem commit/push por conteúdo | **Definido**                                    |
| Backend/API            | Preferência por serviço separado; possibilidade de API própria                 | **Direção, não tecnologia escolhida**           |
| Persistência           | Conteúdo externo ao código é candidato natural para edição sem Git             | **Em estudo**                                   |
| Imagens                | Upload pelo painel para armazenamento externo                                  | **Objetivo definido; fornecedor pendente**      |
| Custo                  | Priorizar R$ 0/mês                                                             | **Restrição desejada**, não garantia            |
| Critério principal     | Segurança e confiabilidade, sem tornar o blog lento                            | **Definido**                                    |
| Implementação atual    | Somente planejamento, sem código                                               | **Definido**                                    |

## 3. Fronteiras da solução

### 3.1 O que deve continuar verdadeiro

- O blog público não pode ser interrompido ou ter sua identidade visual alterada durante o estudo.
- O histórico e os dados existentes devem ser preservados, com migração reversível quando houver uma solução aprovada.
- O código público pode continuar no repositório GitHub atual; o painel e a API podem ficar em um repositório **privado e separado**.
- Uma aplicação hospedada não fica segura apenas porque seu repositório é privado.
- Leitores anônimos **não** devem precisar autenticar-se nem receber credenciais do backend.
- Regras de avaliação e metadados devem permanecer consistentes com os schemas e cálculos existentes; não presumir modelos simplificados ao migrar.
- O conteúdo público deve continuar indexável por buscadores, com URLs estáveis, canonical e sitemap adequados.

### 3.2 O que não está decidido

Nenhum fornecedor, framework de API, banco, produto de login, forma de hospedagem, domínio administrativo, serviço de armazenamento de imagens ou cronograma foi aprovado. As opções abaixo são **candidatas para comparação**, não decisões de adoção.

## 4. Arquiteturas candidatas para publicação sem Git

### Alternativa A — Astro com renderização dinâmica seletiva (candidata preferencial para estudo)

```text
Autor → Painel privado → API autenticada → Banco de dados
                              └───────────→ Storage de imagens

Visitante → Astro público (páginas estáticas + rotas dinâmicas)
                         └→ leitura de conteúdo via camada de dados/cache
```

- Home e páginas relativamente estáveis podem continuar pré-renderizadas.
- Catálogos, artigos e páginas individuais que exijam atualizações sem build podem usar **SSR** ou outra estratégia de renderização no servidor.
- A API de **escrita** permanece privada; o site público usa uma superfície de **leitura** com permissões restritas, cache e limitação de consultas.
- O HTML das páginas dinâmicas pode ser entregue pronto, favorecendo indexação e compartilhamento.
- Requer runtime compatível na hospedagem das rotas dinâmicas e uma estratégia clara de cache, disponibilidade, fallback e invalidação.

**Risco/impacto:** GitHub Pages não executa SSR. É necessário decidir se seguirá como espelho estático, se terá conteúdo atualizado por outro mecanismo, ou se essa exigência será revista. Não modificar o espelho atual por antecipação.

### Alternativa B — Manter Astro totalmente estático e consultar uma API no navegador

- Pode conservar as duas hospedagens estáticas e atualizar listagens por JavaScript.
- Conteúdos recém-criados e suas páginas individuais não existem automaticamente como HTML pré-renderizado; SEO, deep links, Open Graph, sitemap e acessibilidade tornam-se problemas específicos.
- Pode introduzir estados de carregamento e dependência do serviço de dados em tempo de visita.

**Conclusão preliminar:** útil para atualizações complementares, mas menos adequada como solução única para todo o acervo editorial sem rebuild.

### Alternativa C — Banco externo com rebuild sob demanda

Embora preserve SSG, **não atende à preferência expressa de publicar sem rebuild**. Permanece registrada apenas como referência comparativa, não como recomendação atual.

## 5. Onde ficariam painel e API?

**Organização candidata, sem criar repositórios agora:**

```text
guilherme.dev-blog/       # Projeto público existente; site e código
guilherme.dev-admin/      # Possível repositório privado futuro
  apps/admin/             # Interface privada
  apps/api/               # API própria / operações administrativas
  packages/contracts/     # Tipos e validações compartilhados, se justificados
```

- O painel pode ser hospedado separadamente do blog, com acesso restrito por identidade.
- A API pode usar funções serverless ou um servidor dedicado; **API própria não implica VPS 24/7**.
- A API recebe solicitações de escrita e valida permissões; não deve disponibilizar segredos, SQL administrativo ou tokens permanentes ao frontend.
- O site público não deve compartilhar credenciais de escrita com o painel.
- Endereços, domínios, fornecedores, CORS, cookies e fronteiras de confiança deverão ser definidos em um desenho de segurança futuro.

## 6. Autenticação: opções para estudo

| Opção                                      | Vantagens                                                         | Limitações e cuidados                                                                                                                                     |
| ------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare Access** com identidade forte | Proteção de acesso anterior ao app; menos código próprio de login | Dependência de fornecedor; proteger também a API e validar identidade no backend                                                                          |
| **Login com GitHub (OAuth/OIDC)**          | Conveniente para usuário único e ecossistema existente            | Exige fluxo OAuth correto, verificação do identificador imutável do usuário, sessões seguras; não confundir login com permissão de escrita no repositório |
| **Passkey/WebAuthn no próprio painel**     | Resistente a phishing; sem senha convencional                     | Implementação, registro e recuperação de credenciais exigem cuidado; preferir bibliotecas/provedores maduros                                              |
| **E-mail + senha + MFA**                   | Controle sobre login tradicional                                  | Maior superfície de manutenção: hashes, redefinição, MFA, bloqueios, recuperação                                                                          |
| **Magic link por e-mail**                  | Login sem senha local                                             | Segurança e disponibilidade dependem do e-mail, entregabilidade e proteção contra abuso                                                                   |

**Critérios de avaliação:** resistência a phishing, recuperação após perda de dispositivo, custo real, segurança de sessão, logout/revogação, manutenção e proteção da API. Não desenvolver criptografia, armazenamento de senha ou implementação WebAuthn artesanal.

**Mínimos de segurança (independentes da escolha):**

1. Apenas a identidade explicitamente autorizada pode executar ações administrativas; checar **autorização no servidor a cada operação**.
2. HTTPS; sessão protegida, expiração e revogação; política de cookies/CSRF adequada ao mecanismo escolhido.
3. Limites de requisição, validação rigorosa de entrada, proteção a XSS e tratamento seguro de Markdown/HTML.
4. Segredos fora do repositório, com escopos mínimos e rotação; não armazená-los no navegador.
5. Logs de operações sem expor dados sensíveis, alertas básicos de falhas e estratégia de recuperação de acesso.
6. Backups restauráveis e testes de recuperação antes da entrada em produção.

## 7. API e persistência: opções de estudo

### API

- **Cloudflare Workers / TypeScript:** candidata serverless, especialmente se outros serviços do ecossistema forem utilizados; verificar limites de CPU e compatibilidade das bibliotecas escolhidas.
- **Vercel Functions / TypeScript:** candidata familiar ao ambiente do blog; verificar custos, limites e isolamento do projeto administrativo.
- **API Node.js própria (ex.: Fastify/Hono/outro framework apropriado):** maior autonomia tecnológica; escolha de hospedagem e manutenção conforme o runtime.

A definição de endpoints e contratos depende dos schemas reais do blog. Exemplo **conceitual**: listar, carregar, salvar rascunho (se futuramente escolhido), pré-visualizar, publicar, arquivar/excluir, consultar histórico, recuperar versões e autorizar uploads. **Não criar endpoints nesta fase.**

### Banco de dados

- **SQLite gerenciado (ex.: Cloudflare D1):** pode reduzir operações para um acervo pessoal pequeno, sujeito aos limites e ao modelo de execução.
- **PostgreSQL gerenciado (ex.: Supabase Postgres):** relacional e extensível; exige avaliar política do plano gratuito, disponibilidade e manutenção.
- **Outras opções:** pesquisar somente se as duas anteriores não atenderem aos requisitos reais.

A modelagem deve preservar tipos de conteúdo, slugs, referências a imagens, datas e regras de notas. Priorizar **uma fonte de verdade** após eventual migração; evitar escrever simultaneamente em JSON local e banco sem estratégia explícita. Prever transações, integridade referencial, histórico, exportação e portabilidade dos dados.

**Atenção:** cotas gratuitas, exigência de cartão, suspensão por inatividade e preços mudam. Verificar documentação oficial atualizada **quando a decisão for tomada**; não assumir custo zero garantido.

## 8. Imagens e armazenamento (EVO-02)

**Requisitos desejados:** upload no painel, URL pública estável para imagens publicadas, metadados de autoria/crédito, formato eficiente, miniaturas, controle de tamanho, possibilidade de exportação e custos previsíveis.

| Candidato            | Ponto forte                                       | Questão a validar                                            |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| **Cloudflare R2**    | Armazenamento de objetos com integração a Workers | Entrega pública, otimização, limites e cobranças             |
| **Cloudinary**       | Transformações e otimização integradas            | Créditos, tráfego, limites e dependência da plataforma       |
| **Supabase Storage** | Integração com serviços Supabase                  | Cotas, saída de dados, disponibilidade e políticas de acesso |

**Fluxo candidato:** o administrador solicita um upload autenticado; o backend autoriza tamanho, tipo, destino e validade; o navegador envia o arquivo com autorização temporária; a API registra a referência após confirmar o upload. Evitar chaves permanentes no cliente, arquivos executáveis, path traversal e exposição acidental de conteúdo privado. Disponibilizar versões responsivas/otimizadas sem destruir o original.

**Migração:** imagens atuais permanecem onde estão até haver planejamento específico, inventário, backup, prova de integridade e autorização do autor.

## 9. Edição, rascunhos, pré-visualização e publicação

### Fluxo desejado

1. Entrar no painel autenticado.
2. Selecionar a seção e criar/editar um registro existente.
3. Preencher formulário ou editor adequado ao schema, inclusive Markdown para textos longos.
4. Manter edição **local no navegador** inicialmente; apresentar aviso de alterações não publicadas.
5. Pré-visualizar o conteúdo com estrutura próxima à renderização pública.
6. Revisar e confirmar a publicação.
7. API verifica sessão, autorização, dados, versões e referências a mídias.
8. API grava uma versão publicada no banco; o site passa a exibi-la, considerando invalidação/TTL de cache.
9. Registrar histórico auditável e permitir recuperação de versão anterior.

### Cuidados especiais

- **Rascunho somente no navegador** pode ser perdido ao limpar dados, usar navegação privada, trocar de aparelho ou enfrentar falhas de armazenamento. Avaliar IndexedDB com exportação manual, recuperação e aviso explícito; nunca tratar armazenamento local como backup confiável.
- **Prévia local** pode divergir do HTML final. Avaliar pré-visualização server-side autenticada, sem indexação e sem vazamento de conteúdo não publicado.
- Definir semântica de `draft`, `published`, `archived`, exclusão lógica/física, conflito de versões e operação idempotente.
- **Publicação sem rebuild** não implica atualização instantânea de caches, sitemap e metadados. Planejar invalidação, sitemap dinâmico e atualização das páginas de indexação/compartilhamento.
- Definir mecanismo de recuperação se a API ou o banco ficarem indisponíveis e como o site lida com falhas de leitura.

## 10. Performance, SEO e continuidade operacional

- O blog é **um produto já em produção**; preservar as métricas e o Design System 2.0 durante qualquer evolução.
- Preferir renderização seletiva e cache de conteúdo público; não converter tudo para SSR sem justificativa.
- Evitar dependência de um backend administrativo em requisições de leitores.
- Estudar índices, paginação, consultas agregadas e cache coerente para catálogos.
- Medir LCP, CLS, INP, TTFB e erros antes/depois com ferramentas reais; não inventar métricas.
- Preservar slugs e URLs, canonical, Open Graph, schema markup e sitemap, inclusive para conteúdo criado após o deploy.
- Projetar rollback, backup, migração gradual e plano de retorno à versão estática se necessário.
- Resolver explicitamente o papel do **GitHub Pages**, pois uma página estática não executa SSR.

## 11. Principais riscos e medidas de mitigação

| Risco                                  | Mitigação de planejamento                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| Vazamento de acesso administrativo     | Autenticação consolidada, autorização em cada rota, MFA/passkey e segredos isolados  |
| API e banco tornarem o blog mais lento | SSR seletivo, cache e medições antes/depois                                          |
| Conteúdo perdido ou corrompido         | Backup, histórico, exportação, validação, transações e rollback                      |
| Rascunhos locais desaparecem           | Avisos de persistência, recuperação/exportação; reavaliar salvamento remoto          |
| Plano gratuito insuficiente            | Monitorar cotas, estimar consumo, política de gastos e plano de migração             |
| SEO prejudicado                        | HTML renderizado no servidor para conteúdo importante, sitemap e metadados dinâmicos |
| Espelho GitHub Pages desatualizado     | Decisão explícita sobre o papel do espelho antes de migrar rotas                     |
| Migração de schemas alterar notas      | Testes de equivalência com os registros reais e cálculos atuais                      |
| Exclusões por engano                   | Confirmação, arquivamento, histórico e recuperação                                   |

## 12. Decisões pendentes — checklist para conversas futuras

- [ ] Escolher autenticação após comparação prática de segurança, recuperação e manutenção.
- [ ] Decidir se o acesso ao painel e à API será protegido por um gateway de identidade, solução dentro da API, ou ambos.
- [ ] Escolher runtime e hospedagem da API própria.
- [ ] Escolher banco e modelagem, após revisar schemas reais e volume de conteúdo.
- [ ] Escolher R2, Cloudinary, Supabase Storage ou outro serviço com base em cota real e workflow de imagens.
- [ ] Definir como serão implementados preview, histórico, exclusão e recuperação.
- [ ] Decidir quais rotas Astro precisam de SSR e quais permanecem estáticas.
- [ ] Definir cache, invalidação, sitemap dinâmico e SEO para novos slugs.
- [ ] Definir o futuro do espelho GitHub Pages sem comprometer sua versão atual.
- [ ] Definir plano de migração de conteúdo com backup, testes de paridade e rollback.
- [ ] Validar custo mensal e riscos das camadas gratuitas na data de implantação.
- [ ] Fazer análise de segurança antes de expor operações administrativas.

## 13. Critérios para autorizar uma implementação futura

A implementação de EVO-03 só deve ser proposta depois de:

1. EVO-01 e EVO-02 terem decisões explícitas documentadas e aprovadas pelo autor.
2. Haver arquitetura de referência, modelo de confiança e matriz de risco.
3. Ser demonstrado como preservar o blog em produção, os URLs e o design.
4. Existir estratégia de migração, backup, recuperação e rollback.
5. Estarem identificadas as cotas, restrições e responsabilidades dos serviços externos.
6. Ser definido um MVP administrativo pequeno, com critérios de aceitação e testes.
7. O autor autorizar expressamente o escopo, dependências e operações de Git.

**Não executar** migração, criação de repositórios, banco, API, autenticação, contas de provedores, integração de deploy ou mudanças nas páginas públicas apenas com base neste documento.

## 14. Relação com a documentação vigente

Este arquivo fica intencionalmente separado, em `docs/planejamento-futuro/PAINEL_ADMINISTRATIVO.md`, e **não substitui**:

- `docs/ARCHITECTURE.md`: arquitetura atual implementada.
- `docs/REQUIREMENTS.md`: requisitos vigentes do blog.
- `docs/ROADMAP.md`: tarefas EVO-01, EVO-02 e EVO-03 ainda pendentes.
- `docs/CONTENT_GUIDE.md`: formato e regras editoriais existentes.
- `AGENTS.md`: regras de trabalho e exigência de autorização do autor.

Se uma decisão futura divergir desses documentos, **discutir e aprovar a mudança antes de alterar o projeto**. Revisar este planejamento conforme novas informações forem obtidas, sem tratar hipóteses como decisões definitivas.
