describe("CT-SIFAP-CAR-F01 - Criação de proposta", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it('deve exibir o botão "Criar Proposta" para o edital vigente', () => {
    cy.acessarEditalSigCypress();

    cy.get('[data-cy="criar-proposta"]')
      .should("be.visible")
      .and("be.enabled");
  });
});
