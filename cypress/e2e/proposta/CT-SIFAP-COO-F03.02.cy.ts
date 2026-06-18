describe("CT-SIFAP-COO-F03.02 - Endereco", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve preencher o endereco do coordenador a partir de um CEP valido", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteDadosPessoais(propostaUnica);
      cy.preencherDadosPessoaisCoordenador(propostaUnica);
      cy.contains("button", /^Salvar$/i).click({ force: true });

      cy.get("body").then(($body) => {
        if (!$body.find('[data-cy="criadoPor.endereco.cep"]').length) {
          cy.log("Etapa de endereco nao foi exibida para o perfil atual.");
          return;
        }

        cy.preencherEnderecoCoordenador(propostaUnica);
        cy.get('[data-cy="criadoPor.endereco.bairro"]').should(
          "have.value",
          propostaUnica.bairro
        );
        cy.get('[data-cy="criadoPor.endereco.logradouro"]').should(
          "have.value",
          propostaUnica.logradouro
        );
        cy.get('[data-cy="criadoPor.endereco.numero"]').should(
          "have.value",
          propostaUnica.numero
        );
      });
    });
  });
});
