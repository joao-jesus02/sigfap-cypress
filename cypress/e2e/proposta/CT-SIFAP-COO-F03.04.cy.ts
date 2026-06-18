describe("CT-SIFAP-COO-F03.04 - Dados profissionais", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve salvar o vinculo institucional do coordenador", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteDadosProfissionais(propostaUnica);
      cy.preencherDadosProfissionaisCoordenador(propostaUnica);
      cy.contains("button", /^Salvar$/i).click({ force: true });
      cy.get('[data-cy="possui-vinculo-institucional"]').should("be.checked");
    });
  });
});
