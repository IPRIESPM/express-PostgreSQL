const pgp = require('pg-promise')(/* options */);
require('dotenv').config();

const { env } = process;

let dbInstance = null;

const connectionString = `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}?ssl=true&sslrootcert=${env.DB_CERT}`;

const getDatabaseInstance = () => {
  if (!dbInstance) {
    dbInstance = pgp(connectionString);
  }

  return dbInstance;
};

module.exports = {
  db: getDatabaseInstance(),
};
