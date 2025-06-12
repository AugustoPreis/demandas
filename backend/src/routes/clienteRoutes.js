const { Router } = require('express');
const { authHandler } = require('../middlewares/authHandler');
const { clienteController } = require('../controllers/clienteController');

const routes = Router();

routes.get('/', [authHandler], (req, res, next) => {
  clienteController.listar(req, res, next);
});

module.exports = routes;