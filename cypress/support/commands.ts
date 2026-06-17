// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const avancarAteEtapa = (seletorEtapa: string, rotuloEtapa?: string) => {
  cy.get('[data-cy="next-button"]').click({ force: true });
  cy.get("body").then(($body) => {
    if (!$body.find(seletorEtapa).length) {
      cy.get('[data-cy="next-button"]').click({ force: true });
    }
  });
  cy.get("body").then(($body) => {
    if (!$body.find(seletorEtapa).length && rotuloEtapa) {
      cy.contains(rotuloEtapa).click({ force: true });
    }
  });
  cy.get(seletorEtapa, { timeout: 10000 }).should("be.visible");
};

const acessarEtapaPeloRotulo = (rotuloEtapa: string, seletorEtapa: string) => {
  cy.contains(rotuloEtapa).click({ force: true });
  cy.get(seletorEtapa, { timeout: 10000 }).should("be.visible");
};

const acessarEtapaPeloRotuloComFallback = (
  rotuloEtapa: string,
  seletorEtapa: string,
  textoFallback: string
) => {
  cy.contains(rotuloEtapa).click({ force: true });
  cy.get("body", { timeout: 10000 }).should(($body) => {
    const temSeletor = $body.find(seletorEtapa).length > 0;
    const temTexto = $body.text().includes(textoFallback);
    expect(
      temSeletor || temTexto,
      `${rotuloEtapa} visivel por seletor ou texto`
    ).to.equal(true);
  });
};

const salvarEtapaAtual = () => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="save-button"]').length) {
      cy.get('[data-cy="save-button"]').click({ force: true });
      return;
    }

    cy.contains("button", /^Salvar$/i).click({ force: true });
  });
};

Cypress.Commands.add("typeLogin", (username, password) => {
  cy.visit("/login");
  cy.get('[data-cy="email"]').type(username);
  cy.get('[data-cy="senha"]').type(password);
  cy.get('[data-cy="loginButton"]').click(); //Botão Acessar da página principal
});

Cypress.Commands.add("selecionarOpcaoPorDataCy", (campo, opcao) => {
  cy.get(`[data-cy="${campo}"]`).click();
  cy.get(`[data-cy="${opcao}"]`).click();
});

Cypress.Commands.add("selecionarOpcaoPorTexto", (campo, texto) => {
  cy.get(`[data-cy="${campo}"]`).click();
  cy.get("body").then(($body) => {
    const input = $body.find(
      `[data-cy="${campo}"] input, [data-cy="${campo}"] textarea, input[data-cy="${campo}"]`
    );

    if (input.length) {
      cy.wrap(input.first()).clear().type(texto, { force: true });
    }
  });
  cy.contains(texto, { matchCase: false }).first().click({ force: true });
});

Cypress.Commands.add("acessarEditalSigCypress", () => {
  cy.get('[data-cy="breadcrumb-home"]').click();
  cy.get('[data-cy="editais-ver-mais"]').click();
  cy.get('input[placeholder="Pesquisar por nome de edital"]')
    .clear()
    .type("Edital 2026-0001 Sig Cypress");
  cy.contains("Edital 2026-0001 Sig Cypress").should("be.visible");
  cy.contains("button", /^Visualizar edital$/i).click();
});

