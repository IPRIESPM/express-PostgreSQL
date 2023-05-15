const pgp = require('pg-promise')(/* options */);
require('dotenv').config();

const { env } = process;
const path = `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}?ssl=true&sslrootcert=${env.DB_CERT}`;

const db = pgp(path);

const getUsers = async (request, response) => {
  console.log('Preparando conexión');
  console.log(path);
  try {
    const data = await db.one('SELECT * FROM TFG_empresa');
    response.status(200).json(data.value);
  } catch (error) {
    console.log(`Error ${error}`);
    response.status(501).json({ status: error });
  }
};

const createEmpresa = async (req, res) => {
  console.log('Creando empresa');
  try {
    const data = await db.none(`create table TFG_empresa(
      cif varchar(12) primary key,
      nombre varchar(60),
      localidad varchar(50),
      comunidad varchar(50),
      direccion varchar(100),
      telefono integer
    );`);
    res.json(data);
  } catch (error) {
    res.json('error');
  }
};

module.exports = { getUsers, createEmpresa };
