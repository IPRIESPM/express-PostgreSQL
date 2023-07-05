const jws = require('jsonwebtoken');
require('dotenv').config();

function generateToken(dni, nombre, telefono) {
  const payload = { dni, nombre, telefono };
  const options = { expiresIn: '6d' };

  // firma el token con el secret que tenemos en el .env
  // y le damos un tiempo de expiración de 6 días
  const token = jws.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

function verifyToken(req, res, next) {
  // Pedimos el token en el header de la petición
  const token = req.headers.authorization;

  if (!token) return res.status(401).send({ error: 'No token provided' });

  try {
    // Comprobamos que el token es válido
    const decoded = jws.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Pasamos al siguiente middleware
    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Invalid token' });
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