Cypress.Commands.add("limparPropostasEmEdicaoDoEdital", () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem("token");

    cy.request({
      method: "GET",
      url: "https://novo-sig.homolog.ledes.net/api/proposta/minhas-propostas?skip=0&take=100",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then((response) => {
      const propostas = Array.isArray(response.body?.data) ? response.body.data : [];
      const propostasDoEdital = propostas.filter(
        (proposta: any) =>
          proposta?.edital?.nome === "Edital 2026-0001 Sig Cypress"
      );

      return cy.wrap(propostasDoEdital).each((proposta: any) => {
        return cy.request({
          method: "DELETE",
          url: `https://novo-sig.homolog.ledes.net/api/proposta/${proposta.id}`,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }).then(() => {
        cy.wait(1000);
        return cy.request({
          method: "GET",
          url: "https://novo-sig.homolog.ledes.net/api/proposta/minhas-propostas?skip=0&take=100",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).then((novaResponse) => {
          const propostasAtualizadas = Array.isArray(novaResponse.body?.data)
            ? novaResponse.body.data
            : [];
          const propostasRestantes = propostasAtualizadas.filter(
            (proposta: any) =>
              proposta?.edital?.nome === "Edital 2026-0001 Sig Cypress"
          );

          expect(propostasRestantes, "propostas restantes do edital").to.have.length(0);
        });
      });
    });
  });
});

Cypress.Commands.add("iniciarPropostaSigCypress", () => {
  cy.limparPropostasEmEdicaoDoEdital();
  cy.acessarEditalSigCypress();
  cy.get('[data-cy="criar-proposta"]')
    .should("be.visible")
    .and("be.enabled")
    .scrollIntoView();
  cy.get('[data-cy="criar-proposta"]').click({ force: true });
  cy.location("pathname", { timeout: 10000 }).should((pathname) => {
    expect(pathname).to.satisfy(
      (value: string) =>
        value.includes("/proposta/adicionar") || value.includes("/proposta/")
    );
  });
});

Cypress.Commands.add("preencherInformacoesIniciaisProposta", (proposta) => {
  cy.get('[data-cy="edital.nome"]')
    .should("be.visible")
    .and("contain.value", "Edital 2026-0001 Sig Cypress");

  cy.get('[data-cy="titulo"]').clear().type(proposta.tituloProjeto);
  cy.selecionarOpcaoPorDataCy("search-tipo-evento-id", "congresso");
  cy.selecionarOpcaoPorDataCy(
    "search-estado-execucao-evento",
    "mato-grosso-do-sul"
  );
  cy.get('[data-cy="duracao"]').clear().type(proposta.duracaoMeses);
  cy.selecionarOpcaoPorDataCy(
    "search-instituicao-executora-id",
    "ufms-universidade-federal-do-mat"
  );
  cy.get('[data-cy="search-unidade-executora-id"], #search-unidade-executora-id')
    .click();
  cy.get('[data-cy="facom-faculdade-de-computacao"]').click();
});

Cypress.Commands.add("adicionarAreaConhecimentoProposta", () => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="areaDeConhecimento-adicionar"]').length) {
      cy.get('[data-cy="areaDeConhecimento-adicionar"]').click();
      return;
    }

    cy.contains("button", /Adicionar$/).click();
  });
  cy.selecionarOpcaoPorDataCy(
    "search-grande-area-id",
    "ciencias-exatas-e-da-terra"
  );
  cy.selecionarOpcaoPorDataCy("search-area-id", "ciencia-da-computacao");
  cy.selecionarOpcaoPorDataCy(
    "search-sub-area-id",
    "metodologia-e-tecnicas-da-comput"
  );
  cy.selecionarOpcaoPorDataCy("search-especialidade-id", "engenharia-de-software");
  cy.get('[data-cy="areaDeConhecimento-confirmar"]').click();
});

Cypress.Commands.add("avancarEtapaProposta", () => {
  cy.get('[data-cy="next-button"]').click();
});

Cypress.Commands.add("preencherInformacoesComplementaresProposta", (proposta) => {
  cy.get('[data-cy="informacoes-complementares"]').should("be.visible");
  cy.get(`[data-cy="${proposta.informacaoComplementarOpcao}"]`)
    .first()
    .click({
    force: true,
  });
  cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-219"]')
    .clear()
    .type(proposta.informacaoComplementarTexto);
});

Cypress.Commands.add("preencherAbrangenciaProposta", (proposta) => {
  cy.get('[data-cy="abrangencia"]').should("be.visible");
  cy.get('[data-cy="add-button"]').click();
  cy.selecionarOpcaoPorDataCy(
    "search-estado-id",
    proposta.abrangenciaEstadoOpcao
  );
  cy.get('[data-cy="search-abrangencia-municipio"]').click();
  cy.get(
    '[data-cy="search-abrangencia-municipio"] input, input[data-cy="search-abrangencia-municipio"]'
  )
    .first()
    .clear()
    .type(proposta.abrangenciaMunicipio, { force: true });
  cy.contains('[role="option"]', proposta.abrangenciaMunicipio, {
    matchCase: false,
  }).click({ force: true });
  cy.get("body").click(0, 0, { force: true });
  cy.get('[data-cy="abrangencia-confirmar"]').click({ force: true });
});

