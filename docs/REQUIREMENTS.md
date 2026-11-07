# Requisitos do blog pessoal

> **Status:** rascunho para revisão · **Versão:** 0.1 · **Atualizado:** 2026-11-07  
> **Papel:** fonte principal do **que** construir. Decisões de implementação detalhadas ficam em `ARCHITECTURE.md`.

## Convenções

- **[CONFIRMADO]**: decisão expressa pelo autor do projeto.
- **[PROPOSTO]**: recomendação de planejamento, sujeita à aprovação.
- **[PENDENTE]**: exige decisão posterior; não assumir automaticamente.
- **[FUTURO]**: intenção conhecida, fora do MVP.

## 1. Visão e objetivos

**[CONFIRMADO]** Construir um blog pessoal multipáginas que seja simultaneamente:

1. Um projeto de desenvolvimento de software significativo, público no GitHub, demonstrando organização, código e evolução por commits.
2. Um espaço de apresentação de conhecimentos, trajetória, projetos e interesses pessoais.
3. Um acervo pessoal de conteúdos sobre tecnologia, Linux, jogos, filmes, música, leitura, software livre, imagens e artigos.

**[CONFIRMADO] Público inicial:** o próprio autor, amigos e possíveis visitantes do LinkedIn. Não se trata primariamente de loja, serviço comercial ou landing page de vendas.

**[PROPOSTO] Princípios:** autenticidade, conteúdo legível, organização sustentável, boa experiência em telas distintas, baixo custo operacional e espaço para evolução sem reescrita desnecessária.

## 2. Escopo de páginas

| Seção       | Intenção                                                                                                    | Planejamento                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Home        | Apresentação breve e acesso às áreas do site                                                                | [CONFIRMADO] MVP                                                            |
| Sobre       | Perfil, gostos e conhecimentos técnicos                                                                     | [CONFIRMADO] MVP                                                            |
| Projetos    | Projetos de programação e links para código                                                                 | [CONFIRMADO] pós-MVP                                                        |
| Linux       | Experiências, preferências, configuração e trajetória                                                       | [CONFIRMADO] pós-MVP                                                        |
| Jogos       | Catálogo, opiniões e avaliações com cinco critérios (Mecânica, Enredo, Estética, Retenção, Feeling)         | [CONFIRMADO] pós-MVP                                                        |
| Filmes      | Catálogo, opiniões e avaliações com seis critérios (Direção, Roteiro, Audiovisual, Atuação, Ritmo, Feeling) | [CONFIRMADO] pós-MVP                                                        |
| Música      | Bandas, músicas, álbuns e indicações                                                                        | [CONFIRMADO] pós-MVP                                                        |
| Open Source | Ferramentas e recomendações                                                                                 | [CONFIRMADO] pós-MVP                                                        |
| Artigos     | Publicações autorais                                                                                        | [CONFIRMADO] pós-MVP                                                        |
| Galeria     | Imagens e wallpapers                                                                                        | [CONFIRMADO] pós-MVP                                                        |
| Livros      | Leituras e avaliações                                                                                       | [PROPOSTO] confirmar página própria; mencionada no planejamento e nos cards |

**[PROPOSTO]** Cada área poderá ter uma listagem e páginas de detalhes quando o conteúdo justificar. Evitar criar páginas vazias e links sem destino no MVP; se aparecerem na navegação, sinalizar “em breve” ou ocultar temporariamente.

## 3. Estrutura conceitual da Home

**[CONFIRMADO]** A Home deverá conter:

1. **Cabeçalho:** identidade do autor + navegação multipáginas, acessível e recolhível quando necessário.
2. **Hero:** apresentação curta em destaque; redação final ainda não decidida.
3. **Sobre resumido:** interesses em programação, Linux, leitura e possivelmente xadrez; conhecimentos técnicos apresentados sem inventar experiências ou habilidades.
4. **Cards/quadros de navegação:** atalhos para as outras áreas, com imagem ou elemento visual e breve explicação.
5. **Rodapé:** links para redes sociais, especialmente GitHub e LinkedIn, e informação de autoria.

**[PROPOSTO]** O hero e os cards podem usar composições editoriais assimétricas; a navegação deve permanecer clara mesmo quando o visual for mais expressivo.

## 4. Funcionalidades

