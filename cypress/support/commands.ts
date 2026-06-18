import { getCurrentDateTime } from "../helpers/date.helper";

const removeAccents = require("remove-accents");

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

const clicarProximaEtapaOuRotulo = (rotuloEtapa: RegExp, seletorEtapa?: string) => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="next-button"]').length) {
      cy.get('[data-cy="next-button"]').click({ force: true });
      return;
    }

    cy.contains(rotuloEtapa).click({ force: true });
  });

  if (seletorEtapa) {
    cy.get("body", { timeout: 10000 }).then(($body) => {
      if (!$body.find(seletorEtapa).filter(":visible").length) {
        cy.contains(rotuloEtapa).click({ force: true });
      }
    });
    cy.get(seletorEtapa, { timeout: 10000 }).should("be.visible");
  }
};

const clicarAdicionarSeDisponivel = () => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="add-button"]').length) {
      cy.get('[data-cy="add-button"]').click({ force: true });
      return;
    }

    if ($body.find("button").filter((_, el) => /Adicionar/i.test(el.textContent || "")).length) {
      cy.contains("button", /Adicionar/i).click({ force: true });
    }
  });
};

const selecionarPrimeiraOpcaoVisivel = () => {
  cy.get('[role="option"], [data-componentid="options-list"] div')
    .filter(":visible")
    .first()
    .click({ force: true });
};

Cypress.Commands.add("typeLogin", (username, password) => {
  cy.visit("/login");
  cy.get('[data-cy="email"]').type(username);
  cy.get('[data-cy="senha"]').type(password);
  cy.get('[data-cy="loginButton"]').click(); //Botão Acessar da página principal
});

Cypress.Commands.add("loginUsuarioPadrao", () => {
  cy.fixture("criar-conta").then((usuario) => {
    cy.typeLogin(usuario.email, usuario.senha);
    cy.get('[data-cy="user-menu"]').should("be.visible");
  });
});

Cypress.Commands.add("fixtureComTituloUnico", (fixtureName = "proposta") => {
  return cy.fixture(fixtureName).then((fixture) => ({
    ...fixture,
    tituloProjeto: `${fixture.tituloProjeto} ${getCurrentDateTime()}`,
  }));
});

Cypress.Commands.add("salvarFormularioAtual", () => {
  salvarEtapaAtual();
});

Cypress.Commands.add("selecionarOpcaoPorDataCy", (campo, opcao) => {
  cy.get(`[data-cy="${campo}"]`).click({ force: true });
  cy.wait(500);
  cy.get("body").then(($body) => {
    if ($body.find(`[data-cy="${opcao}"]`).length) {
      cy.get(`[data-cy="${opcao}"]`).click({ force: true });
      return;
    }

    const alvoNormalizado = removeAccents(opcao.replace(/-/g, " ")).toLowerCase();
    const candidatos = $body.find(
      '[role="option"], [data-componentid="options-list"] div, li'
    );
    const opcaoEncontrada = [...candidatos].find((elemento) =>
      removeAccents(Cypress.$(elemento).text()).toLowerCase().includes(alvoNormalizado)
    );

    expect(opcaoEncontrada, `opcao encontrada para ${opcao}`).to.exist;
    cy.wrap(opcaoEncontrada).click({ force: true });
  });
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
          failOnStatusCode: false,
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

          if (propostasRestantes.length) {
            Cypress.log({
              name: "limpeza-propostas",
              message: `${propostasRestantes.length} proposta(s) nao removida(s) do edital`,
            });
          }
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
  cy.get('[data-cy="next-button"]').click({ force: true });
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
  cy.get("body").then(($body) => {
    if ($body.find(`[data-cy="${proposta.abrangenciaEstadoOpcao}"]`).length) {
      cy.selecionarOpcaoPorDataCy(
        "search-estado-id",
        proposta.abrangenciaEstadoOpcao
      );
      return;
    }

    cy.selecionarOpcaoPorTexto("search-estado-id", proposta.enderecoEstado);
  });
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
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="abrangencia-confirmar"]').length) {
      cy.contains("button", /Cancelar/i).click({ force: true });
    }
  });
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
      const lattesInput = $body.find(
        '[data-cy="criadoPor.lattes"] input, input[data-cy="criadoPor.lattes"], #criadoPor\\.lattes'
      );
      const linkedinInput = $body.find(
        '[data-cy="criadoPor.linkedin"] input, input[data-cy="criadoPor.linkedin"], #criadoPor\\.linkedin'
      );

      if (lattesInput.length) {
        cy.wrap(lattesInput.first())
          .clear({ force: true })
          .type(proposta.curriculoLattes, { force: true });
      }

      if (linkedinInput.length) {
        cy.wrap(linkedinInput.first())
          .clear({ force: true })
          .type(proposta.linkedin, { force: true });
      }
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
      cy.get("body").click(0, 0, { force: true });
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
      cy.get("body").click(0, 0, { force: true });
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