Cypress.Commands.add("preencherDadosPessoaisCoordenador", (proposta) => {
  cy.get('[data-cy="criadoPor.celular"]')
    .scrollIntoView()
    .invoke("val")
    .then((valorAtual) => {
      if (!String(valorAtual || "").trim()) {
        cy.get('[data-cy="criadoPor.celular"]')
          .clear({ force: true })
          .type(proposta.celular, { force: true });
      }
    });
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="search-raca-cor-id"]').length) {
      cy.get('[data-cy="search-raca-cor-id"]')
        .invoke("val")
        .then((valorAtual) => {
          if (String(valorAtual || "").trim()) {
            return;
          }

          cy.get('[data-cy="open-raca-cor-id"]').click({ force: true });
          cy.get('[data-cy="search-raca-cor-id"]')
            .clear({ force: true })
            .type(proposta.racaCor, { force: true });
          cy.contains('[data-componentid="options-list"] div', proposta.racaCor, {
            matchCase: false,
          }).click({ force: true });
          cy.get('[data-cy="search-raca-cor-id"]').should(
            "have.value",
            proposta.racaCor
          );
        });
      return;
    }
  });
});

Cypress.Commands.add("preencherEnderecoCoordenador", (proposta) => {
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="criadoPor.endereco.cep"]').length) {
      return;
    }

    cy.get('[data-cy="criadoPor.endereco.cep"]')
      .scrollIntoView()
      .clear({ force: true })
      .type(proposta.cep, { force: true });
    cy.get('[data-cy="criadoPor.endereco.bairro"]')
      .clear({ force: true })
      .type(proposta.bairro, { force: true });
    cy.get('[data-cy="criadoPor.endereco.logradouro"]')
      .clear({ force: true })
      .type(proposta.logradouro, { force: true });
    cy.selecionarOpcaoPorTexto("search-estado", proposta.enderecoEstado);
    cy.get('[data-cy="criadoPor.endereco.numero"]')
      .clear({ force: true })
      .type(proposta.numero, { force: true });
    cy.selecionarOpcaoPorTexto("search-municipio", proposta.enderecoMunicipio);
    cy.get('[data-cy="criadoPor.endereco.complemento"]')
      .clear({ force: true })
      .type(proposta.complemento, { force: true });
  });
});

Cypress.Commands.add("preencherDadosAcademicosCoordenador", (proposta) => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="criadoPor.instituicaoNome"]').length) {
      cy.get('[data-cy="sugerir-instituicao"]').check({ force: true });
      cy.get('[data-cy="criadoPor.instituicaoNome"]')
        .scrollIntoView()
        .clear({ force: true })
        .type(proposta.instituicaoNome, { force: true });
      cy.get('[data-cy="criadoPor.instituicaoSigla"]')
        .clear({ force: true })
        .type(proposta.instituicaoSigla, { force: true });
      cy.get('[data-cy="criadoPor.unidadeNome"]')
        .clear({ force: true })
        .type(proposta.unidadeNome, { force: true });
      cy.get('[data-cy="criadoPor.unidadeSigla"]')
        .clear({ force: true })
        .type(proposta.unidadeSigla, { force: true });
      cy.selecionarOpcaoPorTexto(
        "search-nivel-academico-id",
        proposta.nivelAcademico
      );
      cy.get('[data-cy="criadoPor.lattes"]')
        .clear({ force: true })
        .type(proposta.curriculoLattes, { force: true });
      cy.get('[data-cy="criadoPor.linkedin"]')
        .clear({ force: true })
        .type(proposta.linkedin, { force: true });
      return;
    }

    cy.contains("Currículo Lattes").should("be.visible");
  });
});

