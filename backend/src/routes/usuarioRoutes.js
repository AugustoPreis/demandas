const { Router } = require('express');
const { authHandler, adminHandler } = require('../middlewares/authHandler');
const { usuarioController } = require('../controllers/usuarioController');

const routes = Router();

//Não autenticadas
routes.post('/login', (req, res, next) => {
  usuarioController.login(req, res, next);
});

routes.delete('/login', [authHandler], (req, res, next) => {
  usuarioController.logout(req, res, next);
});

//Autenticadas
routes.get('/', [authHandler], (req, res, next) => {
  usuarioController.listar(req, res, next);
});

routes.get('/:id/infos', [authHandler], (req, res, next) => {
  usuarioController.infos(req, res, next);
});

//Admin
routes.get('/:id', [authHandler, adminHandler], (req, res, next) => {
  usuarioController.buscarPorId(req, res, next);
});

routes.post('/', [authHandler, adminHandler], (req, res, next) => {
  usuarioController.cadastrar(req, res, next);
});

routes.put('/:id', [authHandler, adminHandler], (req, res, next) => {
  usuarioController.editar(req, res, next);
});

routes.delete('/:id', [authHandler, adminHandler], (req, res, next) => {
  usuarioController.inativar(req, res, next);
});

module.exports = routes;