| ID    | Requisito                                                                      | Prioridade / fase | Estado                             |
| ----- | ------------------------------------------------------------------------------ | ----------------- | ---------------------------------- |
| RF-01 | Navegar entre páginas por links claros e utilizáveis por teclado               | MVP               | [CONFIRMADO]                       |
| RF-02 | Exibir Home com apresentação, resumo Sobre e cards/atalhos                     | MVP               | [CONFIRMADO]                       |
| RF-03 | Exibir rodapé com links sociais                                                | MVP               | [CONFIRMADO]                       |
| RF-04 | Menu adaptável, recolhível em telas menores                                    | MVP               | [CONFIRMADO]                       |
| RF-05 | Exibir conteúdos de arquivos locais em páginas temáticas                       | Pós-MVP           | [CONFIRMADO]                       |
| RF-06 | Pesquisa em conteúdo publicado                                                 | Pós-MVP           | [CONFIRMADO]; mecanismo [PENDENTE] |
| RF-07 | Filtros nos catálogos pertinentes                                              | Pós-MVP           | [CONFIRMADO]; critérios [PENDENTE] |
| RF-08 | Galeria de imagens/wallpapers                                                  | Pós-MVP           | [CONFIRMADO]                       |
| RF-09 | Páginas de artigos e conteúdos autorais com URLs próprias                      | Pós-MVP           | [PROPOSTO]                         |
| RF-10 | Adicionar/alterar artigos e registros editando Markdown/JSON localmente        | Inicial           | [CONFIRMADO]                       |
| RF-11 | Área administrativa própria, privada, acessível por navegador, para publicação | Futuro            | [FUTURO], sem CMS de terceiros     |

**Observação:** somente o autor publica conteúdo. **No MVP não existirá login, painel administrativo, API de escrita ou banco de dados.** O site público não receberá edições por visitantes.

## 5. Conteúdo e publicação

**[CONFIRMADO]** No início, o conteúdo fica em arquivos versionados no repositório: Markdown/MDX quando houver texto longo; JSON para registros estruturados, conforme a modelagem posterior. Publicar significa editar conteúdo, validar, fazer commit/push e disparar um novo deploy. MDX é opcional, não obrigatório.

**[CONFIRMADO]** No futuro, o autor quer publicar de fora do ambiente local por meio de **solução própria**, sem depender de um painel/CMS de terceiros. Isto é um objetivo futuro, **não** uma exigência de infraestrutura agora. Sua implementação exigirá decisões separadas sobre identidade, autenticação, escrita, proteção, armazenamento e deploy.

**[CONFIRMADO] Avaliações:** jogos têm cinco critérios (**Mecânica, Enredo, Estética, Retenção, Feeling**) e filmes têm seis (**Direção, Roteiro, Audiovisual, Atuação, Ritmo, Feeling**). Cada critério recebe nota de **0 a 100**. A **Nota** é a média aritmética simples dos critérios correspondentes, sem pesos. Nos filmes, **Diretor** e **Ano/lançamento** são informações descritivas, não notas. A formatação/arredondamento será definido posteriormente no `CONTENT_GUIDE.md`.

**[PROPOSTO]** Conteúdos estruturados ficam separados dos componentes visuais. Alterar uma avaliação não deve requerer editar o código de um card. Dados inválidos devem ser detectados no build.

## 6. Imagens

**[CONFIRMADO]** A primeira versão poderá consumir imagens remotas por URLs públicas. Futuramente poderá haver um armazenamento externo dedicado.

**[PROPOSTO]** Google Imagens deve ser usado somente como mecanismo de descoberta, não como fonte de hospedagem. Registrar URL da **origem**, autoria/licença/crédito quando aplicável, descrição alternativa e uma imagem substituta para links quebrados. Evitar hotlink em sites que o proíbam, imagens sem autorização ou links de cache/miniaturas do Google. Ver `CONTENT_GUIDE.md`.

**[PENDENTE]** Provedor de mídia definitivo, política de thumbnails, limites de tamanho e estratégia de cache.

## 7. Requisitos não funcionais

