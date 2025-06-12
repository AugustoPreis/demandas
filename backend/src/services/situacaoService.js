const { isValidString } = require('node-backend-utils/validators');
const { situacaoRepository } = require('../repositories/situacaoRepository');
const { addTotal } = require('../utils/data');

class SituacaoService {

  async listar(params, usuarioLogado) {
    const { descricao, pagina } = params;
    const queryParams = {
      descricao: null,
      pagina: 1,
      empresaId: usuarioLogado.empresaId,
    }

    if (isValidString(descricao)) {
      queryParams.descricao = descricao.trim();
    }

    if (isValidString(pagina, { pattern: /^\d+$/ })) {
      queryParams.pagina = Number(pagina);
    }

    const situacoes = await situacaoRepository.listar(queryParams);

    return addTotal(situacoes);
  }
}

const situacaoService = new SituacaoService();

module.exports = { situacaoService, SituacaoService };