const { HttpStatus } = require('node-backend-utils/enums');
const { clienteService } = require('../services/clienteService');

class ClienteController {

  async listar(req, res, next) {
    try {
      const result = await clienteService.listar(req.query, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}

const clienteController = new ClienteController();

module.exports = { clienteController, ClienteController };