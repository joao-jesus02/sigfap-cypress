describe("CT-SIFAP-ARP-ORC-F04.06.02 - Servicos de terceiros", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve acessar a etapa de servicos de terceiros e verificar seus controles", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteServicosTerceiros(propostaUnica);
      cy.contains(/Serviços de Terceiros/i).should("be.visible");
      cy.get("body").then(($body) => {
        const temAdicionar = $body.find('[data-cy="add-button"]').length > 0;
        const temSalvar = $body.find('[data-cy="save-button"]').length > 0;
        const temVerificarPendencias =
          $body.find('[data-cy="menu-verificar-pendencias"]').length > 0 ||
          /Verificar pendências/i.test($body.text());

        expect(
          temAdicionar || temSalvar || temVerificarPendencias,
          "controles da etapa de servicos de terceiros"
        ).to.equal(true);
      });
    });
  });
});
