describe("CT-SIFAP-ARP-ORC-F04.06.04 - Consolidacao", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve exibir a consolidacao financeira do orcamento", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteConsolidacao(propostaUnica);
      cy.contains(/Consolidação/i).should("be.visible");
      cy.contains(/Total|Valor|R\$/i).should("exist");
    });
  });
});
