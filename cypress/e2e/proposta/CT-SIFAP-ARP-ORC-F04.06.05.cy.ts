describe("CT-SIFAP-ARP-ORC-F04.06.05 - Solicitado a Fundacao", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve exibir o valor solicitado a fundacao", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteSolicitadoFundacao(propostaUnica);
      cy.contains(/Solicitado à Fundação/i).should("be.visible");
      cy.contains(/Total|Valor|R\$/i).should("exist");
    });
  });
});
