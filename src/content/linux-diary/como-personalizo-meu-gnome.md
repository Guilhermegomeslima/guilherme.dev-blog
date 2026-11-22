---
title: 'Como personalizo meu GNOME'
description: 'Como personalizo o GNOME no Fedora Workstation 45 usando o Extension Manager e extensões como Dash to Dock, Blur my Shell, ArcMenu e Hide Top Bar — tudo pela interface gráfica.'
category: 'tutoriais'
level: 'iniciante_intermediario'
environment:
  distro: 'Fedora Workstation 45'
  desktop: 'GNOME'
  testedVersions: []
tags:
  - 'GNOME'
  - 'Fedora'
  - 'Personalização'
  - 'Extensões'
coverImage:
  url: '/images/linux-diary/gnome-personalizacao/desktop-personalizado-limpo.webp'
  alt: 'Desktop Fedora com GNOME personalizado em tema escuro, exibindo a dock inferior e a barra superior discreta'
  caption: 'Meu desktop GNOME personalizado com tema escuro e dock inferior.'
featured: true
publishedAt: 2026-11-22T12:00:00
draft: false
isDemo: false
---

Uma das coisas que mais gosto no Linux é poder deixar o sistema com a aparência que eu quiser. Atualmente utilizo o Fedora com GNOME e, embora goste bastante desse ambiente gráfico, confesso que sua aparência padrão não me agrada tanto.

Principalmente aquela barra superior que fica sempre visível.

No meu caso, o objetivo da personalização é bem simples: deixar o desktop mais bonito e agradável de usar. Não procuro transformar completamente o GNOME nem instalar dezenas de temas. Prefiro utilizar extensões que modificam alguns elementos visuais e acrescentam funcionalidades interessantes.

Neste tutorial, vou mostrar como personalizo meu GNOME, quais extensões utilizo e como faço as principais configurações.

Tudo isso usando uma interface gráfica, sem precisar ficar executando comandos no terminal.

## 1. Preparando o ambiente

Antes de começar, vale esclarecer que este tutorial foi pensado com base no meu ambiente: Fedora Workstation 45 com GNOME.

Você também pode aproveitar essas extensões em outras distribuições que utilizam GNOME, mas os procedimentos e a compatibilidade podem variar conforme a versão instalada.

Meu desktop utiliza o tema escuro, que pode ser selecionado nas configurações de aparência do próprio GNOME.

O principal recurso que utilizo para personalizar o ambiente é o **Extension Manager**, também chamado de Gerenciador de Extensões.

### Instalando o Extension Manager

O Extension Manager é um aplicativo desenvolvido por Matthew Jakeman que permite pesquisar, instalar, ativar, desativar e configurar extensões do GNOME.

Eu utilizo a versão distribuída pelo Flathub.

Para instalar:

1. Acesse a página do Extension Manager no Flathub.
2. Escolha a opção de instalação.
3. Siga as instruções oferecidas para seu sistema.
4. Após a instalação, abra o Gerenciador de Extensões pelo menu de aplicativos.

