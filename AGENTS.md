# AGENTS.md — instruções para agentes de desenvolvimento

> **Status:** proposta para aprovação · **Versão:** 0.2 · **Atualizado:** 2026-11-14 (identidade visual atualizada para o Design System 2.0)
> Este documento define como o Antigravity (ou outro agente) deve trabalhar **neste repositório**.
> O agente NÃO está autorizado a iniciar tarefas novas, publicar, fazer commits ou alterar arquitetura por conta própria.

## 1. Contexto do projeto

Blog pessoal e portfólio multipáginas, em português, desenvolvido com:

- Astro + TypeScript + Tailwind CSS 4;
- saída estática (SSG) no início, sem backend/banco de dados;
- Markdown para conteúdo narrativo e JSON para registros estruturados;
- tema escuro global; identidade vigente: **Design System 2.0** ("arquivo pessoal nas sombras": preto dominante, tipografia serifada editorial, vermelho envelhecido como acento). A identidade anterior (cyberpunk/Blade Runner, ciano e magenta) está preservada em `docs/DESIGN_SYSTEM.md` como histórico e ainda vigora nas páginas internas até suas etapas VIS;
- Home, Sobre e rodapé com redes sociais como primeiro MVP;
- outras seções acrescentadas gradualmente, conforme `ROADMAP.md`;
- publicação local via arquivos/commits; painel próprio remoto apenas futuramente.

**Fonte de verdade:**

1. `REQUIREMENTS.md` — escopo e decisões;
2. `ARCHITECTURE.md` — organização técnica;
3. `DESIGN_SYSTEM_V2.md` — **referência visual vigente** (aparência, acessibilidade, migração); `DESIGN_SYSTEM.md` — identidade anterior, tokens atuais em uso e histórico;
4. `CONTENT_GUIDE.md` — conteúdo, dados e médias;
5. `ROADMAP.md` — ordem, escopo e aceitação;
6. `GIT_WORKFLOW.md` — versionamento.

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

### Jogos — critérios obrigatórios, escala 0–100

- Mecânica (`mechanics`)
- Enredo (`plot`)
- Estética (`aesthetics`)
- Retenção (`retention`)
- Feeling (`feeling`)

**Nota = (soma dos cinco critérios) / 5.** Sem pesos adicionais.

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

- Validar 0 ≤ nota ≤ 100 e presença dos critérios exigidos;
- Calcular notas por função TypeScript compartilhada, sem duplicar a lógica no card;
- Não inserir `finalScore` manual divergente do cálculo;
- **Casas decimais de exibição estão pendentes:** não escolher arbitrariamente uma regra definitiva;
- Testar limites e médias com entradas representativas.

## 5. Design e experiência

- Preservar identidade escura em **todas as páginas**. A referência visual vigente é `DESIGN_SYSTEM_V2.md`; a Home aprovada (gravação e `docs/references/`) prevalece sobre qualquer exemplo ilustrativo.
- A migração segue as etapas **VIS-01 a VIS-07** do `ROADMAP.md`. Durante a migração, os **tokens e estilos da V2 são escopados à Home** (e aos componentes de layout aprovados); as páginas internas mantêm a aparência atual até a etapa própria. Não alterar tokens compartilhados de `global.css` sem etapa VIS aprovada.
- Não modificar dados, avaliações, schemas, rotas ou imagens de conteúdo por motivos visuais.
- Fotografias e fontes da V2 só entram após verificação de origem/licença e aprovação do autor; não extrair imagens de capturas de tela.
- Histórico: a referência anterior (Figma "Blog-Pessoal-Cyberpunk") foi substituída:
  https://www.figma.com/make/rcvx0jQ0gfulTn1owpG3bd/Blog-Pessoal-Cyberpunk?t=P4xgPHVx9xefWPZk-1
- Priorizar legibilidade sobre efeitos: contraste suficiente, foco visível, movimento reduzido respeitado.
- Implementar responsividade desde cada entrega, inclusive menu mobile.
- Garantir controles acessíveis por teclado e respeitar `prefers-reduced-motion`.
- Evitar animações pesadas, bibliotecas desnecessárias e JavaScript excessivo.

## 6. Imagens e segurança

- Inicialmente, imagens externas por URL, com metadados e fallback quando necessário.
- Google Imagens é ferramenta de busca, não hospedagem. Não usar URL de miniatura/cache como fonte permanente.
- Verificar permissões de uso, origem, crédito e possíveis bloqueios de hotlink.
- Não adicionar credenciais, tokens ou segredos ao repositório.
- Não executar comandos destrutivos, mudanças de permissões globais ou operações de deploy sem autorização.
- Não substituir arquivos ou alterações do autor por suposições.

## 7. Qualidade e relatório final

Executar verificações **que estejam configuradas e sejam pertinentes**. Exemplos após a inicialização (os scripts concretos podem ser diferentes):

```bash
npm run check
npm run build
npm run test
```

Não adicionar comandos fictícios ao relatório. Se algum script não existir, registrar isso e propor configuração somente se estiver no escopo.

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

- MVP não inclui CMS, painel próprio, login, busca complexa, banco ou API.
- Não criar todas as páginas do roadmap simultaneamente.
- Não marcar tarefas concluídas sem validação.
- Não atualizar documentos para encobrir uma divergência de implementação; propor correção explícita.
- Quando uma decisão nova for aprovada, atualizar a documentação relevante junto da entrega autorizada.

## 9. Conduta em caso de dúvida

Perguntar somente quando a dúvida impedir uma implementação correta ou exigir decisão do proprietário. Para detalhes reversíveis de baixa importância, escolher uma opção simples, reportá-la e manter a arquitetura modular.
