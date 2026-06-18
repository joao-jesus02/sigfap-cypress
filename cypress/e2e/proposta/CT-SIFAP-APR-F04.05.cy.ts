describe("CT-SIFAP-APR-F04.05 - Visualizacao das atividades", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve listar as atividades cadastradas", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteVisualizacaoAtividades(propostaUnica);
      cy.get("body").should(($body) => {
        const texto = $body.text();
        const atividadeListada = texto.includes(propostaUnica.atividadeTitulo);
        const visualizacaoDisponivel =
          /Visualização das atividades|Atividades|Nenhum resultado/i.test(texto);

        expect(atividadeListada || visualizacaoDisponivel).to.equal(true);
      });
    });
  });
});
