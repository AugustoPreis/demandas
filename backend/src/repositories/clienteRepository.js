const database = require('../config/database/database');

class ClienteRepository {

  async listar(params) {
    const query = `
      SELECT
        clientes.id,
        clientes.nome,
        clientes.telefone,
        COUNT(clientes.id) OVER() "total"
      FROM clientes
      WHERE clientes.empresa_id = $1
        AND clientes.ativo IS TRUE
        AND (
          $2::varchar IS NULL
          OR clientes.nome ILIKE '%' || $2 || '%'
        )
      ORDER BY clientes.nome
      LIMIT 10 OFFSET ($3 - 1) * 10
    `;

    const rows = await database.execute(query, [
      params.empresaId,
      params.descricao,
      params.pagina,
    ]);

    return rows;
  }
}

const clienteRepository = new ClienteRepository();

module.exports = { clienteRepository, ClienteRepository };