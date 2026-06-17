import { getCurrentDateTime } from "../../helpers/date.helper";

describe("CT-SIFAP-CAR-F02.02 - Informacoes complementares", () => {
  beforeEach(() => {
    cy.fixture("criar-conta").then((usuario) => {
      cy.typeLogin(usuario.email, usuario.senha);
      cy.get('[data-cy="user-menu"]').should("be.visible");
    });
  });

  it("deve exibir e permitir responder as perguntas configuradas no edital", () => {
    cy.fixture("proposta").then((proposta) => {
      const propostaUnica = {
        ...proposta,
        tituloProjeto: `${proposta.tituloProjeto} ${getCurrentDateTime()}`,
      };

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
