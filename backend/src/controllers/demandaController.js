const { HttpStatus } = require('node-backend-utils/enums');
const { demandaService } = require('../services/demandaService');

class DemandaController {

  async listar(req, res, next) {
    try {
      const result = await demandaService.listar(req.query, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const id = Number(req.params.id);

      const result = await demandaService.buscarPorId(id, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async cadastrar(req, res, next) {
    try {
      const result = await demandaService.cadastrar(req.body, req.user);

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async iniciarTrabalho(req, res, next) {
    try {
      const demandaId = Number(req.params.id);

      const result = await demandaService.iniciarTrabalho(demandaId, req.user);

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async encerrarTrabalho(req, res, next) {
    try {
      const demandaId = Number(req.params.id);

      const result = await demandaService.encerrarTrabalho(demandaId, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async enviar(req, res, next) {
    try {
      req.body.demandaId = Number(req.params.id);

      const result = await demandaService.enviar(req.body, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}

const demandaController = new DemandaController();

module.exports = { demandaController, DemandaController };