const pgp = require('pg-promise')(/* options */);
require('dotenv').config();

const { env } = process;
const path = `postgres://me:password@${env.DB_HOST}:5432/test`;

const db = pgp(path);

const getUsers = (request, response) => {
  console.log('Preparando conexión');
  console.log(path);
  db.one('SELECT * FROM TFG_empresa')
    .then((data) => {
      response.status(200).json(data.value);
    })
    .catch((error) => {
      console.log(`Error ${error}`);
      response.status(501).json({ status: error });
    });
};

const createEmpresa = (request, response) => {
  console.log('Creando empresa');
  db.none(`create table TFG_empresa(
    cif varchar(12) primary key,
    nombre varchar(60),
    localidad varchar(50),
    comunidad varchar(50),
    direccion varchar(100),
    telefono integer
);`)
    .then((data) => {
      response.status(200).json(data.value);
    })
    .catch((error) => {
      console.log(`Error ${error}`);
      response.status(501).json({ status: error });
    });
};

module.exports = { getUsers, createEmpresa };
