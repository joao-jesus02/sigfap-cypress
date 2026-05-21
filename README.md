# CYPRESS SIGFAP

# Pré-requisitos

Para a realização do trabalho, serão necessários conhecimentos prévios e a instalação de algumas ferramentas, listadas abaixo.

## Ferramentas

Antes de começar, certifique-se de que as seguintes ferramentas estejam instaladas em seu computador.

- [git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- [npm](https://docs.npmjs.com/cli/v11/commands/npm-install) 
- [pnpm](https://pnpm.io/installation)
- [Visual Studio Code](https://code.visualstudio.com/)

> **Obs.1:** Ao instalar o Node.js, o npm é instalado junto.
>
> **Obs.2:** Para verificar as versões do git, Node.js e npm instaladas em seu computador, execute o comando `git --version && node --version && npm --version` em seu terminal de linha de comando.
>
> **Obs.3:** Recomendamos a utilização do Visual Studio Code, entretanto, também poderá ser utilizada uma IDE de sua preferência.
>
> **Obs.4:** Caso utilize o Visual Studio Code, recomendamos a instalação da Extensão `Prettier - Code formatter`.

## Conhecimentos

É necessário que você possua ao menos conhecimentos básicos de:

- JavaScript e TypeScript
- Seletores CSS
- Linha de comando
- git

# Fork e clone do projeto

1. Abra o navegador e visite a URL [\[LINK\]](https://github.com/Eiji-Akamine/sigfap-cypress)
2. Faça um [fork](<(https://docs.github.com/en/get-started/quickstart/fork-a-repo)>) do projeto.

> É importante que você trabalhe em seu fork, para que ao final do trabalho, você possa executar os testes em um _workflow_ de integração contínua.

3. Em seu fork, clique no botão **Code**, escolha a opção _clone via SSH_ e copie o link de clone do projeto.

> Para obter detalhes sobre como criar e configurar uma chave SSH no GitHub, leia a [documentação oficial](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh/about-ssh).

4. Em seu terminal de linha de comando (em uma pasta onde você armazena seus projetos de software), execute o comando `git clone https://github.com/Eiji-Akamine/sigfap-cypress`.

> Para garantir que você está clonando seu fork corretamente, verifique seu nome de usuário do GitHub na URL de clone do projeto. Deve ser semelhante a `git@github.com:[seu-nome de usuário-aqui]/sigfap-cypress`.

5. Após clonar o projeto, acesse o diretório recém-clonado (`cd sig-cypress/`).

# Instalação e inicialização do [Cypress](https://cypress.io)

1. Na raiz do projeto, execute o comando `pnpm init -y` para inicializar um projeto npm, isso é feito para que o projeto contenha um arquivo package.json
2. Na raiz do projeto, execute o comando `pnpm add cypress --save-dev`.
3. Execute o comando `pnpm cypress open` para abrir o Cypress pela primeira vez, o ambiente e2e de testes já está configurado.
4. Este será o ambiente de testes Cypress, antes de iniciar os testes feche o _Cypress_App_ e faça a leitura das instruções abaixo.

> **Obs.:** Quando o _Cypress App_ é iniciado pela primeira vez sem ser previamente configurado, o Cypress mostra opções de inicialização recomendadas.

# Modulos Adicionais

## [Cypress Real Events](https://github.com/dmtrKovalenko/cypress-real-events?tab=readme-ov-file#cyrealtype)

Para instalar o real-events:

> pnpm install cypress-real-events

E no arquivo tsconfig.json adicione o real events:

> "types": ["cypress", "node", "cypress-real-events"]

## Change Case e Remove Accents

Instale as dependências faltantes: No diretório do seu projeto, rode:

> pnpm add -D change-case remove-accents

# Começando o trabalho

## Explicando o teste exemplo - Criar conta

Abra o arquivo `criar-conta.cy.ts`, este é um teste e2e (end to end) que realiza o preenchimento de dados de um usuário e cria a conta no sistema.

- O `describe` é utilizado para agrupar os testes relacionados a criação de conta no sistema. Ele serve como um contêiner para organizar os testes e fornecer uma descrição clara do que está sendo testado.
- O `context` é utilizado para fornecer um contexto adicional para os testes dentro do describe. Ele pode ser usado para agrupar testes relacionados a um cenário específico, como "Criação de conta com dados válidos" ou "Criação de conta com dados inválidos". Isso ajuda a organizar os testes e torna mais fácil entender o que está sendo testado em cada cenário.
- O `it` é utilizado para definir um teste específico dentro do grupo de testes criado pelo describe. Ele descreve o comportamento esperado do sistema em relação à criação de conta. O nome do teste deve ser claro e descritivo, indicando o que está sendo testado.
- `cy.typeLogin` é uma função customizada cypress criada dentro do arquivo `/support/commands.ts`.
- Os comandos Básicos do Cypress podem ser consultados em: [Cypress](https://example.cypress.io)
- Lista de comandos que devem ser estudados:

```text
cy.get()
cy.contains()
Best Practices: Selecting elements
cy.type()
cy.clear()
cy.click()
cy.check()
cy.uncheck()
cy.each()
cy.then()
cy.should()
Cypress.Commands.add()
Cypress.config()
cy.fixture()
cy.selectFile()
```

> Obs: Este arquivo foi comentado linha a linha para facilitar a compreensão básica do funcionamento do teste com cypress, no dia a dia utilizamos comentários apenas para fluxos ou funcionalidades mais complexas.

---

## Introdução - Alteração dos Dados pra criar seu usuário:

## Teste Criar Conta

1. Alterar os Dados da fixture

- Na fixture `fixtures/criar-conta.json`
  - Altere os dados para caracterizar o seu usuário

2. Abra o Cypress e execute novamente o teste

**Resultado esperado:**

Após a realização do Teste Cypress se espera que o a conta com os dados alterados na fixture seja criada.

## Passo a passo:

1. No prompt execute `pnpm cypress open`
2. A janela do Cypress irá abrir, clique em `E2E Testing`
3. Execute com o browser a sua escolha e clique em `Start E2E Testing in`
4. O browser escolhido irá abrir com a lista de specs(testes)
5. Clique no teste `criar-conta.cy.ts`
6. Acompanhe a execução do teste.

> Obs: Diante da leitura e compreensão básica do teste `criar-conta.cy.ts` e do texto da solicitação agora vamos ao trabalho.

---

## Atividade 1 - Realizar o Teste Completar Cadastro

1. Crie um novo teste e2e: `completar-cadastro.cy.ts`.
2. Crie uma fixture para o teste: `completar-cadastro.json` e adicione todos os dados que serão usados para completar o cadastro.
3. Para simular upload de arquivos adicione o arquivo dentro da pasta fixtures
4. Neste teste resolva a solicitação abaixo:

## Fluxo do Teste de Completar Cadastro do Usuário

1. O usuário faz login no sistema.
2. O usário vai para a área perfil (icone no canto superior direito, opção "Perfil").
3. Vai para sub-seção "Endereço" e preenche os campos vindos da fixture e salvar.
4. Vai para sub-seção "Dados Acadêmicos" e preenche os campos vindos da fixture e salvar.
5. Vai para sub-seção "Dados Profissionais" e preenche os campos vindos da fixture e salvar.
6. Vai para sub-seção "Documentos Pessoais" e submete os arquivos e salvar.

**Resultado esperado:**

Após a realização do Teste Cypress se espera que o usuário tenha todos os dados preenchidos.

**Recomendações:**

- Faça um teste `it` para cada sub-seção, assim dividindo bem o objetivo de cada parte do teste.
- Utilize o `beforeEach` para comandos que se repetem em cada `it`.

---

## Atividade 2 - Realizar o Teste Submeter Proposta

1. Crie um novo teste e2e: `submeter-proposta.cy.ts`.
2. Crie uma fixture para o teste: `submeter-proposta.json` e adicione todos os dados que serão usados para completar o cadastro.
3. Para simular upload de arquivos adicione o arquivo dentro da pasta fixtures
4. Neste teste resolva a solicitação abaixo:

## Fluxo do Teste Submenter uma proposta

1. O usuário faz login no sistema.
2. O usuário vai para área com todos os editais abertos (Clicar no botão `Ver Mais` na tabela `Editais Abertos` na home do sistema).
3. Procura o edital [Edital 2026-0001 Sig Cypress] e clica no botão `Visualizar Edital`.
4. Verifica se está no edital de interesse e clica no botão `Criar Proposta`.
5. Vai para seção "Caracterização" e preenche e salva a cada sub-seção.
6. Vai para seção "Coordenação" e preenche e salva a cada sub-seção.
7. Vai para seção "Apresentação" e preenche e salva a cada sub-seção.
8. Vai para seção "Anexos" e preenche e salva a cada sub-seção.
9. Vai para seção "Finalização" e preenche e salva a cada sub-seção.
10. Quando os dados forem preenchidos clica no botão `Verificar Pendências`.
11. Clica no botão `Submeter Prosposta` para enviar a proposta criada.

**Resultado esperado:**

Após a realização do Teste Cypress se espera que o usuário tenha conseguido preencher todos os dados da Submissão da Proposta e submete-la.

**Recomendações:**

- Faça um teste `it` para cada sub-seção, assim dividindo bem o objetivo de cada parte do teste.
- Utilize o `beforeEach` para comandos que se repetem em cada `it`.
- Após o primeiro teste da sub-seção `Informações Iniciais` ao preencher os campos e salvar, a Proposta já pode ser vista na área de Propostas/Projetos e para testes sub-sequentes pode ser realizada uma edição para continuar o preenchimento passo a passo da Proposta.

---

# Entregas

1. O Aluno/Grupo deve entregar os arquivos `completar-cadastro.cy.ts` e `submeter-proposta.cy.ts` e <u>demais arquivos complementares, se houverem,</u> dentro de suas respectivas pastas, em sua Fork de desenvolvimento.
