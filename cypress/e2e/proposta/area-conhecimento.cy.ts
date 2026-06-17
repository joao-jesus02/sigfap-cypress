describe("CT-SIFAP-CAR-F02.01 - Área de conhecimento da proposta", () => {
  beforeEach(() => {
    cy.fixture("criar-conta").then((usuario) => {
      cy.typeLogin(usuario.email, usuario.senha);
      cy.get('[data-cy="user-menu"]').should("be.visible");
    });
  });

  it("deve adicionar e persistir a área de conhecimento da proposta", () => {
    cy.fixture("proposta").then((proposta) => {
      cy.iniciarPropostaSigCypress();
      cy.preencherInformacoesIniciaisProposta(proposta);
      cy.adicionarAreaConhecimentoProposta();

      cy.contains("Ciências Exatas e da Terra").should("be.visible");
      cy.contains("Ciência da Computação").should("be.visible");
      cy.contains("Metodologia e Técnicas da Computação").should("be.visible");
      cy.contains("Engenharia de Software").should("be.visible");
    });
  });
});
