describe("CT-SIFAP-APR-F04.01 - Descricao da proposta", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve registrar as respostas da descricao da proposta", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteDescricaoProposta(propostaUnica);
      cy.preencherDescricaoProposta(propostaUnica);

      cy.get('[data-cy^="formularioPropostaDescritiva.pergunta-"]')
        .filter(":visible")
        .last()
        .should("have.value", propostaUnica.descricaoTexto);
    });
  });
});
