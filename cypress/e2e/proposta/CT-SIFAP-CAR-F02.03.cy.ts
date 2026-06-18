describe("CT-SIFAP-CAR-F02.03 - Abrangencia", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve cadastrar a abrangencia da proposta", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteAbrangencia(propostaUnica);
      cy.preencherAbrangenciaProposta(propostaUnica);

      cy.contains("Mato Grosso do Sul", { matchCase: false }).should(
        "be.visible"
      );
      cy.contains("Campo Grande", { matchCase: false }).should("be.visible");
    });
  });
});
