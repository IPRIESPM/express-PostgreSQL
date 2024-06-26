const express = require('express');
const { db } = require('../database/connection');
const { verifyToken } = require('../jwt/jwt');
const verifyVersion = require('../controller/version');

const router = express.Router();

router.get('/', verifyToken, verifyVersion, async (req, res) => {
  const query = `SELECT e.cif, e.nombre AS nombre, pr.nombre AS nombre_profesor, pr.dni as
    dni_profesor, e.telefono, e.direccion, e.comunidad , e.localidad
    FROM tfg_empresa e
  LEFT JOIN tfg_profesores pr ON e.profesor_encargado = pr.dni;`;

  try {
    const data = await db.any(query);
    const { versionData } = req;

    const response = {
      data,
      version: versionData,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: error });
  }
});

router.get('/:cif', verifyToken, async (req, res) => {
  const queryEmpresa = `SELECT
    e.*,
    pr.nombre AS nombre_profesor,
    pr.dni AS dni_profesor
  FROM tfg_empresa e
  LEFT JOIN tfg_profesores pr ON e.profesor_encargado = pr.dni
  WHERE e.cif = $1`;

  const queryContactos = `SELECT *
    FROM tfg_contactos c
    JOIN tfg_contacto_empresa ce ON c.n = ce.contacto_n
    JOIN tfg_empresa e ON ce.cif_empre = e.cif
    WHERE e.cif = $1;
  `;

  const queryPuestos = 'SELECT cod, anyo, vacantes, ciclo, descrip, horario FROM tfg_puestos WHERE cif_empresa = $1;';
  try {
    const { cif } = req.params;
    if (!cif) return res.status(400).json({ error: 'El CIF es requerido' });

    const dataEmpresa = await db.oneOrNone(queryEmpresa, cif);
    const dataContactos = await db.any(queryContactos, cif);
    const dataPuestos = await db.any(queryPuestos, cif);

    const data = {
      empresa: dataEmpresa,
      contactos: dataContactos,
      puestos: dataPuestos,
    };

    if (dataEmpresa) return res.status(200).json(data);
    return res.status(404).json({ error: 'La empresa no existe' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la empresa' });
  }
});

router.get('/version/:version', async (req, res) => {
  try {
    const { version } = req.params;
    if (!version) return res.status(400).json({ error: 'La versión es requerida' });

    const data = await db.any('SELECT tfg_empresa FROM TFG_version WHERE version = $1', version);

    if (data) return res.status(200).json({ status: true, data });

    return res.status(404).json({ error: 'La versión no existe' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la versión' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      cif, nombre, localidad, comunidad, direccion, telefono, profesor,
    } = req.body;
    if (!cif || !nombre || !profesor) {
      console.log('error en los campos');
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    await db.none('INSERT INTO TFG_empresa(cif, nombre, localidad, comunidad, direccion, telefono, profesor_encargado ) VALUES($1, $2, $3, $4, $5, $6, $7)', [cif, nombre, localidad, comunidad, direccion, telefono, profesor]);

    return res.status(201).json({
      cif, nombre, localidad, comunidad, direccion, telefono,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear la empresa' });
  }
});

router.delete('/:cif', verifyToken, async (req, res) => {
  const { cif } = req.params;
  try {
    const exist = await db.oneOrNone('SELECT 1 FROM TFG_empresa WHERE cif = $1', cif);
    if (!exist) return res.status(404).json({ error: 'La empresa no existe' });
    await db.none('DELETE FROM TFG_empresa WHERE cif = $1', cif);

    return res.status(200).json({ message: 'Empresa eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar la empresa' });
  }
});

router.put('/:cif', verifyToken, async (req, res) => {
  const {
    cif, nombre, localidad, comunidad, direccion, telefono, profesor,
  } = req.body;
  try {
    const exist = await db.oneOrNone('SELECT 1 FROM TFG_empresa WHERE cif = $1', cif);
    if (!exist) return res.status(404).json({ error: 'La empresa no existe' });

    await db.none('UPDATE TFG_empresa SET nombre = $1, localidad = $2, comunidad = $3, direccion = $4, telefono = $5 , profesor_encargado = $7 WHERE cif = $6', [nombre, localidad, comunidad, direccion, telefono, cif, profesor]);

    return res.status(200).json({
      cif, nombre, localidad, comunidad, direccion, telefono, profesor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al actualizar la empresa' });
  }
});

module.exports = router;
