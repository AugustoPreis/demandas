const { HttpStatus } = require('node-backend-utils/enums');
const { situacaoService } = require('../services/situacaoService');

class SituacaoController {

  async listar(req, res, next) {
    try {
      const result = await situacaoService.listar(req.query, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

}

const situacaoController = new SituacaoController();

module.exports = { situacaoController, SituacaoController };