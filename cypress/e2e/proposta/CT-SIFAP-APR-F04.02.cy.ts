describe("CT-SIFAP-APR-F04.02 - Indicadores de producao", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve registrar os indicadores da proposta", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteIndicadoresDeProducao(propostaUnica);

      cy.get("table input:visible").eq(0).clear({ force: true }).type("1", {
        force: true,
      });
      cy.get("table input:visible").eq(1).clear({ force: true }).type("2", {
        force: true,
      });
      cy.contains("button", /^Salvar$/i).click({ force: true });
      cy.contains("Salvo com sucesso!", { matchCase: false }).should(
        "be.visible"
      );

      cy.get("table input:visible").then(($inputs) => {
        const valores = [...$inputs].map((input) => (input as HTMLInputElement).value);

        expect(valores).to.include("1");
        expect(valores.some((valor) => String(valor).trim().length > 0)).to.equal(
          true
        );
      });
    });
  });
});