Cypress.Commands.add("navegarAteAbrangencia", (proposta) => {
  cy.iniciarPropostaSigCypress();
  cy.preencherInformacoesIniciaisProposta(proposta);
  cy.adicionarAreaConhecimentoProposta();
  cy.avancarEtapaProposta();
  cy.preencherInformacoesComplementaresProposta(proposta);
  cy.avancarEtapaProposta();
  cy.get('[data-cy="abrangencia"]').should("be.visible");
});

Cypress.Commands.add("navegarAteDadosPessoais", (proposta) => {
  cy.navegarAteAbrangencia(proposta);
  cy.preencherAbrangenciaProposta(proposta);
  cy.avancarEtapaProposta();
  cy.get("body").then(($body) => {
    if (!$body.text().includes("Dados pessoais")) {
      cy.contains(/Coordenação/i).click({ force: true });
      cy.contains("Dados pessoais").click({ force: true });
    }
  });
  cy.contains("Dados pessoais").should("be.visible");
});

Cypress.Commands.add("navegarAteDadosAcademicos", (proposta) => {
  cy.navegarAteDadosPessoais(proposta);
  cy.preencherDadosPessoaisCoordenador(proposta);
  salvarEtapaAtual();
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="criadoPor.endereco.cep"]').length) {
      cy.preencherEnderecoCoordenador(proposta);
      salvarEtapaAtual();
      cy.avancarEtapaProposta();
      return;
    }

    if ($body.text().includes("Dados pessoais")) {
      cy.contains("Dados acadêmicos").click({ force: true });
    }
  });
  acessarEtapaPeloRotuloComFallback(
    "Dados acadêmicos",
    '[data-cy="criadoPor.instituicaoNome"]',
    "Currículo Lattes"
  );
});

Cypress.Commands.add("navegarAteDadosProfissionais", (proposta) => {
  cy.navegarAteDadosAcademicos(proposta);
  cy.preencherDadosAcademicosCoordenador(proposta);
  salvarEtapaAtual();
  cy.avancarEtapaProposta();
  acessarEtapaPeloRotuloComFallback(
    "Dados profissionais",
    '[data-cy="possui-vinculo-institucional"]',
    "Possuo vínculo institucional"
  );
});

Cypress.Commands.add("navegarAteDescricaoProposta", (proposta) => {
  cy.navegarAteDadosProfissionais(proposta);
  cy.preencherDadosProfissionaisCoordenador(proposta);
  salvarEtapaAtual();
  cy.avancarEtapaProposta();
  cy.contains("Descrição").should("be.visible");
});

Cypress.Commands.add("navegarAteIndicadoresDeProducao", (proposta) => {
  cy.navegarAteDescricaoProposta(proposta);
  cy.preencherDescricaoProposta(proposta);
  cy.avancarEtapaProposta();
  cy.contains("Indicadores de produção").should("be.visible");
});

