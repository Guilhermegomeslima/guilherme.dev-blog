# AGENTS.md — instruções para agentes de desenvolvimento

> **Status:** instruções vigentes para manutenção do site em produção · **Revisado:** 2026-11-15.
> **Escopo desta revisão:** somente o estado implementado; propostas de evolução não são tarefas autorizadas.
> Este documento define como o Antigravity (ou outro agente) deve trabalhar **neste repositório**.
> O agente NÃO está autorizado a iniciar tarefas novas, publicar, fazer commits ou alterar arquitetura por conta própria.

## 1. Contexto do projeto

Blog pessoal e portfólio multipáginas, em português, desenvolvido com:

- Astro + TypeScript + Tailwind CSS 4;
- saída **estática (SSG) em produção**, sem backend de administração, API de escrita ou banco de dados;
- Markdown para conteúdo narrativo e JSON para registros estruturados;
- identidade visual vigente em todas as páginas: **Design System 2.0** ("arquivo pessoal nas sombras": preto dominante, tipografia serifada editorial, vermelho envelhecido como acento). O cyberpunk/Blade Runner é histórico, documentado em `docs/DESIGN_SYSTEM.md`;
- MVP, seções de conteúdo e migração visual VIS-01 a VIS-07 já concluídos conforme `docs/ROADMAP.md`;
- conteúdo local em oito Astro Content Collections (Markdown para artigos/projetos e JSON para catálogos);
- publicação de conteúdo atual por alterações de arquivos + Git + build/deploy; Vercel principal e GitHub Pages espelho;
- propostas de administração remota registradas como pendentes no roadmap, fora do escopo de manutenção atual.

**Fonte de verdade:**

1. `docs/REQUIREMENTS.md` — escopo e decisões;
2. `docs/ARCHITECTURE.md` — organização técnica;
3. `docs/DESIGN_SYSTEM_V2.md` — **referência visual vigente** (aparência, acessibilidade, padrões atuais); `docs/DESIGN_SYSTEM.md` — identidade anterior preservada como histórico;
4. `docs/CONTENT_GUIDE.md` — conteúdo, dados e médias;
5. `docs/ROADMAP.md` — ordem, escopo e aceitação;
6. `docs/GIT_WORKFLOW.md` — versionamento.

Se houver contradições entre documentos, **não escolha silenciosamente**. Aponte o conflito e peça uma decisão antes de implementar a parte afetada. Uma instrução explícita posterior do autor pode alterar decisões, mas documente o impacto.

## 2. Procedimento obrigatório ao receber tarefa

1. Ler a solicitação e os documentos relacionados.
2. Examinar a estrutura existente e `git status` sem alterar arquivos.
3. Identificar tarefa(s) do roadmap e critérios de aceitação. Se a solicitação não existir no roadmap, propor onde ela se encaixa.
4. **Antes de editar**, apresentar um plano curto:
   - objetivo e escopo;
   - arquivos previstos;
   - dependências ou riscos;
   - como testar;
   - o que ficará explicitamente fora do escopo.
5. Aguardar aprovação do plano quando houver alteração significativa de arquitetura, novas dependências, operação destrutiva ou decisão em aberto.
6. Implementar somente o autorizado; preservar alterações preexistentes.
7. Executar testes/checagens disponíveis para a mudança; não afirmar que executou comandos que não rodaram.
8. Entregar resumo dos arquivos modificados, resultados, limitações e sugestão de commit.
9. **Não executar `git add`, `git commit`, `git push`, merge, rebase ou criar branch sem autorização explícita do autor.**

## 3. Restrições arquiteturais

- Preferir Astro e HTML semântico; JavaScript de navegador apenas para interações necessárias.
- Não introduzir React, Vue, Svelte, bibliotecas UI, CMS, banco de dados, backend ou autenticação sem necessidade demonstrada e aprovação.
- Não adicionar dependências só por conveniência; justificar custo, manutenção e impacto.
- Separar conteúdo, apresentação e regras de negócio.
- Reutilizar componentes, mas evitar abstrações prematuras.
- Respeitar a versão efetivamente instalada de Astro e Tailwind CSS; conferir APIs antes de aplicar exemplos genéricos.
- Centralizar configurações compartilhadas, como navegação, links sociais e tokens visuais.
- Evitar rotas falsas e links quebrados. Não inventar URLs pessoais nem fatos biográficos.
- Não copiar código de protótipos Figma sem revisão técnica, de acessibilidade e de licença.

## 4. Regras de conteúdo e avaliações

### Jogos — critérios de avaliação, escala 0–100

- Mecânica (`mechanics`)
- Enredo (`plot`)
- Estética (`aesthetics`)
- Retenção (`retention`)
- Feeling (`feeling`)

