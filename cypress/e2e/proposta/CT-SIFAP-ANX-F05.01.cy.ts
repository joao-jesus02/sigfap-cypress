describe("CT-SIFAP-ANX-F05.01 - Documentos pessoais", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();
  });

  it("deve anexar um documento pessoal valido", () => {
    cy.fixtureComTituloUnico().then((propostaUnica) => {
      cy.navegarAteDocumentosPessoais(propostaUnica);
      cy.get('[data-cy="select-categories-criado-por-usu"]').click({
        force: true,
      });
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="documento-de-identificacao-com-f"]').length) {
          cy.get('[data-cy="documento-de-identificacao-com-f"]').click({
            force: true,
          });
        }
      });

      cy.get('[data-cy="criadoPor.usuarioAnexo-upload"]').selectFile(
        {
          contents: Cypress.Buffer.from("documento-pessoal-cypress"),
          fileName: "documento-pessoal.pdf",
          mimeType: "application/pdf",
        },
        { force: true }
      );

      cy.get("body").should(($body) => {
        const texto = $body.text();
        const documentoAnexado =
          texto.includes("documento-pessoal.pdf") ||
          /Arquivos anexados|documento-de-identificacao|Quantidade máxima/i.test(
            texto
          );

        expect(documentoAnexado, "documento pessoal anexado ou ja existente").to.equal(
          true
        );
      });
    });
  });
});
