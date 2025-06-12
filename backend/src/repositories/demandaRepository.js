const database = require('../config/database/database');

class DemandaRepository {

  async listar(params) {
    let query = `
      SELECT
        demandas.id,
        demandas.numero,
        demandas.titulo,
        demandas.descricao,
        demandas.prioridade,
        demandas.data_cadastro "dataCadastro",
        demandas.data_previsao "dataPrevisao",
        json_build_object('id', situacoes.id, 'descricao', situacoes.descricao) "situacao",
        COUNT(demandas.id) OVER() "total"
      FROM demandas
        INNER JOIN situacoes ON situacoes.id = demandas.situacao_id
      WHERE demandas.empresa_id = $1
        AND demandas.usuario_id = $2
        AND demandas.ativo IS TRUE
        AND (
          $3::varchar IS NULL
          OR demandas.numero::varchar ILIKE '%' || $3::varchar || '%'
        )
        AND (
          $4::varchar IS NULL
          OR demandas.titulo::varchar ILIKE '%' || $4::varchar || '%'
          OR demandas.descricao::varchar ILIKE '%' || $4::varchar || '%'
        )
        AND (
          $5::int IS NULL
          OR demandas.situacao_id = $5::int
        )
    `;

    //Quando mostrar a demanda atual em que o usuário está trabalhando
    //Não deve mostrar denovo na listagem, visto que já vai aparecer separadamente
    if (params.mostrarTrabalhandoAgora) {
      query += `
        AND NOT EXISTS (
          SELECT
            trabalhos_demanda.id
          FROM trabalhos_demanda
          WHERE trabalhos_demanda.demanda_id = demandas.id
            AND trabalhos_demanda.empresa_id = demandas.empresa_id
            AND trabalhos_demanda.data_fim IS NULL
            AND trabalhos_demanda.usuario_id = $2
        )
      `;
    }

    switch (params.ordem) {
      case 'titulo':
        query += ' ORDER BY demandas.titulo';
        break;
      case 'prioridade':
        query += ' ORDER BY demandas.titulo';
        break;
      case 'dataPrevisao':
        query += ' ORDER BY demandas.data_previsao';
        break;
      case 'numero':
      default:
        query += ' ORDER BY demandas.numero';
        break;
    }

    query += params.direcao === 'D' ? ' DESC' : ' ASC';
    query += '\nLIMIT 10 OFFSET ($6 - 1) * 10';

    const rows = await database.execute(query, [
      params.empresaId,
      params.usuarioId,
      params.numero,
      params.descricao,
      params.situacaoId,
      params.pagina,
    ]);

    return rows;
  }

  async buscarPorId(params) {
    const query = `
      SELECT
        demandas.id,
        demandas.numero,
        demandas.titulo,
        demandas.descricao,
        demandas.prioridade,
        demandas.data_previsao "dataPrevisao",
        demandas.data_cadastro "dataCadastro",
        demandas.ativo,
        json_build_object('id', usuarios.id, 'nome', usuarios.nome) "usuario",
        json_build_object('id', clientes.id, 'nome', clientes.nome) "cliente",
        json_build_object('id', situacoes.id, 'descricao', situacoes.descricao) "situacao"
      FROM demandas
        INNER JOIN clientes ON clientes.id = demandas.cliente_id
        INNER JOIN situacoes ON situacoes.id = demandas.situacao_id
        LEFT JOIN usuarios ON usuarios.id = demandas.usuario_id
      WHERE demandas.id = $1
        AND demandas.empresa_id = $2
    `;

    const rows = await database.execute(query, [params.id, params.empresaId]);

    return rows[0];
  }

