function getEnvConfig() {
  const {
    PORT,
    JWT_SECRET,
    DB_NAME,
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_PORT,
  } = process.env;

  return {
    port: Number(PORT),
    nodeEnv: process.env.NODE_ENV,
    jwt: {
      secretKey: JWT_SECRET,
    },
    db: {
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      host: DB_HOST,
    },
  };
}

module.exports = { getEnvConfig };