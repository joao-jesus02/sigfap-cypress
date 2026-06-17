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
  }

  interface Chainable {
    typeLogin: (email: string, password: string) => void;
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
    navegarAteMembrosDaProposta: (proposta: PropostaFixture) => void;
  }
}
