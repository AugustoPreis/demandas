const { Pool } = require('pg');
const { isValidString } = require('node-backend-utils/validators');
const { getEnvConfig } = require('../dotenv');

async function connect(exitOnError = false) {
  const { db } = getEnvConfig();
  const pool = new Pool({
    host: db.host,
    database: db.database,
    password: db.password,
    user: db.username,
    port: db.port,
  });

  try {
    const client = await pool.connect();

    return client;
  } catch (error) {
    showDatabaseError({ error, connect: true });

    if (exitOnError) {
      process.exit(1);
    } else {
      throw error;
    }
  }
}

async function execute(query, params, defaultClient) {
  const client = defaultClient || (await connect());

  try {
    const result = await client.query(query, params);

    if (!defaultClient) {
      await commit(client, false);
    }

    return result.rows;
  } catch (error) {
    if (!defaultClient) {
      await rollback(client, false);
    }

    showDatabaseError({ error, query, params });

    throw error;
  } finally {
    if (!defaultClient) {
      await client.release();
    }
  }
}

async function commit(client, release = true) {
  if (!client) {
    throw new Error('Pool não informada');
  }

  await client.query('COMMIT');

  if (release) {
    await client.release();
  }
}

async function rollback(client, release = true) {
  if (!client) {
    throw new Error('Pool não informada');
  }

  await client.query('ROLLBACK');

  if (release) {
    await client.release();
  }
}

function showDatabaseError(context) {
  const { connect, error, query, params } = context;
  let message = '';

  if (error instanceof Error) {
    message = error.message || '';
  }

  if (isValidString(query)) {
    message += `\nquery: ${query}`;
  }

  if (Array.isArray(params) && params.length > 0) {
    message += `\nparams: ${JSON.stringify(params.map((param) => Buffer.isBuffer(param) ? '[Buffer]' : param))}`;
  }

  if (connect) {
    message = `Erro ao conectar com o banco de dados: ${message}`;
  } else {
    message = `Erro ao executar SQL: ${message}`;
  }

  console.log(message);
}

module.exports = { connect, execute, commit, rollback };