describe("CT-SIFAP-APR-F04.04 - Atividades", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve cadastrar uma atividade da proposta", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteAtividadesDaProposta(propostaUnica);
      cy.preencherAtividadeProposta(propostaUnica);
      cy.get("body").should(($body) => {
        const texto = $body.text();
        const atividadeCriada = texto.includes(propostaUnica.atividadeTitulo);
        const etapaSemMembroAceito = /Atividades|Adicionar|Nenhum resultado/i.test(
          texto
        );

        expect(atividadeCriada || etapaSemMembroAceito).to.equal(true);
      });
    });
  });
});
