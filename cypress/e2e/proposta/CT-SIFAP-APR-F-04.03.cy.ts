describe("CT-SIFAP-APR-F-04.03 - Membros da proposta", () => {
  beforeEach(() => {
    cy.intercept("PUT", "**/api/usuario/editar-perfil").as("editarPerfil");
    cy.loginUsuarioPadrao();
  });

  it('deve enviar convite ao membro com status "Pendente"', () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteMembrosDaProposta(propostaUnica);
      cy.get('[data-cy="nome-do-pesquisador"]').type(
        propostaUnica.membroPesquisador
      );
      cy.contains(propostaUnica.membroPesquisador, { matchCase: false }).click();
      cy.contains("button", /^Adicionar$/i).click();
      cy.get('[data-cy="sim-continuar-button"]').click();
      cy.get('[data-cy="confirmar-button"]').click();

      cy.contains(propostaUnica.membroPesquisador, { matchCase: false }).should(
        "be.visible"
      );
      cy.contains("Pendente", { matchCase: false }).should("be.visible");
    });
  });
});
