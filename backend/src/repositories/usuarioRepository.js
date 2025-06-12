const database = require('../config/database/database');

class UsuarioRepository {
  async listar(params) {
    const query = `
      SELECT
        usuarios.id,
        usuarios.nome,
        usuarios.adm,
        COUNT(usuarios.id) OVER() "total"
      FROM usuarios
      WHERE usuarios.empresa_id = $1
        AND usuarios.ativo IS TRUE
        AND (
          $2::varchar IS NULL
          OR usuarios.nome ILIKE '%' || $2 || '%'
        )
      ORDER BY usuarios.nome
      LIMIT 10 OFFSET ($3 - 1) * 10
    `;

    const rows = await database.execute(query, [
      params.empresaId,
      params.descricao,
      params.pagina,
    ]);

    return rows;
  }

  async buscarPorId(params) {
    const query = `
      SELECT
        usuarios.id,
        usuarios.nome,
        usuarios.observacoes,
        usuarios.adm,
        usuarios.ativo,
        usuarios.email,
        usuarios.escolhe_demandas "escolheDemandas",
        usuarios.data_cadastro "dataCadastro"
        ${params.senha ? ',\nusuarios.senha' : ''}
      FROM usuarios
      WHERE usuarios.id = $1
        AND usuarios.empresa_id = $2
    `;

    const rows = await database.execute(query, [params.id, params.empresaId]);

    return rows[0];
  }

  async buscarPorLogin(params) {
    const query = `
      SELECT
        usuarios.id,
        usuarios.nome,
        usuarios.adm,
        usuarios.senha,
        usuarios.empresa_id "empresaId"
      FROM usuarios
        INNER JOIN empresas ON empresas.id = usuarios.empresa_id
      WHERE usuarios.ativo IS TRUE
        AND empresas.ativo IS TRUE
        AND usuarios.email ILIKE $1
    `;

    const rows = await database.execute(query, [params.login]);

    return rows;
  }

  async cadastrar(params) {
    const query = `
      INSERT INTO usuarios (
        nome,
        email,
        senha,
        observacoes,
        adm,
        escolhe_demandas,
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
        $9
      ) RETURNING id
    `;

    const rows = await database.execute(query, [
      params.nome,
      params.email,
      params.senha,
      params.observacoes,
      params.adm,
      params.escolheDemandas,
      params.ativo,
      params.dataCadastro,
      params.empresaId,
    ]);

    return rows[0].id;
  }

  async editar(params) {
    const query = `
      UPDATE usuarios
      SET
        nome = $3,
        observacoes = $4,
        adm = $5,
        escolhe_demandas = $6
      WHERE id = $1
        AND empresa_id = $2
    `;

    await database.execute(query, [
      params.id,
      params.empresaId,
      params.nome,
      params.observacoes,
      params.adm,
      params.escolheDemandas,
    ]);
  }

  async inativar(params) {
    const query = `
      UPDATE usuarios
      SET ativo = FALSE
      WHERE id = $1
        AND empresa_id = $2
    `;

    await database.execute(query, [params.id, params.empresaId]);
  }
}

const usuarioRepository = new UsuarioRepository();

module.exports = { usuarioRepository, UsuarioRepository };