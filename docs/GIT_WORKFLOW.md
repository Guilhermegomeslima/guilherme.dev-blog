# Fluxo de trabalho Git

> **Status:** proposta pronta para revisão · **Versão:** 0.1 · **Atualizado:** 2026-11-07
> Complementa `REQUIREMENTS.md` e `ARCHITECTURE.md`. O projeto é individual.

## 1. Objetivo e decisões

- **[CONFIRMADO]** Começar apenas com a branch `main`.
- **[CONFIRMADO]** Manter commits pequenos, com escopo de funcionalidade ou etapa específica.
- **[PROPOSTO]** Usar Conventional Commits em português ou inglês de forma consistente. Os exemplos abaixo usam inglês para os tipos e português para as descrições.
- **[PROPOSTO]** `main` deve permanecer executável: cada commit de implementação deve passar nas verificações aplicáveis.
- **[PROPOSTO]** Criar branch temporária somente para uma mudança grande, arriscada ou experimental. Não é obrigatório criar PR em um projeto individual.

## 2. Ciclo de trabalho por tarefa

1. Escolher **um ID** de `ROADMAP.md` e confirmar objetivo e critérios de aceitação.
2. Consultar documentos relevantes e verificar o estado atual do repositório (`git status`).
3. Determinar arquivos a modificar. Se houver implicação arquitetural, propor a mudança antes de codificar.
4. Implementar **somente** o escopo combinado; não incluir funcionalidades futuras por antecipação.
5. Executar as verificações pertinentes: formatação, checagens do Astro/TypeScript, testes e build, **apenas se os comandos estiverem configurados**.
6. Revisar o diff: `git diff`, `git diff --check`, arquivos novos e possíveis segredos.
7. Relatar ao autor o que mudou, como verificar e qual mensagem de commit faria sentido.
8. **Solicitar autorização para executar `git add`, `git commit`, `git push`, criar branch ou fazer merge**. A aprovação deve abranger a operação proposta.
9. Após commit autorizado, registrar hash ou link e atualizar o roadmap. Se a atualização do roadmap exigir outro commit, tratá-la como `docs` ou incluí-la no commit autorizado quando isso tiver sido combinado.

> O Antigravity pode **sugerir** mensagens e comandos de Git, mas não deve executar operações que alterem o histórico/remoto sem autorização.

## 3. Convenção de commits

Formato:

```text
tipo(escopo): descrição curta no imperativo
```

Tipos sugeridos:

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidade nova |
| `fix` | Correção de comportamento defeituoso |
| `docs` | Documentação |
| `style` | Formatação visual ou de código sem alteração de comportamento |
| `refactor` | Reorganização sem nova funcionalidade |
| `perf` | Melhoria de desempenho |
| `test` | Testes |
| `chore` | Configuração, tooling e manutenção |
| `ci` | Automação de integração/entrega |

Exemplos planejados — **não representam commits existentes**:

```text
docs(planning): documenta requisitos e roadmap inicial
chore(astro): inicializa projeto Astro
chore(styles): configura Tailwind CSS 4
feat(layout): adiciona cabecalho e rodape globais
feat(home): cria apresentacao inicial
feat(about): implementa pagina sobre
feat(games): adiciona calculo de media das avaliacoes
test(ratings): cobre limites e calculo das notas
fix(nav): corrige menu recolhivel no mobile
```

Evitar mensagens como `ajustes`, `mudanças`, `update` e misturar alterações independentes no mesmo commit.

## 4. Tamanho e organização dos commits

Uma entrega pode conter **vários commits menores**, por exemplo:
- Estrutura e tipos;
- Componente e apresentação;
- Testes e documentação pertinente.

Não fracionar artificialmente alterações inseparáveis. Um commit deve representar uma mudança coerente e deixar o repositório em estado compreensível. Separar formatação maciça de modificações de lógica.

## 5. Branches

**Fluxo padrão:** trabalhar na `main` localmente e publicar depois de verificar e autorizar.

Quando fizer sentido isolar uma tarefa:
- Criar `feat/identificador-curto` ou `fix/identificador-curto`;
- Desenvolver e testar;
- Revisar o diff;
- Integrar à `main` somente após autorização do autor;
- Excluir a branch temporária quando ela não for mais necessária.

Não exigir PR, code review externo ou regras de proteção como pré-requisito ao MVP.

## 6. Segurança e recuperação

- Nunca versionar `.env`, tokens, senhas, chaves privadas, credenciais de deploy ou dados pessoais sensíveis.
- Conferir `.gitignore` e o resultado de `git status` antes de adicionar arquivos.
- Não usar automaticamente `git reset --hard`, `git clean -fd`, `git push --force`, rebase destrutivo ou exclusões em massa.
- Não reverter trabalho existente sem investigar sua origem.
- Preferir `git revert` para desfazer um commit já compartilhado, após autorização.
- Antes de trocar configurações de infraestrutura, explicar impacto e possível reversão.
- Conteúdo e imagens remotas devem respeitar atribuição, licença e política registrada em `CONTENT_GUIDE.md`.

## 7. Qualidade mínima antes de publicar

- [ ] Mudança atende aos critérios de aceitação da tarefa.
- [ ] Não existem alterações não relacionadas no diff.
- [ ] Comandos configurados relevantes foram executados ou impedimentos foram relatados.
- [ ] Páginas envolvidas foram verificadas visualmente em desktop e mobile quando houver mudança de UI.
- [ ] Links, navegação por teclado, contraste e textos alternativos foram considerados.
- [ ] Nenhuma credencial ou arquivo local confidencial está incluído.
- [ ] Mensagem de commit representa o que foi realmente entregue.

## 8. Relação com o roadmap

- `ROADMAP.md` registra tarefas, status, dependências e referência de commit/PR.
- Status **Concluído** pressupõe critérios de aceitação verificados.
- Pode existir implementação pronta **aguardando autorização de commit**; isso não equivale a publicação.
- Não definir datas fictícias: prazo é opcional.

## 9. Pendências

- **[PENDENTE]** Identidade do repositório e URL remota.
- **[PENDENTE]** Comandos exatos de lint, format, check e test após inicialização.
- **[PENDENTE]** Hospedagem e política de deploy.
