describe("CT-SIFAP-CAR-F01 - Criação de proposta", () => {
  beforeEach(() => {
    cy.fixture("criar-conta").then((usuario) => {
      cy.typeLogin(usuario.email, usuario.senha);
      cy.get('[data-cy="user-menu"]').should("be.visible");
    });
  });

  it('deve exibir o botão "Criar Proposta" para o edital vigente', () => {
    cy.acessarEditalSigCypress();

    cy.get('[data-cy="criar-proposta"]')
      .should("be.visible")
      .and("be.enabled");
  });
});
