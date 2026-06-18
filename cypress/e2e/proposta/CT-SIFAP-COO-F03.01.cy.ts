describe("CT-SIFAP-COO-F03.01 - Dados pessoais", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve salvar os dados pessoais do coordenador e permitir avancar", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteDadosPessoais(propostaUnica);
      cy.preencherDadosPessoaisCoordenador(propostaUnica);
      cy.contains("button", /^Salvar$/i).click({ force: true });
      cy.get('[data-cy="next-button"]').click({ force: true });

      cy.get("body").should(($body) => {
        const avancouParaEndereco =
          $body.find('[data-cy="criadoPor.endereco.cep"]').length > 0;
        const avancouParaAcademicos = $body.text().includes("Dados acadêmicos");

        expect(
          avancouParaEndereco || avancouParaAcademicos,
          "avanco apos salvar dados pessoais"
        ).to.equal(true);
      });
    });
  });
});
