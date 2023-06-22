// encriptamos contraseña
const bcrypt = require('bcryptjs');

async function encriptarPassword(req, res, next) {
    try {
        const { contrasena } = req.body;
        if (!contrasena) return res.status(400).json({ status: 'Bad request' });
        const salt = bcrypt.genSaltSync(10);
        const haltedPassword = await bcrypt.hashSync(contrasena, salt);
        req.body.contrasena = haltedPassword;
        next();
    } catch (error) {
        return res.status(501).json({ status: error });
    }
}

async function comprobarPassword(contrasena, password) {
    try {
        const result = await bcrypt.compareSync(contrasena, password);
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = { encriptarPassword, comprobarPassword };