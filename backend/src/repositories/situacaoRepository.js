const database = require('../config/database/database');

class SituacaoRepository {

  async listar(params) {
    const query = `
      SELECT
        situacoes.id,
        situacoes.descricao,
        COUNT(situacoes.id) OVER() AS total
      FROM situacoes
      WHERE situacoes.empresa_id = $1
        AND (
          $2::varchar IS NULL
          OR situacoes.descricao ILIKE '%' || $2 || '%'
        )
      ORDER BY situacoes.descricao
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

const situacaoRepository = new SituacaoRepository();

module.exports = { situacaoRepository, SituacaoRepository };