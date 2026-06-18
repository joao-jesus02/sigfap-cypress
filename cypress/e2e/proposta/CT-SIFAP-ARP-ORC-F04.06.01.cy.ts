describe("CT-SIFAP-ARP-ORC-F04.06.01 - Faixa de financiamento", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve registrar uma faixa de financiamento da proposta", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteFaixaFinanciamento(propostaUnica);
      cy.get('[data-cy="search-faixa-financiamento-id"]').click({ force: true });
      cy.get('[role="option"], [data-componentid="options-list"] div')
        .filter(":visible")
        .first()
        .click({ force: true });
      cy.contains("button", /^Salvar$/i).click({ force: true });

      cy.get('[data-cy="search-faixa-financiamento-id"]')
        .invoke("val")
        .should((valor) => {
          expect(String(valor || "").trim().length).to.be.greaterThan(0);
        });
    });
  });
});
