declare namespace Cypress {
  interface PropostaFixture {
    tituloProjeto: string;
    tipoEvento: string;
    estado: string;
    instituicao: string;
    unidade: string;
    duracaoMeses: string;
    informacaoComplementarOpcao: string;
    informacaoComplementarTexto: string;
    abrangenciaEstadoOpcao: string;
    abrangenciaMunicipio: string;
    cep: string;
    bairro: string;
    logradouro: string;
    enderecoEstado: string;
    numero: string;
    enderecoMunicipio: string;
    complemento: string;
    celular: string;
    racaCor: string;
    instituicaoNome: string;
    instituicaoSigla: string;
    unidadeNome: string;
    unidadeSigla: string;
    nivelAcademico: string;
    curriculoLattes: string;
    linkedin: string;
    tipoVinculo: string;
    inicioServico: string;
    regimeTrabalho: string;
    funcaoCargo: string;
    inicioFuncao: string;
    descricaoOpcaoTexto: string;
    descricaoTexto: string;
    membroPesquisador: string;
    faixaFinanciamentoOpcao: string;
    atividadeTitulo: string;
    atividadeDescricao: string;
    atividadeMesInicio: string;
    atividadeDuracao: string;
    atividadeCargaHoraria: string;
    servicoTerceiroEspecificacao: string;
    servicoTerceiroTipo: string;
    servicoTerceiroCustoUnitario: string;
    servicoTerceiroMesPrevisto: string;
    servicoTerceiroJustificativa: string;
    bolsaModalidadeOpcao: string;
    bolsaNivelOpcao: string;
    bolsaQuantidade: string;
    bolsaDuracaoOpcao: string;
    documentoPropostaNome: string;
  }

  interface Chainable {
    typeLogin: (email: string, password: string) => void;
    loginUsuarioPadrao: () => void;
    fixtureComTituloUnico: <T = PropostaFixture>(
      fixtureName?: string
    ) => Chainable<T>;
    salvarFormularioAtual: () => void;
    selecionarOpcaoPorDataCy: (campo: string, opcao: string) => void;
    selecionarOpcaoPorTexto: (campo: string, texto: string) => void;
    acessarEditalSigCypress: () => void;
    limparPropostasEmEdicaoDoEdital: () => void;
    iniciarPropostaSigCypress: () => void;
    preencherInformacoesIniciaisProposta: (proposta: PropostaFixture) => void;
    adicionarAreaConhecimentoProposta: () => void;
    avancarEtapaProposta: () => void;
    preencherInformacoesComplementaresProposta: (
      proposta: PropostaFixture
    ) => void;
    preencherAbrangenciaProposta: (proposta: PropostaFixture) => void;
    preencherEnderecoCoordenador: (proposta: PropostaFixture) => void;
    preencherDadosPessoaisCoordenador: (proposta: PropostaFixture) => void;
    preencherDadosAcademicosCoordenador: (proposta: PropostaFixture) => void;
    preencherDadosProfissionaisCoordenador: (
      proposta: PropostaFixture
    ) => void;
    preencherDescricaoProposta: (proposta: PropostaFixture) => void;
    avancarIndicadoresDeProducao: () => void;
    navegarAteAbrangencia: (proposta: PropostaFixture) => void;
    navegarAteDadosPessoais: (proposta: PropostaFixture) => void;
    navegarAteDadosAcademicos: (proposta: PropostaFixture) => void;
    navegarAteDadosProfissionais: (proposta: PropostaFixture) => void;
    navegarAteDescricaoProposta: (proposta: PropostaFixture) => void;
    navegarAteIndicadoresDeProducao: (proposta: PropostaFixture) => void;
    navegarAteMembrosDaProposta: (proposta: PropostaFixture) => void;
    navegarAteAtividadesDaProposta: (proposta: PropostaFixture) => void;
    preencherAtividadeProposta: (proposta: PropostaFixture) => void;
    navegarAteVisualizacaoAtividades: (proposta: PropostaFixture) => void;
    navegarAteFaixaFinanciamento: (proposta: PropostaFixture) => void;
    preencherFaixaFinanciamentoProposta: () => void;
    navegarAteServicosTerceiros: (proposta: PropostaFixture) => void;
    navegarAteBolsa: (proposta: PropostaFixture) => void;
    preencherBolsaProposta: (proposta: PropostaFixture) => void;
    navegarAteConsolidacao: (proposta: PropostaFixture) => void;
    navegarAteSolicitadoFundacao: (proposta: PropostaFixture) => void;
    navegarAteDocumentosPessoais: (proposta: PropostaFixture) => void;
    navegarAteDocumentosDaProposta: (proposta: PropostaFixture) => void;
    navegarAteVisualizacaoProposta: (proposta: PropostaFixture) => void;
    navegarAteTermoAceite: (proposta: PropostaFixture) => void;
  }
}