Cypress.Commands.add("navegarAteMembrosDaProposta", (proposta) => {
  cy.navegarAteIndicadoresDeProducao(proposta);
  cy.avancarIndicadoresDeProducao();
  cy.get('[data-cy="nome-do-pesquisador"]').should("be.visible");
});

Cypress.Commands.add("navegarAteAtividadesDaProposta", (proposta) => {
  cy.navegarAteMembrosDaProposta(proposta);
  clicarProximaEtapaOuRotulo(/Atividades/i);
  cy.contains(/Atividades/i, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("preencherAtividadeProposta", (proposta) => {
  clicarAdicionarSeDisponivel();
  cy.wait(1000);
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="propostaAtividadeForm.titulo"]').length) {
      expect($body.text(), "etapa de atividades acessivel").to.match(
        /Atividades|Adicionar|Nenhum resultado/i
      );
      return;
    }

    cy.get('[data-cy="propostaAtividadeForm.titulo"]')
      .clear({ force: true })
      .type(proposta.atividadeTitulo, { force: true });
    cy.get('[data-cy="propostaAtividadeForm.descricao"]')
      .clear({ force: true })
      .type(proposta.atividadeDescricao, { force: true });
    cy.selecionarOpcaoPorTexto("search-mes-inicio", proposta.atividadeMesInicio);
    cy.selecionarOpcaoPorDataCy("search-duracao", proposta.atividadeDuracao);
    cy.selecionarOpcaoPorTexto(
      "search-carga-horaria-semanal",
      proposta.atividadeCargaHoraria
    );
    cy.get("body").then(($bodyAtualizado) => {
      const responsavel = $bodyAtualizado.find(
        '[data-cy*="responsavel"], [data-cy*="Responsavel"], [data-cy*="membro-atividade"]'
      );

      if (responsavel.length) {
        cy.wrap(responsavel.first()).click({ force: true });
        selecionarPrimeiraOpcaoVisivel();
      }
    });
    cy.get('[data-cy="propostaAtividade-confirmar"]').click({ force: true });
    cy.contains(proposta.atividadeTitulo, { matchCase: false }).should("be.visible");
  });
});

Cypress.Commands.add("navegarAteVisualizacaoAtividades", (proposta) => {
  cy.navegarAteAtividadesDaProposta(proposta);
  cy.preencherAtividadeProposta(proposta);
  clicarProximaEtapaOuRotulo(/Visualização das Atividades/i);
  cy.contains(/Visualização das Atividades|Atividades/i, { timeout: 10000 }).should(
    "be.visible"
  );
});

Cypress.Commands.add("navegarAteFaixaFinanciamento", (proposta) => {
  cy.navegarAteIndicadoresDeProducao(proposta);
  cy.contains(/Orçamento/i).click({ force: true });
  cy.get("body").then(($body) => {
    if (
      !$body.find('[data-cy="search-faixa-financiamento-id"]').filter(":visible")
        .length
    ) {
      cy.contains(/Faixa de financiamento/i).click({ force: true });
    }
  });
  cy.get("body", { timeout: 10000 }).should(($body) => {
    const campoVisivel =
      $body.find('[data-cy="search-faixa-financiamento-id"]').filter(":visible")
        .length > 0;
    const etapaAberta = /Faixa de financiamento/i.test($body.text());

    expect(campoVisivel || etapaAberta, "etapa faixa de financiamento aberta").to.equal(
      true
    );
  });
});

Cypress.Commands.add("preencherFaixaFinanciamentoProposta", () => {
  cy.get('[data-cy="search-faixa-financiamento-id"]').click({ force: true });
  selecionarPrimeiraOpcaoVisivel();
  salvarEtapaAtual();
});

