const { Router } = require('express');
const { authHandler } = require('../middlewares/authHandler');
const { situacaoController } = require('../controllers/situacaoController');

const routes = Router();

routes.get('/', [authHandler], (req, res, next) => {
  situacaoController.listar(req, res, next);
});

module.exports = routes;