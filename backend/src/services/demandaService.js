const { BadRequestError, NotFoundError, ConflictError, ForbiddenError } = require('node-backend-utils/classes');
const { differenceInMilliseconds } = require('date-fns');
const { isValidNumber, isValidString } = require('node-backend-utils/validators');
const { addTotal } = require('../utils/data');
const { usuarioRepository } = require('../repositories/usuarioRepository');
const { demandaRepository } = require('../repositories/demandaRepository');

class DemandaService {

  async listar(params, usuarioLogado) {
    const { numero, descricao, situacaoId, ordem, pagina, mostrarHoras, mostrarTrabalhandoAgora } = params;
    const queryParams = {
      numero: null,
      descricao: null,
      situacaoId: null,
      ordem: 'numero',
      direcao: 'D',
      pagina: 1,
      mostrarHoras: mostrarHoras === 'true',
      mostrarTrabalhandoAgora: mostrarTrabalhandoAgora === 'true',
      usuarioId: usuarioLogado.id,
      empresaId: usuarioLogado.empresaId,
    };

    if (isValidString(numero, { pattern: /^\d+$/ })) {
      queryParams.numero = numero;
    }

    if (isValidString(descricao)) {
      queryParams.descricao = descricao.trim();
    }

    if (isValidString(situacaoId, { pattern: /^\d+$/ })) {
      queryParams.situacaoId = situacaoId;
    }

    if (['numero', 'titulo', 'prioridade', 'dataPrevisao'].includes(ordem)) {
      queryParams.ordem = ordem;
    }

    if (['A', 'D'].includes(params.direcao)) {
      queryParams.direcao = params.direcao;
    }

    if (isValidString(pagina, { pattern: /^\d+$/ })) {
      queryParams.pagina = Number(pagina);
    }

    const demandas = await demandaRepository.listar(queryParams);
    let trabalhandoAgora = null;

    if (mostrarTrabalhandoAgora) {
      trabalhandoAgora = await this.buscarTrabalhandoAgora(usuarioLogado);
    }

    if (mostrarHoras) {
      if (trabalhandoAgora) {
        trabalhandoAgora.horasTrabalhadas = await this.calcularHorasTrabalhadas(trabalhandoAgora.id, usuarioLogado);
      }

      for (const demanda of demandas) {
        demanda.horasTrabalhadas = await this.calcularHorasTrabalhadas(demanda.id, usuarioLogado);
      }
    }

    const result = addTotal(demandas);

    return { ...result, trabalhandoAgora };
  }

  async buscarPorId(id, usuarioLogado) {
    if (!isValidNumber(id)) {
      throw new BadRequestError('Identificador da demanda inválido');
    }

    const demanda = await demandaRepository.buscarPorId({ id, empresaId: usuarioLogado.empresaId });

    if (!demanda) {
      throw new NotFoundError('Demanda não encontrada');
    }

    demanda.horasTrabalhadas = await this.calcularHorasTrabalhadas(demanda.id, usuarioLogado);
    demanda.historico = await demandaRepository.historico({ demandaId: demanda.id, empresaId: usuarioLogado.empresaId });

    return demanda;
  }

  async cadastrar(params, usuarioLogado) {
    const { titulo, descricao, prioridade, dataPrevisao, situacaoId, clienteId, usuarioId } = params;

    if (!isValidString(titulo, { minLength: 1, maxLength: 100 })) {
      throw new BadRequestError('Título é obrigatório');
    }

    if (!isValidString(prioridade, { pattern: /^(ALTA|MEDIA|BAIXA)$/ })) {
      throw new BadRequestError('Prioridade inválida/não informada');
    }

    if (dataPrevisao && isNaN(Date.parse(dataPrevisao))) {
      throw new BadRequestError('Data de previsão inválida');
    }

    if (!isValidNumber(situacaoId)) {
      throw new BadRequestError('Situação inválida/não informada');
    }

    if (clienteId && !isValidNumber(clienteId)) {
      throw new BadRequestError('Cliente inválido/não informado');
    }

    if (usuarioId && !isValidNumber(usuarioId)) {
      throw new BadRequestError('Usuário inválido/não informado');
    }

    const demanda = {
      titulo: titulo.trim(),
      descricao: descricao?.trim(),
      prioridade: prioridade.toUpperCase(),
      dataPrevisao: dataPrevisao ? new Date(dataPrevisao) : null,
      situacaoId: Number(situacaoId),
      clienteId: clienteId ? Number(clienteId) : null,
      usuarioId: usuarioId ? Number(usuarioId) : null,
      dataCadastro: new Date(),
      ativo: true,
      empresaId: usuarioLogado.empresaId,
    };

    demanda.numero = await demandaRepository.proximoNumero({ empresaId: usuarioLogado.empresaId });

    demanda.id = await demandaRepository.cadastrar(demanda);

    const result = {
      id: demanda.id,
      numero: demanda.numero,
      dataCadastro: demanda.dataCadastro,
    };

    if (demanda.usuarioId) {
      const usuarioDemanda = await usuarioRepository.buscarPorId({ id: demanda.usuarioId, empresaId: usuarioLogado.empresaId });

      result.usuario = {
        id: usuarioDemanda?.id,
        nome: usuarioDemanda?.nome,
      };
    }

    return result;
  }

