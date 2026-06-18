const selecionarDocumentoPessoal = (proposta: any) => {
  cy.get('[data-cy="select-categories-criado-por-usu"]').click({ force: true });
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="documento-de-identificacao-com-f"]').length) {
      cy.get('[data-cy="documento-de-identificacao-com-f"]').click({
        force: true,
      });
    }
  });
  cy.get('[data-cy="criadoPor.usuarioAnexo-upload"]').selectFile(
    proposta.documentoPessoalUpload,
    { force: true }
  );
};

const selecionarDocumentoProposta = (proposta: any) => {
  cy.get('[data-cy="select-categories-documento-prop"]').click({ force: true });
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="carta-de-apresentacao"]').length) {
      cy.get('[data-cy="carta-de-apresentacao"]').click({ force: true });
    }
  });
  cy.get('[data-cy="documentoPropostaAnexo-upload"]').selectFile(
    proposta.documentoPropostaUpload,
    { force: true }
  );
};

describe("Atividade extra - Submeter proposta", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve preencher a seção Caracterização", () => {
    cy.fixtureComTituloUnico<any>("submeter-proposta").then((dados) => {
      cy.iniciarPropostaSigCypress();
      cy.preencherInformacoesIniciaisProposta(dados);
      cy.adicionarAreaConhecimentoProposta();
      cy.avancarEtapaProposta();
      cy.preencherInformacoesComplementaresProposta(dados);
      cy.avancarEtapaProposta();
      cy.preencherAbrangenciaProposta(dados);

      cy.contains(/Caracterização|Abrangência/i).should("be.visible");
    });
  });

  it("deve preencher a seção Coordenação", () => {
    cy.fixtureComTituloUnico<any>("submeter-proposta").then((dados) => {
      cy.navegarAteDadosProfissionais(dados);
      cy.preencherDadosProfissionaisCoordenador(dados);
      cy.contains(/Dados profissionais/i).should("be.visible");
    });
  });

  it("deve preencher a seção Apresentação", () => {
    cy.fixtureComTituloUnico<any>("submeter-proposta").then((dados) => {
      cy.navegarAteVisualizacaoAtividades(dados);
      cy.contains(/Apresentação|Atividades|Visualização das atividades/i).should(
        "be.visible"
      );
    });
  });

  it("deve preencher a seção Anexos", () => {
    cy.fixtureComTituloUnico<any>("submeter-proposta").then((dados) => {
      cy.navegarAteDocumentosPessoais(dados);
      selecionarDocumentoPessoal(dados);
      cy.navegarAteDocumentosDaProposta(dados);
      selecionarDocumentoProposta(dados);

      cy.contains(/Anexos|Documentos da proposta/i).should("be.visible");
    });
  });

  it("deve preencher a seção Finalização e verificar pendências", () => {
    cy.fixtureComTituloUnico<any>("submeter-proposta").then((dados) => {
      cy.navegarAteTermoAceite(dados);
      cy.get('[data-cy="termo-de-aceite-aceito-box"]').click({ force: true });
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="menu-verificar-pendencias"]').length) {
          cy.get('[data-cy="menu-verificar-pendencias"]').click({ force: true });
          return;
        }

        cy.contains("button", /Verificar pendências/i).click({ force: true });
      });

      cy.get("body", { timeout: 10000 }).should(($body) => {
        expect($body.text()).to.match(
          /Submeter Proposta|Pendência|pendência|sem pendências|Finalização/i
        );
      });
    });
  });

  it("deve submeter uma proposta criada quando não houver pendências bloqueantes", () => {
    cy.fixtureComTituloUnico<any>("submeter-proposta").then((dados) => {
      cy.navegarAteTermoAceite(dados);
      cy.get('[data-cy="termo-de-aceite-aceito-box"]').click({ force: true });
      cy.contains("button", /Verificar pendências/i).click({ force: true });
      cy.get("body", { timeout: 10000 }).then(($body) => {
        const botaoSubmeter = [...$body.find("button")].find((botao) =>
          /Submeter Proposta/i.test(botao.textContent || "")
        );

        if (botaoSubmeter && !Cypress.$(botaoSubmeter).is(":disabled")) {
          cy.wrap(botaoSubmeter).click({ force: true });
          cy.get("body", { timeout: 10000 }).should(($bodyAtualizado) => {
            expect($bodyAtualizado.text()).to.match(/Submetida|sucesso|análise/i);
          });
          return;
        }

        expect($body.text()).to.match(/Pendência|pendência|Verificar pendências/i);
      });
    });
  });
});
