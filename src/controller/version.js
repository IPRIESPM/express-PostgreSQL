const { db } = require('../database/connection');

async function verifyVersion(req, res, next) {
  const { version, table } = req.headers;

  if (!version || !table) {
    console.log('No version provided');
    return res.status(401).send({ error: 'No version or table provided' });
  }
  const tableParsed = `tfg_${table}`;
  try {
    // Comprobamos en la base de datos que la versión es válida
    const [data] = await db.any('SELECT version_n FROM TFG_versiones WHERE tabla = $1', tableParsed);

    // Si no existe la versión en la base de datos
    if (!data) return res.status(404).send({ error: 'Version not found in database' });

    // Si la versión es la misma que la que tenemos en la base de datos
    if (data.version_n.toString() === version.toString()) {
      return res.status(304).send({ error: 'Version not updated' });
    }
    // Si la versión es distinta a la que tenemos en la base de datos
    // Guardamos la versión en el objeto req, para que el siguiente middleware pueda acceder a ella
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