  async abertas(params) {
    const query = `
      SELECT
        demandas.id,
        demandas.numero,
        demandas.titulo,
        demandas.descricao,
        demandas.prioridade,
        demandas.data_previsao "dataPrevisao",
        json_build_object('id', situacoes.id, 'descricao', situacoes.descricao) "situacao"
      FROM trabalhos_demanda
        INNER JOIN demandas ON demandas.id = trabalhos_demanda.demanda_id
        INNER JOIN situacoes ON situacoes.id = demandas.situacao_id
      WHERE trabalhos_demanda.usuario_id = $1
      	AND trabalhos_demanda.empresa_id = $2
        AND trabalhos_demanda.data_fim IS NULL
        AND demandas.ativo IS TRUE
    `;

    const rows = await database.execute(query, [params.usuarioId, params.empresaId]);

    return rows;
  }

  async historico(params) {
    const query = `
      SELECT
        trabalhos_demanda.id,
        trabalhos_demanda.data_inicio "dataInicio",
        trabalhos_demanda.data_fim "dataFim"
      FROM trabalhos_demanda
      WHERE trabalhos_demanda.demanda_id = $1
        AND trabalhos_demanda.empresa_id = $2
      ORDER BY trabalhos_demanda.data_inicio DESC
    `;

    const rows = await database.execute(query, [params.demandaId, params.empresaId]);

    return rows;
  }

  async qtdDemandasUsuario(params) {
    const query = `
      SELECT
        count(demandas.id) "total"
      FROM demandas
      WHERE demandas.usuario_id = $1
        AND demandas.empresa_id = $2
        AND demandas.ativo IS TRUE
    `;

    const rows = await database.execute(query, [params.usuarioId, params.empresaId]);

    return rows[0]?.total || 0;
  }

  async proximoNumero(params) {
    const query = `
      SELECT
        COALESCE(MAX(demandas.numero), 0) + 1 "numero"
      FROM demandas
      WHERE demandas.empresa_id = $1
        AND EXTRACT(YEAR FROM demandas.data_cadastro) = EXTRACT(YEAR FROM current_date)
    `;

    const rows = await database.execute(query, [params.empresaId]);

    return rows[0]?.numero || 1;
  }

  async cadastrar(params) {
    const query = `
      INSERT INTO demandas (
        numero,
        titulo,
        descricao,
        prioridade,
        data_previsao,
        situacao_id,
        usuario_id,
        cliente_id,
        ativo,
        data_cadastro,
        empresa_id
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
      ) RETURNING id
    `;

    const rows = await database.execute(query, [
      params.numero,
      params.titulo,
      params.descricao,
      params.prioridade,
      params.dataPrevisao,
      params.situacaoId,
      params.usuarioId,
      params.clienteId,
      params.ativo,
      params.dataCadastro,
      params.empresaId,
    ]);

    return rows[0].id;
  }

  async iniciarTrabalho(params) {
    const query = `
      INSERT INTO trabalhos_demanda (
        demanda_id,
        usuario_id,
        data_inicio,
        situacao_id,
        data_cadastro,
        empresa_id
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      ) RETURNING id
    `;

    const rows = await database.execute(query, [
      params.demandaId,
      params.usuarioId,
      params.dataInicio,
      params.situacaoId,
      params.dataCadastro,
      params.empresaId,
    ]);

    return rows[0].id;
  }

  async encerrarTrabalho(params) {
    const query = `
      UPDATE trabalhos_demanda
      SET data_fim = $1
      WHERE demanda_id = $2
        AND usuario_id = $3
        AND empresa_id = $4
        AND data_fim IS NULL
      RETURNING data_fim "dataFim"
    `;

    const rows = await database.execute(query, [
      params.dataFim,
      params.demandaId,
      params.usuarioId,
      params.empresaId,
    ]);

    return rows[0].dataFim;
  }

  async enviar(params) {
    const query = `
      UPDATE demandas
      SET usuario_id = $1,
        situacao_id = $2
      WHERE id = $3
        AND empresa_id = $4
    `;

    await database.execute(query, [
      params.usuarioId,
      params.situacaoId,
      params.demandaId,
      params.empresaId,
    ]);
  }
}

const demandaRepository = new DemandaRepository();

module.exports = { demandaRepository, DemandaRepository };