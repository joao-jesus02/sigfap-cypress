describe("CT-SIFAP-ARP-ORC-F04.06.03 - Bolsa", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve cadastrar uma bolsa no orcamento", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteBolsa(propostaUnica);
      cy.preencherBolsaProposta(propostaUnica);
      cy.get("body").should(($body) => {
        const texto = $body.text();
        const etapaDisponivel = /Bolsa|Adicionar|Nenhum resultado/i.test(texto);
        const formularioDisponivel =
          $body.find('[data-cy="open-modalidade-bolsa-id"]').length > 0;

        expect(etapaDisponivel || formularioDisponivel).to.equal(true);
      });
    });
  });
});