| ID     | Requisito           | Critério proposto                                                                                             |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| RNF-01 | Responsividade      | Experiência funcional em celular, tablet e desktop; sem rolagem horizontal involuntária                       |
| RNF-02 | Desempenho          | Páginas predominantemente estáticas; minimizar JavaScript e mídia pesada                                      |
| RNF-03 | Acessibilidade      | HTML semântico, navegação por teclado, foco visível, contraste e respeito a movimento reduzido                |
| RNF-04 | SEO                 | Títulos e descrições individuais, URLs previsíveis, sitemap e metadados de compartilhamento quando publicados |
| RNF-05 | Segurança           | Nenhum segredo no repositório; validar URLs/dados; minimizar dependências e superfície de ataque              |
| RNF-06 | Compatibilidade     | Navegadores modernos e diferentes tamanhos de tela; testar mobile real ou emulação                            |
| RNF-07 | Modularidade        | Layouts, componentes, conteúdo e estilos com responsabilidades bem separadas                                  |
| RNF-08 | Manutenção          | Build reproduzível, formatação consistente, documentação e mudanças em pequenos commits                       |
| RNF-09 | Consistência visual | Mesma identidade visual em todas as páginas, adaptada à função de cada seção                                  |

**SEO, em poucas palavras:** medidas que permitem aos buscadores interpretar e apresentar o conteúdo do site. Não significa garantia de posição nas buscas.

## 8. Identidade visual

**[CONFIRMADO]** Direção escolhida para todas as páginas: **cyberpunk cinematográfico**, inspirada na atmosfera de _Blade Runner_, partindo do primeiro protótipo criado no Figma Make. Tema **somente escuro** inicialmente; moderno, tecnológico e fluido. As seções podem ter layouts próprios, mas compartilham identidade visual.

**[PROPOSTO]** Fundo preto azulado, detalhes em ciano e magenta, imagens urbanas noturnas, contraste editorial, tipografia marcante, títulos contornados com moderação, cards assimétricos. Paleta e valores precisos são **temporários** e constam no `DESIGN_SYSTEM.md`.

**Referência escolhida:** https://www.figma.com/make/rcvx0jQ0gfulTn1owpG3bd/Blog-Pessoal-Cyberpunk?t=P4xgPHVx9xefWPZk-1

Não copiar literalmente marcas, artes ou elementos protegidos dos filmes. A referência é de **atmosfera**, não de reprodução de franquia.

## 9. MVP — primeira versão entregável

**[CONFIRMADO] Escopo básico:** Home, Sobre e links de redes sociais no rodapé.

**[PROPOSTO] Critérios de aceitação para considerar o MVP funcional:**

- [ ] Aplicação Astro inicia localmente e gera build estático sem erros.
- [ ] Home apresenta introdução, resumo e atalhos apenas para destinos válidos ou claramente futuros.
- [ ] Página Sobre contém texto editável sobre o autor, sem dados fictícios tratados como reais.
- [ ] Cabeçalho e navegação funcionam no desktop e celular.
- [ ] Rodapé contém links sociais corretos quando fornecidos.
- [ ] Tema escuro consistente e legível; sem rolagem horizontal indevida.
- [ ] Sem páginas quebradas, segredos ou ferramentas de publicação privada desnecessárias.
- [ ] README documenta como executar, testar e publicar.

## 10. Fora do MVP / evolução

**[CONFIRMADO]** O objetivo final inclui as demais seções e funcionalidades planejadas. **[FUTURO]** Painel administrativo próprio e fluxo remoto de publicação. **[PROPOSTO]** Pesquisa, filtros, páginas individuais e galeria entram incrementalmente conforme a seção correspondente amadurecer.

Não antecipar login, banco de dados, CMS, analytics, comentários, serviços pagos ou integrações sociais sem necessidade e aprovação.

## 11. Pendências explícitas

1. [PENDENTE] Nome público definitivo, domínio e URLs sociais finais.
2. [PENDENTE] Hospedagem final (Vercel é candidata, não decisão fechada).
3. [PENDENTE] Paleta final, fontes e detalhes de comportamento do menu.
4. [PENDENTE] Conteúdo textual final da Home e Sobre.
5. [PENDENTE] Campos e filtros definitivos de cada catálogo.
6. [PENDENTE] Detalhes adicionais dos dados de filmes, livros e música (os critérios e cálculo de filmes já estão definidos).
7. [PENDENTE] Política completa de mídias e origem das imagens.
8. [PENDENTE] Confirmar se Livros terá seção própria e qual nível de destaque na navegação.

## 12. Política de mudanças

Mudanças no escopo passam por revisão deste arquivo. Uma sugestão da IA ou de uma ferramenta de design não se torna requisito confirmado sem aprovação. Arquitetura, design e modelagem devem respeitar este documento.