Cypress.Commands.add("preencherDadosProfissionaisCoordenador", (proposta) => {
  cy.get('[data-cy="possui-vinculo-institucional"]').check({ force: true });
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="possui-vinculo-empregaticio"]').length) {
      cy.get('[data-cy="possui-vinculo-empregaticio"]').check({ force: true });
    }

    if ($body.find('[data-cy="search-tipo-vinculo-instituciona"]').length) {
      cy.selecionarOpcaoPorTexto(
        "search-tipo-vinculo-instituciona",
        proposta.tipoVinculo
      );
    }

    if ($body.find('[data-cy="criadoPor.vinculoInstitucional.inicioServico"]').length) {
      cy.get('[data-cy="criadoPor.vinculoInstitucional.inicioServico"]')
        .clear({ force: true })
        .type(proposta.inicioServico, { force: true });
    }

    if ($body.find('[data-cy="search-regime-trabalho-id"]').length) {
      cy.selecionarOpcaoPorTexto(
        "search-regime-trabalho-id",
        proposta.regimeTrabalho
      );
    }

    if ($body.find('[data-cy="criadoPor.vinculoInstitucional.funcao"]').length) {
      cy.get('[data-cy="criadoPor.vinculoInstitucional.funcao"]')
        .clear({ force: true })
        .type(proposta.funcaoCargo, { force: true });
    }

    if ($body.find('[data-cy="criadoPor.vinculoInstitucional.inicioFuncao"]').length) {
      cy.get('[data-cy="criadoPor.vinculoInstitucional.inicioFuncao"]')
        .clear({ force: true })
        .type(proposta.inicioFuncao, { force: true });
    }
  });
});

Cypress.Commands.add("preencherDescricaoProposta", (proposta) => {
  cy.get("body").then(($body) => {
    const opcaoDescricao = $body.text().includes(proposta.descricaoOpcaoTexto)
      ? proposta.descricaoOpcaoTexto
      : "Opção 1";

    cy.contains(opcaoDescricao, { matchCase: false }).click({
      force: true,
    });

    const seletorDescricao = $body.find(
      'textarea[data-cy^="formularioPropostaDescritiva.pergunta-"]'
    ).length
      ? 'textarea[data-cy^="formularioPropostaDescritiva.pergunta-"]'
      : '[data-cy^="formularioPropostaDescritiva.pergunta-"]';

    cy.get(seletorDescricao)
      .filter(":visible")
      .last()
      .clear({ force: true })
      .type(proposta.descricaoTexto, { force: true });
  });
});

Cypress.Commands.add("avancarIndicadoresDeProducao", () => {
  cy.get('[data-cy="next-button"]').click();
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="nome-do-pesquisador"]').length) {
      cy.contains("Membros").click({ force: true });
    }
  });
});

Cypress.Commands.add("navegarAteMembrosDaProposta", (proposta) => {
  cy.iniciarPropostaSigCypress();
  cy.preencherInformacoesIniciaisProposta(proposta);
  cy.adicionarAreaConhecimentoProposta();
  cy.avancarEtapaProposta();
  cy.preencherInformacoesComplementaresProposta(proposta);
  cy.avancarEtapaProposta();
  cy.preencherAbrangenciaProposta(proposta);
  cy.avancarEtapaProposta();
  cy.preencherDadosPessoaisCoordenador(proposta);
  salvarEtapaAtual();
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="criadoPor.endereco.cep"]').length) {
      return;
    }

    if ($body.text().includes("Dados pessoais")) {
      cy.contains("Dados acadêmicos").click({ force: true });
      return;
    }
  });
  cy.preencherEnderecoCoordenador(proposta);
  salvarEtapaAtual();
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="criadoPor.endereco.cep"]').length) {
      cy.avancarEtapaProposta();
    }
  });
  acessarEtapaPeloRotuloComFallback(
    "Dados acadêmicos",
    '[data-cy="criadoPor.instituicaoNome"]',
    "Currículo Lattes"
  );
  cy.preencherDadosAcademicosCoordenador(proposta);
  salvarEtapaAtual();
  cy.avancarEtapaProposta();
  acessarEtapaPeloRotuloComFallback(
    "Dados profissionais",
    '[data-cy="possui-vinculo-institucional"]',
    "Possuo vínculo institucional"
  );
  cy.preencherDadosProfissionaisCoordenador(proposta);
  salvarEtapaAtual();
  cy.avancarEtapaProposta();
  cy.preencherDescricaoProposta(proposta);
  cy.avancarEtapaProposta();
  cy.avancarIndicadoresDeProducao();
  cy.get('[data-cy="nome-do-pesquisador"]').should("be.visible");
});
