const { db } = require('../database/connection');

async function verifyVersion(req, res, next) {
  // Pedimos el token en el header de la petición
  const { version, table } = req.headers;

  // Comprobamos que la versión no es nula
  if (!version || !table) {
    console.log('No version provided');
    return res.status(401).send({ error: 'No version or table provided' });
  }
  const tableParsed = `tfg_${table}`;
  try {
    // Comprobamos en la base de datos que la versión es válida
    console.log(`Comprobando versión:${version} de la tabla: ${table}, en la base de datos`);
    const [data] = await db.any('SELECT version_n FROM TFG_versiones WHERE tabla = $1', tableParsed);

    // Si no existe la versión en la base de datos
    if (!data) return res.status(404).send({ error: 'Version not found in database' });

    // Si la versión es la misma que la que tenemos en la base de datos
    if (data.version_n.toString() === version.toString()) {
      console.log(`La versión ${version} de la tabla ${table} es la misma que la que tenemos en la base de datos`);
      return res.status(304).send({ error: 'Version not updated' });
    }
    console.log(`La versión ${version}  de la tabla ${table} es distinta a la que tenemos en la base de datos ${data.version_n}`);
    // Si la versión es distinta a la que tenemos en la base de datos
    // Guardamos la versión en el objeto req, para que el siguiente middleware pueda acceder a ella
    console.log(data);
    req.versionData = data.version_n;

    // Pasamos al siguiente middleware
    return next();
  } catch (err) {
    console.log(err);
    // error en la consulta
    return res.status(401).send({ error: 'Error en la consulta' });
  }
}

module.exports = verifyVersion;
