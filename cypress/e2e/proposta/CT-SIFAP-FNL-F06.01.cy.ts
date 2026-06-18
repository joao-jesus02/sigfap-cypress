describe("CT-SIFAP-FNL-F06.01 - Visualizacao da proposta", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve exibir o resumo da proposta antes da submissao", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteVisualizacaoProposta(propostaUnica);
      cy.contains(/Visualização da Proposta/i).should("be.visible");
      cy.get("body").should(($body) => {
        const texto = $body.text();
        const resumoExibido =
          texto.includes(propostaUnica.tituloProjeto) ||
          /Edital 2026-0001 Sig Cypress|Caracterização|Coordenação|Apresentação/i.test(
            texto
          );

        expect(resumoExibido, "resumo da proposta exibido").to.equal(true);
      });
    });
  });
});
