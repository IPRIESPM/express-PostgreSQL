const pgp = require('pg-promise')();
require('dotenv').config();

const { env } = process;

// Creamos un singleton para la conexión a la base de datos

let dbInstance = null;

// Creamos la cadena de conexión a la base de datos
// Notas:
// si no se va a usar SSL, quitar el parámetro ?ssl=true&sslrootcert=${env.DB_CERT}
// si se va a usar SSL, hay que copiar el certificado de la base de datos en la carpeta src\database

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