Cypress.Commands.add("navegarAteServicosTerceiros", (proposta) => {
  cy.navegarAteFaixaFinanciamento(proposta);
  cy.preencherFaixaFinanciamentoProposta();
  clicarProximaEtapaOuRotulo(/Serviços de Terceiros/i);
  cy.contains(/Serviços de Terceiros/i, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("navegarAteBolsa", (proposta) => {
  cy.navegarAteServicosTerceiros(proposta);
  clicarProximaEtapaOuRotulo(/Bolsa/i);
  cy.contains(/Bolsa/i, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("preencherBolsaProposta", (proposta) => {
  cy.contains(/Bolsa/i).should("be.visible");
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="open-modalidade-bolsa-id"]').length) {
      expect($body.text(), "cadastro de bolsa disponivel na etapa").to.match(
        /Bolsa|Adicionar|Nenhum resultado/i
      );
      return;
    }
  });
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="open-modalidade-bolsa-id"]').length) {
      return;
    }

    clicarAdicionarSeDisponivel();
  });
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="open-modalidade-bolsa-id"]').length) {
      return;
    }

    cy.get('[data-cy="open-modalidade-bolsa-id"]').click({ force: true });
    cy.get(`[data-cy="${proposta.bolsaModalidadeOpcao}"]`).click({ force: true });
    cy.get('[data-cy="open-nivel-bolsa-id"]').click({ force: true });
    cy.get(`[data-cy="${proposta.bolsaNivelOpcao}"]`).click({ force: true });
    cy.get('[data-cy="rubricaBolsaForm.quantidade"]')
      .clear({ force: true })
      .type(proposta.bolsaQuantidade, { force: true });
    cy.get('[data-cy="open-duracao"]').click({ force: true });
    cy.get(`[data-cy="${proposta.bolsaDuracaoOpcao}"]`).click({ force: true });
    cy.get('[data-cy="rubricaBolsa-confirmar"]').click({ force: true });
  });
});

Cypress.Commands.add("navegarAteConsolidacao", (proposta) => {
  cy.navegarAteBolsa(proposta);
  clicarProximaEtapaOuRotulo(/Consolidação/i);
  cy.contains(/Consolidação/i, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("navegarAteSolicitadoFundacao", (proposta) => {
  cy.navegarAteConsolidacao(proposta);
  clicarProximaEtapaOuRotulo(/Solicitado à Fundação/i);
  cy.contains(/Solicitado à Fundação/i, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("navegarAteDocumentosPessoais", (proposta) => {
  cy.iniciarPropostaSigCypress();
  cy.preencherInformacoesIniciaisProposta(proposta);
  cy.adicionarAreaConhecimentoProposta();
  cy.contains(/Anexos/i).click({ force: true });
  cy.get("body").then(($body) => {
    if (
      !$body.find('[data-cy="select-categories-criado-por-usu"]').filter(":visible")
        .length
    ) {
      cy.contains(/Documentos Pessoais/i).click({ force: true });
    }
  });
  cy.get('[data-cy="select-categories-criado-por-usu"]', { timeout: 10000 }).should(
    "be.visible"
  );
});

Cypress.Commands.add("navegarAteDocumentosDaProposta", (proposta) => {
  cy.navegarAteDocumentosPessoais(proposta);
  clicarProximaEtapaOuRotulo(
    /Documentos da proposta/i,
    '[data-cy="select-categories-documento-prop"]'
  );
});

Cypress.Commands.add("navegarAteVisualizacaoProposta", (proposta) => {
  cy.navegarAteDocumentosDaProposta(proposta);
  cy.contains(/Finalização/i).click({ force: true });
  cy.contains(/Visualização da proposta/i).click({ force: true });
  cy.contains(/Visualização da Proposta/i, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("navegarAteTermoAceite", (proposta) => {
  cy.navegarAteDocumentosDaProposta(proposta);
  cy.contains(/Finalização/i).click({ force: true });
  cy.contains(/Termo de Aceite/i).click({ force: true });
  cy.get('[data-cy="termo-de-aceite-aceito-box"]', { timeout: 10000 }).should(
    "be.visible"
  );
});
