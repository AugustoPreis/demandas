const { Router } = require('express');
const demandaRoutes = require('./demandaRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const situacaoRoutes = require('./situacaoRoutes');
const clienteRoutes = require('./clienteRoutes');

const routes = Router();

routes.use('/demandas', demandaRoutes);
routes.use('/usuarios', usuarioRoutes);
routes.use('/situacoes', situacaoRoutes);
routes.use('/clientes', clienteRoutes);

module.exports = { routes };