const { NotFoundError, BadRequestError, UnauthorizedError, ConflictError } = require('node-backend-utils/classes');
const { isValidString, isValidNumber } = require('node-backend-utils/validators');
const { signJWT } = require('node-backend-utils/auth');
const { Encrypt } = require('node-backend-utils/utils');
const { getEnvConfig } = require('../config/dotenv');
const { addTotal } = require('../utils/data');
const { usuarioRepository } = require('../repositories/usuarioRepository');
const { demandaRepository } = require('../repositories/demandaRepository');

class UsuarioService {

  async login(params) {
    const { usuario, senha } = params;

    if (!isValidString(usuario)) {
      throw new BadRequestError('Nome de usuário não informado');
    }

    if (!isValidString(senha)) {
      throw new BadRequestError('Senha não informada');
    }

    const usuarios = await usuarioRepository.buscarPorLogin({ login: usuario });

    if (usuarios.length === 0) {
      throw new UnauthorizedError('Login inválido');
    }

    if (usuarios.length > 1) {
      throw new ConflictError('Mais de um usuário encontrado com o mesmo login, entre em contato com o administrador do sistema');
    }

    const usuarioDB = usuarios[0];

    if (!Encrypt.compare(senha, usuarioDB.senha)) {
      throw new UnauthorizedError('Login inválido');
    }

    const usuarioLogado = {
      id: usuarioDB.id,
      nome: usuarioDB.nome,
      adm: usuarioDB.adm,
      empresaId: usuarioDB.empresaId,
    };

    const envConfig = getEnvConfig();

    usuarioLogado.token = signJWT(usuarioLogado, envConfig.jwt.secretKey);

    return usuarioLogado;
  }

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

    const usuarios = await usuarioRepository.listar(queryParams);

    return addTotal(usuarios);
  }

  async buscarPorId(id, usuarioLogado) {
    if (!isValidNumber(id)) {
      throw new BadRequestError('Identificador do usuário inválido');
    }

    const usuario = await usuarioRepository.buscarPorId({ id, empresaId: usuarioLogado.empresaId });

    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return usuario;
  }

  async infos(usuario) {
    const usuarioDB = await usuarioRepository.buscarPorId({ id: usuario.id, empresaId: usuario.empresaId });

    if (!usuarioDB) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const total = await demandaRepository.qtdDemandasUsuario({ usuarioId: usuario.id, empresaId: usuario.empresaId });

    const infos = {
      usuario: {
        nome: usuarioDB.nome,
      },
      demandas: {
        total,
      },
    };

    return infos;
  }

  async cadastrar(params, usuarioLogado) {
    if (!isValidString(params.nome, { minLength: 1, maxLength: 100 })) {
      throw new BadRequestError('Nome inválido/não informado');
    }

    if (!isValidString(params.email, { minLength: 1, maxLength: 100 })) {
      throw new BadRequestError('Email inválido/não informado');
    }

    if (!isValidString(params.senha)) {
      throw new BadRequestError('Senha inválido/não informado');
    }

    const usuario = {
      nome: params.nome.trim(),
      email: params.email.trim(),
      senha: Encrypt.hash(params.senha),
      adm: !!params.adm,
      escolheDemandas: !!params.escolheDemandas,
      observacoes: '',
      ativo: true,
      dataCadastro: new Date(),
      empresaId: usuarioLogado.empresaId,
    };

    if (isValidString(params.observacoes)) {
      usuario.observacoes = params.observacoes.trim();
    }

    usuario.id = await usuarioRepository.cadastrar(usuario);

    return {
      id: usuario.id,
      dataCadastro: usuario.dataCadastro,
    };
  }

  async editar(params, usuarioLogado) {
    if (!isValidNumber(params.id)) {
      throw new BadRequestError('Identificador do usuário inválido');
    }

    if (!isValidString(params.nome, { minLength: 1, maxLength: 100 })) {
      throw new BadRequestError('Nome inválido/não informado');
    }

    const usuario = await usuarioRepository.buscarPorId({ id: params.id, empresaId: usuarioLogado.empresaId, senha: true })

    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    usuario.nome = params.nome.trim();
    usuario.adm = !!params.adm;
    usuario.escolheDemandas = !!params.escolheDemandas;
    usuario.dataEdicao = new Date(); // Apenas para retorno
    usuario.empresaId = usuarioLogado.empresaId;

    if (isValidString(params.observacoes)) {
      usuario.observacoes = params.observacoes.trim();
    }

    //Não é possível remover a própria permissão de administrador
    if (usuario.id === usuarioLogado.id && !usuario.adm) {
      throw new BadRequestError('Não é possível remover a própria permissão de administrador');
    }

    await usuarioRepository.editar(usuario);

    return {
      id: usuario.id,
      dataEdicao: usuario.dataEdicao,
    }
  }

  async inativar(id, usuarioLogado) {
    if (!isValidNumber(id)) {
      throw new BadRequestError('Identificador do usuário inválido');
    }

    const usuario = await usuarioRepository.buscarPorId({ id, empresaId: usuarioLogado.empresaId, senha: true })

    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (usuario.id === usuarioLogado.id) {
      throw new BadRequestError('Não é possível inativar o próprio usuário');
    }

    await usuarioRepository.inativar({ id, empresaId: usuarioLogado.empresaId });
  }
}

const usuarioService = new UsuarioService();

module.exports = { usuarioService, UsuarioService };