**Link:** [https://flathub.org/pt-BR/apps/com.mattjakeman.ExtensionManager](https://flathub.org/pt-BR/apps/com.mattjakeman.ExtensionManager)

Se o botão do Flathub não abrir um instalador gráfico, consulte as instruções de configuração do Flatpak para sua distribuição.

<img src="/images/linux-diary/gnome-personalizacao/flathub-extension-manager.webp" alt="Página do aplicativo Extension Manager no Flathub com botão de instalação" title="Página do Extension Manager no Flathub." width="1920" height="1080" />

### Como instalar extensões

Com o Gerenciador de Extensões aberto:

1. Acesse a área de pesquisa ou exploração de extensões.
2. Digite o nome da extensão desejada.
3. Abra o resultado correspondente.
4. Verifique se ela é compatível com sua versão do GNOME.
5. Instale a extensão.
6. Depois, acesse a lista de extensões instaladas para ativá-la e abrir suas preferências, quando disponíveis.

É assim que costumo instalar minhas extensões. Acho muito mais prático centralizar tudo em um aplicativo.

<img src="/images/linux-diary/gnome-personalizacao/extension-manager-instaladas.webp" alt="Janela do Gerenciador de Extensões listando as extensões instaladas no GNOME" title="Minhas extensões instaladas no GNOME, gerenciadas pelo Extension Manager." width="1920" height="1080" />

## 2. Dash to Dock: configurando minha dock

A primeira extensão que recomendo configurar é o **Dash to Dock**.

Ela permite transformar o dash do GNOME em uma dock mais acessível e personalizável.

Eu prefiro deixar a dock na parte inferior da tela, com um visual discreto e sem ocupar espaço desnecessário.

Para começar, pesquise por **Dash to Dock** no Gerenciador de Extensões e instale a extensão compatível com sua versão do GNOME.

Depois, abra suas preferências.

### Minhas configurações

Estas são as opções que utilizo:

| Configuração       | Meu ajuste  |
| ------------------ | ----------- |
| Posição            | Inferior    |
| Ocultação          | Inteligente |
| Tamanho dos ícones | 48 px       |
| Limite de tamanho  | 90%         |
| Encolher dock      | Ativado     |
| Opacidade          | Dinâmica    |

A posição inferior é uma preferência visual minha.

Também gosto da ocultação inteligente, porque a dock não precisa permanecer ocupando espaço o tempo inteiro.

O tamanho de 48 pixels deixa os ícones confortáveis para visualizar e clicar, sem ficarem exageradamente grandes.

Já o limite de 90%, combinado com a opção de encolher a dock, ajuda a manter um formato que considero mais equilibrado.

Por fim, utilizo opacidade dinâmica, permitindo que a aparência da dock se adapte às situações previstas pela extensão.

<div class="v2-editorial-pair">
  <figure class="v2-editorial-pair-item">
    <div class="v2-editorial-pair-stage">
      <img src="/images/linux-diary/gnome-personalizacao/dash-to-dock-posicao-tamanho.webp" alt="Preferências do Dash to Dock na aba Posição e tamanho mostrando posição inferior, ocultação inteligente, limite de 90%, modo painel desativado e tamanho de ícones em 48 px" title="Preferências do Dash to Dock: aba Posição e tamanho." data-lightbox-group="gnome-dash-to-dock" width="751" height="849" />
    </div>
    <figcaption class="v2-editorial-pair-caption">Aba Posição e tamanho: posição inferior, ocultação inteligente, limite de 90% e ícones em 48 px.</figcaption>
  </figure>
  <figure class="v2-editorial-pair-item">
    <div class="v2-editorial-pair-stage">
      <img src="/images/linux-diary/gnome-personalizacao/dash-to-dock-aparencia.webp" alt="Preferências do Dash to Dock na aba Aparência mostrando opção de encolher o dash ativada e opacidade dinâmica" title="Preferências do Dash to Dock: aba Aparência." data-lightbox-group="gnome-dash-to-dock" width="751" height="849" />
    </div>
    <figcaption class="v2-editorial-pair-caption">Aba Aparência: encolher o dash ativado e modo de opacidade dinâmica.</figcaption>
  </figure>
</div>

<img src="/images/linux-diary/gnome-personalizacao/dash-to-dock-resultado.webp" alt="Detalhe da dock inferior configurada pelo Dash to Dock com ícones alinhados e fundo translúcido" title="Resultado do Dash to Dock com meus ajustes." width="881" height="94" />

Você não precisa utilizar exatamente os mesmos valores. Eles representam apenas a configuração que mais me agrada.

## 3. Blur my Shell: transparência e desfoque

Outra extensão que considero importante para a aparência do meu GNOME é o **Blur my Shell**.

Como o próprio nome sugere, ela acrescenta efeitos de desfoque a elementos da interface.

Eu gosto desse tipo de efeito porque ele deixa o desktop visualmente mais interessante, especialmente com o tema escuro.

Para instalar, basta pesquisar **Blur my Shell** no Gerenciador de Extensões.

### Como utilizo

Nas minhas preferências, utilizo:

- Desfoque estático transparente.
- Opção de substituição do plano de fundo.

Essas configurações ajudam a produzir a aparência que gosto no meu ambiente.

> [!WARNING]
> **Importante:** a localização e o nome exato dessas opções podem variar conforme a versão da extensão.

<!-- Nota editorial (EXP-04B.2): conferir esta etapa com uma captura das preferências do Blur my Shell antes da publicação definitiva. -->

Não considero necessário configurar todos os efeitos disponíveis. Prefiro manter somente aqueles que contribuem para o resultado visual que procuro.

<!-- Slot editorial pendente (CAPTURA 04): inserir aqui a captura real dos efeitos visuais ou preferências do Blur my Shell quando fornecida pelo autor. -->

## 4. ArcMenu e Hide Top Bar: ajustando a barra superior

A barra superior é uma das coisas que mais me incomodam no GNOME padrão.

Gosto bastante do ambiente, mas não acho necessário manter aquela barra visível em todas as situações.

Para ajustar isso, utilizo duas extensões: **ArcMenu** e **Hide Top Bar**.

### ArcMenu

O ArcMenu adiciona um menu de aplicativos personalizável ao GNOME.

No meu ambiente, deixo o botão do ArcMenu no canto superior esquerdo da barra.

Essa posição me agrada porque facilita o acesso aos aplicativos e combina com a organização que escolhi para o desktop.

Para instalar:

1. Pesquise por **ArcMenu** no Gerenciador de Extensões.
2. Instale uma versão compatível.
3. Ative a extensão.
4. Abra suas preferências, caso precise ajustar o posicionamento.

No meu caso, a principal característica que quero reproduzir é o acesso ao menu pelo canto superior esquerdo.

<img src="/images/linux-diary/gnome-personalizacao/desktop-arcmenu-aberto.webp" alt="Desktop GNOME com o ArcMenu aberto no canto superior esquerdo exibindo aplicativos fixados e busca" title="O ArcMenu no canto superior esquerdo do meu GNOME." width="1920" height="1080" />

### Hide Top Bar

O **Hide Top Bar** é especialmente importante para o resultado que procuro.

Ele permite ocultar automaticamente a barra superior do GNOME, oferecendo mais espaço na tela e deixando o ambiente visualmente mais limpo.

Um dos recursos disponíveis é o _intellihide_, que permite ocultar a barra quando uma janela ocupa seu espaço, em vez de mantê-la escondida permanentemente.

Na minha configuração, percebo esse comportamento principalmente quando utilizo aplicativos em tela cheia: a barra superior desaparece e posso fazê-la reaparecer aproximando o mouse da borda superior da tela.

Esse detalhe é justamente um dos motivos pelos quais gosto tanto da extensão. A barra continua acessível quando preciso, mas não fica o tempo inteiro ocupando espaço.

Para instalar:

1. Abra o Gerenciador de Extensões.
2. Pesquise por **Hide Top Bar**.
3. Instale uma versão compatível com seu GNOME.
4. Ative a extensão.
5. Abra suas preferências.
6. Confira as opções relacionadas à ocultação inteligente e à revelação da barra ao aproximar o mouse da borda superior.

> [!WARNING]
> **Atenção:** o comportamento depende das opções escolhidas. Em determinadas configurações, a barra também pode ser ocultada quando uma janela maximizada ocupa sua região, não apenas em tela cheia.

Por isso, vale testar a extensão abrindo, maximizando e colocando aplicativos em tela cheia para descobrir qual comportamento você prefere.

<img src="/images/linux-diary/gnome-personalizacao/desktop-barra-superior-visivel.webp" alt="Desktop GNOME exibindo a barra superior visível antes da ocultação automática pelo Hide Top Bar" title="Desktop com a barra superior visível antes da ocultação automática." width="1920" height="1080" />

<!-- Slot editorial pendente (CAPTURA 07): inserir aqui a captura real demonstrando a barra superior oculta pelo Hide Top Bar quando fornecida pelo autor. -->

## 5. Minhas outras seis extensões

Além das quatro extensões principais, utilizo outras seis que acrescentam pequenas funcionalidades ao GNOME.

Não fiz configurações especiais nelas. Por isso, vou apresentá-las de maneira mais objetiva.

### AppIndicator and KStatusNotifierItem Support

Essa extensão oferece suporte a indicadores de aplicativos na área do painel, permitindo que determinados programas exibam seus ícones de status.

### Mpris Label

Utilizo essa extensão para integrar informações de reprodução de mídia à interface do GNOME.

Ela é um complemento interessante para quem costuma ouvir música enquanto utiliza o computador.

### Tiling Assistant

O Tiling Assistant acrescenta recursos relacionados à organização e ao posicionamento de janelas.

É uma alternativa para quem deseja mais possibilidades ao distribuir aplicativos pela tela.

### Desktop Icons NG

Essa extensão adiciona suporte a ícones na área de trabalho do GNOME.

Ela pode ser interessante para quem gosta de manter arquivos, pastas ou atalhos diretamente no desktop.

### Caffeine

O Caffeine permite controlar temporariamente comportamentos de inatividade do sistema, como o bloqueio ou a suspensão automática, conforme os recursos suportados pela extensão.

Pode ser útil em situações em que você não deseja interrupções desse tipo.

### Add to Desktop

O Add to Desktop oferece recursos para facilitar a criação ou adição de atalhos na área de trabalho.

Como utilizo também o Desktop Icons NG, essas duas extensões podem complementar o uso de atalhos no desktop.

### Vale a pena instalar todas?

Não necessariamente.

Essas são as extensões que utilizo, mas cada pessoa pode escolher apenas aquelas que fazem sentido para seu próprio ambiente.

Se o objetivo for reproduzir principalmente minha aparência visual, eu começaria pelas quatro anteriores:

**Dash to Dock, Blur my Shell, ArcMenu e Hide Top Bar.**

As demais podem ser instaladas conforme a necessidade.

<img src="/images/linux-diary/gnome-personalizacao/extension-manager-instaladas.webp" alt="Lista completa das dez extensões instaladas no Gerenciador de Extensões do GNOME" title="As dez extensões que utilizo no meu GNOME." width="1920" height="1080" />

## 6. Resultado da personalização

Depois de instalar e configurar as extensões, o GNOME fica com uma aparência bem mais próxima do que gosto.

A dock aparece na parte inferior, o ArcMenu fica à esquerda, os efeitos de desfoque complementam o tema escuro e a barra superior passa a ter um comportamento que considero mais agradável.

Não se trata de transformar completamente o GNOME em outro ambiente gráfico.

A ideia é manter o que gosto nele e modificar aquilo que me incomoda.

E, para mim, o resultado fica muito mais bonito que a aparência padrão.

### Antes e depois

<div class="v2-editorial-pair">
  <figure class="v2-editorial-pair-item">
    <div class="v2-editorial-pair-stage">
      <img src="/images/linux-diary/gnome-personalizacao/gnome-padrao-antes.webp" alt="Área de trabalho do GNOME em sua aparência padrão com barra superior fixa e sem dock visível" title="Antes: GNOME padrão." data-lightbox-group="gnome-antes-depois" width="763" height="402" />
    </div>
    <figcaption class="v2-editorial-pair-caption">Antes: GNOME padrão, com a barra superior sempre visível e sem dock fixa.</figcaption>
  </figure>
  <figure class="v2-editorial-pair-item">
    <div class="v2-editorial-pair-stage">
      <img src="/images/linux-diary/gnome-personalizacao/desktop-personalizado-limpo.webp" alt="Desktop Fedora com GNOME personalizado após os ajustes de extensões, tema escuro e dock inferior" title="Depois: GNOME personalizado." data-lightbox-group="gnome-antes-depois" width="1024" height="576" />
    </div>
    <figcaption class="v2-editorial-pair-caption">Depois: meu GNOME personalizado com tema escuro, dock inferior e barra superior ajustada.</figcaption>
  </figure>
</div>

## 7. Atualizações e manutenção

Extensões do GNOME podem precisar de atualizações quando uma nova versão do ambiente gráfico é lançada.

Por isso, antes de atualizar ou instalar uma extensão, vale conferir se ela oferece suporte à versão do GNOME que você utiliza.

O próprio Extension Manager facilita o acompanhamento das extensões instaladas.

Se alguma extensão começar a apresentar problemas, uma boa primeira medida é desativá-la temporariamente e verificar se o comportamento do desktop volta ao normal.

Também recomendo evitar instalar muitas extensões que modificam exatamente o mesmo elemento da interface, já que elas podem entrar em conflito.

Pessoalmente, não tive dificuldades relevantes com minha configuração, mas isso não significa que todas as combinações funcionarão igualmente em outros sistemas.

## Considerações finais

Personalizar o GNOME é uma das coisas que mais gosto de fazer no Fedora.

Não porque o ambiente padrão seja ruim, mas porque existem alguns detalhes visuais que simplesmente não combinam com minhas preferências.

A barra superior sempre visível é um bom exemplo.

Com algumas extensões e poucos ajustes, consigo deixar o desktop mais bonito e com o comportamento que prefiro, sem precisar fazer modificações profundas no sistema.

O mais interessante é que praticamente todo o processo pode ser feito pelo Gerenciador de Extensões, utilizando uma interface gráfica.

Para quem está começando no GNOME, minha sugestão é experimentar uma extensão por vez, conhecer suas opções e descobrir quais ajustes realmente fazem diferença.

Essa é a configuração que utilizo atualmente e que pretendo continuar ajustando conforme minhas preferências mudarem.
