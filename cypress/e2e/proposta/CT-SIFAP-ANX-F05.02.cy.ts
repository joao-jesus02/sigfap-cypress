describe("CT-SIFAP-ANX-F05.02 - Documentos da proposta", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve anexar um documento da proposta valido", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteDocumentosDaProposta(propostaUnica);
      cy.get('[data-cy="select-categories-documento-prop"]').click({
        force: true,
      });
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="carta-de-apresentacao"]').length) {
          cy.get('[data-cy="carta-de-apresentacao"]').click({ force: true });
        }
      });

      cy.get('[data-cy="documentoPropostaAnexo-upload"]').selectFile(
        {
          contents: Cypress.Buffer.from("documento-proposta-cypress"),
          fileName: propostaUnica.documentoPropostaNome,
          mimeType: "application/pdf",
        },
        { force: true }
      );

      cy.contains(propostaUnica.documentoPropostaNome, { matchCase: false }).should(
        "be.visible"
      );
    });
  });
});
