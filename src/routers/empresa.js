const express = require('express');
const { db } = require('../database/connection');
const { verifyToken } = require('../jwt/jwt');
const verifyVersion = require('../controller/version');

const router = express.Router();

const query = `SELECT *
FROM TFG_empresa
ORDER BY modificado DESC
LIMIT 20;
`;
router.get('/', verifyToken, verifyVersion, async (req, res) => {
  try {
    const data = await db.any(query);
    const { versionData } = req;

    const response = {
      datos: data,
      version: versionData,
    };
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: error });
  }
});

router.get('/:cif', async (req, res) => {
  try {
    const { cif } = req.params;
    if (!cif) return res.status(400).json({ error: 'El CIF es requerido' });

    const data = await db.oneOrNone('SELECT * FROM TFG_empresa WHERE cif = $1', cif);

    if (data) return res.status(200).json({ status: true, data });

    return res.status(404).json({ error: 'La empresa no existe' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la empresa' });
  }
});

router.get('/version/:version', async (req, res) => {
  try {
    const { version } = req.params;
    if (!version) return res.status(400).json({ error: 'La versión es requerida' });

    const data = await db.any('SELECT * FROM TFG_empresa_version WHERE version = $1', version);

    if (data) return res.status(200).json({ status: true, data });

    return res.status(404).json({ error: 'La versión no existe' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la versión' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      cif, nombre, localidad, comunidad, direccion, telefono,
    } = req.body;

    if (!cif || !nombre || !localidad || !comunidad || !direccion || !telefono) {
      console.log('error en los campos');
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    await db.none('INSERT INTO TFG_empresa(cif, nombre, localidad, comunidad, direccion, telefono) VALUES($1, $2, $3, $4, $5, $6)', [cif, nombre, localidad, comunidad, direccion, telefono]);

    return res.status(201).json({
      cif, nombre, localidad, comunidad, direccion, telefono,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear la empresa' });
  }
});

router.delete('/:cif', async (req, res) => {
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

module.exports = router;
