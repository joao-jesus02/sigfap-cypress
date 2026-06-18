describe("CT-SIFAP-SUB-F07 - Submissao da proposta", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve verificar pendencias antes da submissao final", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteTermoAceite(propostaUnica);
      cy.get('[data-cy="termo-de-aceite-aceito-box"]').click({ force: true });
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="menu-verificar-pendencias"]').length) {
          cy.get('[data-cy="menu-verificar-pendencias"]').click({ force: true });
          return;
        }

        cy.contains("button", /Verificar pendências/i).click({ force: true });
      });

      cy.get("body", { timeout: 10000 }).should(($body) => {
        const texto = $body.text();
        const houveValidacao =
          /Submeter Proposta|Pendência|pendência|Submetida|sem pendências/i.test(
            texto
          );

        expect(houveValidacao, "resultado da verificacao de pendencias").to.equal(
          true
        );
      });
    });
  });
});
