const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // autorizacion por el header
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        const error = new Error("No autenticado, no hay JWT");
        error.statusCode = 401;
        throw error;
    }

    // obtener el token y verificarlo
    const token = authHeader.split(" ")[1];
    let revizarToken;
    try {
        revizarToken = jwt.verify(token, "secret");
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    // Es valido, pero hay algun error
    if (!revizarToken) {
        const error = new Error("No autenticado");
        error.statusCode = 401;
        throw error;
    }

    next();
};