**Nota = média aritmética simples dos critérios aplicáveis, sem pesos.** O código aceita `plot: null` quando Enredo não se aplica, calculando a média dos quatro restantes; quando todos são numéricos, divide por cinco. Fonte: `src/utils/ratings.ts` e `src/content.config.ts`.

### Filmes — critérios obrigatórios, escala 0–100

- Direção (`direction`)
- Roteiro (`screenplay`)
- Audiovisual (`audiovisual`)
- Atuação (`acting`)
- Ritmo (`pacing`)
- Feeling (`feeling`)

**Nota = (soma dos seis critérios) / 6.** Sem pesos adicionais.

`director` (diretor) e `releaseYear` (ano de lançamento) são **metadados**, não critérios.

Regras:

- Validar 0 ≤ cada nota numérica ≤ 100; em Jogos, aceitar `plot: null` conforme o schema vigente;
- Calcular notas por função TypeScript compartilhada, sem duplicar a lógica no card;
- Não inserir `finalScore` manual divergente do cálculo;
- Preservar `formatScore`: mostrar inteiro quando exato ou uma casa decimal nos demais casos;
- Testar limites e médias com entradas representativas.

## 5. Design e experiência

- Preservar identidade escura em **todas as páginas**. A referência visual vigente é `docs/DESIGN_SYSTEM_V2.md`; a Home aprovada (gravação e `docs/references/`) prevalece sobre qualquer exemplo ilustrativo.
- A migração **VIS-01 a VIS-07 está concluída**, e a V2 usa tokens compartilhados em `src/styles/global.css`. Não reintroduzir tokens legados nem alterar aparência global sem aprovação.
- Não modificar dados, avaliações, schemas, rotas ou imagens de conteúdo por motivos visuais.
- Fotografias e fontes da V2 só entram após verificação de origem/licença e aprovação do autor; não extrair imagens de capturas de tela.
- Histórico: a referência anterior (Figma "Blog-Pessoal-Cyberpunk") foi substituída:
  https://www.figma.com/make/rcvx0jQ0gfulTn1owpG3bd/Blog-Pessoal-Cyberpunk?t=P4xgPHVx9xefWPZk-1
- Priorizar legibilidade sobre efeitos: contraste suficiente, foco visível, movimento reduzido respeitado.
- Implementar responsividade desde cada entrega, inclusive menu mobile.
- Garantir controles acessíveis por teclado e respeitar `prefers-reduced-motion`.
- Evitar animações pesadas, bibliotecas desnecessárias e JavaScript excessivo.

## 6. Imagens e segurança

- Imagens públicas locais em `public/images/` e URLs externas presentes nos registros; preservar caminhos, créditos e alternativas acessíveis.
- Google Imagens é ferramenta de busca, não hospedagem. Não usar URL de miniatura/cache como fonte permanente.
- Verificar permissões de uso, origem, crédito e possíveis bloqueios de hotlink.
- Não adicionar credenciais, tokens ou segredos ao repositório.
- Não executar comandos destrutivos, mudanças de permissões globais ou operações de deploy sem autorização.
- Não substituir arquivos ou alterações do autor por suposições.

## 7. Qualidade e relatório final

Executar verificações configuradas e pertinentes. O comando `npm run verify` executa checagem Astro/TypeScript, testes, formatação, build e auditoria de integridade. Em mudanças relevantes, conferir também o build do espelho (`GITHUB_ACTIONS=true npm run build`):

```bash
npm run verify
GITHUB_ACTIONS=true npm run build
```

Não relatar execução de comandos não realizados; não alegar teste de navegador ou Core Web Vitals sem medição real.

Modelo de entrega:

```text
Tarefa: <ID + título>
Implementado: <resumo>
Arquivos modificados: <lista>
Verificações executadas: <comandos + resultados reais>
Limitações / pendências: <itens>
Commit sugerido: tipo(escopo): descrição
Aguardando autorização para commit: sim
```

## 8. Regras de escopo e evolução

- O site em produção não contém CMS, painel próprio, login, banco ou API administrativa; não introduzir esses recursos em tarefas de manutenção.
- Não reabrir automaticamente fases concluídas nem avançar para itens EVO pendentes.
- Não marcar tarefas concluídas sem validação.
- Não atualizar documentos para encobrir uma divergência de implementação; propor correção explícita.
- Quando uma decisão nova for aprovada, atualizar a documentação relevante junto da entrega autorizada.

## 9. Conduta em caso de dúvida

Perguntar somente quando a dúvida impedir uma implementação correta ou exigir decisão do proprietário. Para detalhes reversíveis de baixa importância, escolher uma opção simples, reportá-la e manter a arquitetura modular.
