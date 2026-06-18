describe("CT-SIFAP-COO-F03.03 - Dados academicos", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve registrar os dados academicos do coordenador", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteDadosAcademicos(propostaUnica);
      cy.preencherDadosAcademicosCoordenador(propostaUnica);
      cy.contains("button", /^Salvar$/i).click({ force: true });
      cy.contains("Salvo com sucesso!", { matchCase: false }).should(
        "be.visible"
      );
      cy.contains(":visible", "UFMS", { matchCase: false }).should(
        "be.visible"
      );
      cy.contains(":visible", "FACOM", { matchCase: false }).should(
        "be.visible"
      );
      cy.contains("Currículo Lattes").should("be.visible");
    });
  });
});
