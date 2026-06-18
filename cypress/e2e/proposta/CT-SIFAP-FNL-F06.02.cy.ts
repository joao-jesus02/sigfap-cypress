describe("CT-SIFAP-FNL-F06.02 - Termo de aceite", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve permitir marcar o aceite do termo", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteTermoAceite(propostaUnica);
      cy.get('[data-cy="termo-de-aceite-aceito-box"]').click({ force: true });
      cy.get('[data-cy="termo-de-aceite-aceito-box"]').should(($aceite) => {
        const checkboxMarcado =
          $aceite.attr("aria-checked") === "true" ||
          $aceite.find('input[type="checkbox"]:checked').length > 0 ||
          $aceite.find("svg").length > 0;

        expect(checkboxMarcado, "controle de aceite marcado").to.equal(true);
      });
      cy.get("body").then(($body) => {
        const checkboxInterno = $body.find(
          '[data-cy="termo-de-aceite-aceito-box"] input[type="checkbox"]'
        );

        if (checkboxInterno.length) {
          cy.wrap(checkboxInterno).should("be.checked");
        }
      });
      cy.contains(/Li e estou de acordo com o termo de aceite/i).should("be.visible");
    });
  });
});
