describe("CT-SIFAP-CAR-F02.02 - Informacoes complementares", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve exibir e permitir responder as perguntas configuradas no edital", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.iniciarPropostaSigCypress();
      cy.preencherInformacoesIniciaisProposta(propostaUnica);
      cy.adicionarAreaConhecimentoProposta();
      cy.avancarEtapaProposta();
      cy.preencherInformacoesComplementaresProposta(propostaUnica);

      cy.get(`[data-cy="${propostaUnica.informacaoComplementarOpcao}"]`)
        .first()
        .find('input[type="radio"]')
        .should("be.checked");
      cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-219"]')
        .should("have.value", propostaUnica.informacaoComplementarTexto);
    });
  });
});
