const { Router } = require('express');
const { authHandler, adminHandler } = require('../middlewares/authHandler');
const { demandaController } = require('../controllers/demandaController');

const routes = Router();

routes.get('/', [authHandler], (req, res, next) => {
  demandaController.listar(req, res, next);
});

routes.get('/:id', [authHandler], (req, res, next) => {
  demandaController.buscarPorId(req, res, next);
});

routes.post('/', [authHandler, adminHandler], (req, res, next) => {
  demandaController.cadastrar(req, res, next);
});

routes.post('/:id/iniciar-trabalho', [authHandler], (req, res, next) => {
  demandaController.iniciarTrabalho(req, res, next);
});

routes.put('/:id/encerrar-trabalho', [authHandler], (req, res, next) => {
  demandaController.encerrarTrabalho(req, res, next);
});

routes.put('/:id/enviar', [authHandler], (req, res, next) => {
  demandaController.enviar(req, res, next);
});

module.exports = routes;