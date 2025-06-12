const { isValidString } = require('node-backend-utils/validators');
const { clienteRepository } = require('../repositories/clienteRepository');
const { addTotal } = require('../utils/data');

class ClienteService {

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

    const clientes = await clienteRepository.listar(queryParams);

    return addTotal(clientes);
  }
}

const clienteService = new ClienteService();

module.exports = { clienteService, ClienteService };