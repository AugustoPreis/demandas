const { HttpStatus } = require('node-backend-utils/enums');
const { usuarioService } = require('../services/usuarioService');
const { getEnvConfig } = require('../config/dotenv');

class UsuarioController {

  async logout(_, res, next) {
    try {
      const env = getEnvConfig();

      res.clearCookie('authToken', {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'strict', //Ajuda a evitar ataques CSRF
        path: '/',
      });

      res.status(HttpStatus.OK).json({ dataLogout: new Date() });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const env = getEnvConfig();
      const { token, ...user } = await usuarioService.login(req.body);

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'strict', //Ajuda a evitar ataques CSRF
        maxAge: 1000 * 60 * 60 * 24, //1 dia
        path: '/',
      });

      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const result = await usuarioService.listar(req.query, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const id = Number(req.params.id);

      const result = await usuarioService.buscarPorId(id, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async infos(req, res, next) {
    try {
      const result = await usuarioService.infos(req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async cadastrar(req, res, next) {
    try {
      const result = await usuarioService.cadastrar(req.body, req.user);

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  async editar(req, res, next) {
    try {
      req.body.id = Number(req.params.id);

      const result = await usuarioService.editar(req.body, req.user);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async inativar(req, res, next) {
    try {
      const result = await usuarioService.inativar(Number(req.params.id), req.user);

      res.status(HttpStatus.NO_CONTENT).json(result);
    } catch (error) {
      next(error);
    }
  }
}

const usuarioController = new UsuarioController();

module.exports = { usuarioController, UsuarioController };