  async iniciarTrabalho(demandaId, usuarioLogado) {
    if (!isValidNumber(demandaId)) {
      throw new BadRequestError('Identificador da demanda inválido');
    }

    const demanda = await demandaRepository.buscarPorId({ id: demandaId, empresaId: usuarioLogado.empresaId });

    if (!demanda) {
      throw new NotFoundError('Demanda não encontrada');
    }

    const trabalhandoAgora = await this.buscarTrabalhandoAgora(usuarioLogado);

    if (trabalhandoAgora) {
      throw new ConflictError(`Você já está trabalhando na demanda Nº ${demanda.numero}.`);
    }

    const trabalhoId = await demandaRepository.iniciarTrabalho({
      demandaId,
      usuarioId: usuarioLogado.id,
      situacaoId: demanda.situacao.id,
      dataInicio: new Date(),
      dataCadastro: new Date(),
      empresaId: usuarioLogado.empresaId,
    });

    return { trabalhoId };
  }

  async encerrarTrabalho(demandaId, usuarioLogado) {
    //Verifica se está trabalhando na demanda

    if (!isValidNumber(demandaId)) {
      throw new BadRequestError('Identificador da demanda inválido');
    }

    const demanda = await demandaRepository.buscarPorId({ id: demandaId, empresaId: usuarioLogado.empresaId });

    if (!demanda) {
      throw new NotFoundError('Demanda não encontrada');
    }

    const trabalhandoAgora = await this.buscarTrabalhandoAgora(usuarioLogado);

    if (!trabalhandoAgora || trabalhandoAgora.id !== demandaId) {
      throw new ConflictError(`Você não está trabalhando na demanda Nº ${demanda.numero}.`);
    }

    const dataEncerramento = await demandaRepository.encerrarTrabalho({
      demandaId,
      dataFim: new Date(),
      usuarioId: usuarioLogado.id,
      empresaId: usuarioLogado.empresaId,
    });

    return { dataEncerramento };
  }

  async enviar(params, usuarioLogado) {
    const { demandaId, situacaoId, usuarioId } = params;

    if (!isValidNumber(demandaId)) {
      throw new BadRequestError('Identificador da demanda inválido');
    }

    if (!isValidNumber(usuarioId)) {
      throw new BadRequestError('Identificador do usuário inválido');
    }

    if (!isValidNumber(situacaoId)) {
      throw new BadRequestError('Identificador da situação inválido');
    }

    const demanda = await demandaRepository.buscarPorId({ id: demandaId, empresaId: usuarioLogado.empresaId });

    if (!demanda) {
      throw new NotFoundError('Demanda não encontrada');
    }

    if (demanda.usuario.id != usuarioLogado.id) {
      throw new ForbiddenError(`Você não pode enviar a demanda Nº ${demanda.numero} porque não é o responsável por ela.`);
    }

    const dataEnvio = await demandaRepository.enviar({
      demandaId,
      situacaoId,
      usuarioId,
      empresaId: usuarioLogado.empresaId,
    });

    return { dataEnvio };
  }

  async buscarTrabalhandoAgora(usuarioLogado) {
    const demandas = await demandaRepository.abertas({ usuarioId: usuarioLogado.id, empresaId: usuarioLogado.empresaId });

    if (demandas.length > 1) {
      throw new ConflictError(`O usuário ${usuarioLogado.nome} parece estar trabalhando em mais de uma demanda ao mesmo tempo. Entre em contato com o administrador do sistema para mais informações.`);
    }

    return demandas[0] || null;
  }

  async calcularHorasTrabalhadas(demandaId, usuarioLogado) {
    const historico = await demandaRepository.historico({ demandaId, empresaId: usuarioLogado.empresaId });

    if (historico.length === 0) {
      return '00:00';
    }

    const totalMs = historico.reduce((acc, item) => {
      //Quando não tiver finalizado o trabalho, considera a contagem até o momento atual
      const fim = item.dataFim || new Date();

      return acc + differenceInMilliseconds(fim, item.dataInicio);
    }, 0);

    const totalMin = Math.floor(totalMs / 1000 / 60);
    const horas = Math.floor(totalMin / 60);
    const minutos = totalMin % 60;

    return [
      horas.toString().padStart(2, '0'),
      minutos.toString().padStart(2, '0'),
    ].join(':');
  }
}

const demandaService = new DemandaService();

module.exports = { demandaService, DemandaService };