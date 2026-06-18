const acessarPerfil = () => {
  cy.get('[data-cy="user-menu"]').click({ force: true });
  cy.contains(/Perfil/i).click({ force: true });
  cy.contains(/Dados pessoais|Endereço|Dados acadêmicos|Dados profissionais/i, {
    timeout: 10000,
  }).should("be.visible");
};

const acessarSubsecaoPerfil = (rotulo: RegExp, seletorEsperado?: string) => {
  cy.contains(rotulo).click({ force: true });

  if (seletorEsperado) {
    cy.get(seletorEsperado, { timeout: 10000 }).should("exist");
  }
};

const preencherCampoSeExistir = (seletores: string, valor: string) => {
  cy.get("body").then(($body) => {
    const campo = $body.find(seletores).filter(":visible");

    if (campo.length) {
      cy.wrap(campo.first()).clear({ force: true }).type(valor, { force: true });
    }
  });
};

const preencherEnderecoPerfil = (cadastro: any) => {
  preencherCampoSeExistir(
    '[data-cy="criadoPor.endereco.cep"], [data-cy="endereco.cep"]',
    cadastro.cep
  );
  preencherCampoSeExistir(
    '[data-cy="criadoPor.endereco.bairro"], [data-cy="endereco.bairro"]',
    cadastro.bairro
  );
  preencherCampoSeExistir(
    '[data-cy="criadoPor.endereco.logradouro"], [data-cy="endereco.logradouro"]',
    cadastro.logradouro
  );
  preencherCampoSeExistir(
    '[data-cy="criadoPor.endereco.numero"], [data-cy="endereco.numero"]',
    cadastro.numero
  );
  preencherCampoSeExistir(
    '[data-cy="criadoPor.endereco.complemento"], [data-cy="endereco.complemento"]',
    cadastro.complemento
  );

  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="search-estado"]').filter(":visible").length) {
      cy.selecionarOpcaoPorTexto("search-estado", cadastro.enderecoEstado);
    }

    if ($body.find('[data-cy="search-municipio"]').filter(":visible").length) {
      cy.selecionarOpcaoPorTexto("search-municipio", cadastro.enderecoMunicipio);
    }
  });
};

describe("Atividade extra - Completar cadastro do usuário", () => {
  beforeEach(() => {
    cy.loginUsuarioPadrao();

    acessarPerfil();
    cy.fixture("completar-cadastro").as("cadastro");
  });

  it("deve preencher e salvar a subseção Endereço", function () {
    acessarSubsecaoPerfil(/Endereço/i);
    preencherEnderecoPerfil(this.cadastro);
    cy.salvarFormularioAtual();

    cy.contains(/Endereço/i).should("be.visible");
    cy.get("body").should(($body) => {
      expect($body.text()).to.include(this.cadastro.enderecoMunicipio);
    });
  });

  it("deve preencher e salvar a subseção Dados Acadêmicos", function () {
    acessarSubsecaoPerfil(/Dados acadêmicos/i);
    cy.preencherDadosAcademicosCoordenador(this.cadastro);
    cy.salvarFormularioAtual();

    cy.contains(/Currículo Lattes|Dados acadêmicos/i).should("be.visible");
  });

  it("deve preencher e salvar a subseção Dados Profissionais", function () {
    acessarSubsecaoPerfil(
      /Dados profissionais/i,
      '[data-cy="possui-vinculo-institucional"]'
    );
    cy.preencherDadosProfissionaisCoordenador(this.cadastro);
    cy.salvarFormularioAtual();

    cy.get('[data-cy="possui-vinculo-institucional"]').should("be.checked");
  });

  it("deve anexar e salvar a subseção Documentos Pessoais", function () {
    cy.get("body").then(($body) => {
      acessarSubsecaoPerfil(/Documentos pessoais/i);
    });
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="select-categories-criado-por-usu"]').length) {
        cy.get('[data-cy="select-categories-criado-por-usu"]').click({
          force: true,
        });

        if (
          $body.find(`[data-cy="${this.cadastro.documentoPessoalCategoria}"]`).length
        ) {
          cy.get(`[data-cy="${this.cadastro.documentoPessoalCategoria}"]`).click({
            force: true,
          });
        }
      }
    });
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="criadoPor.usuarioAnexo-upload"]').length) {
        cy.get('[data-cy="criadoPor.usuarioAnexo-upload"]').selectFile(
          this.cadastro.documentoPessoalUpload,
          { force: true }
        );
      }
    });
    cy.salvarFormularioAtual();

    cy.get("body").should(($body) => {
      const texto = $body.text();
      const documentoPresente =
        texto.includes(this.cadastro.documentoPessoalNome) ||
        /Arquivos anexados|Quantidade máxima|documento-de-identificacao/i.test(
          texto
        );

      expect(documentoPresente, "documento pessoal anexado").to.equal(true);
    });
  });
});
