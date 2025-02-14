const Usuarios = require("../models/Usuarios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.registrarUsuario = async (req, res) => {
    // leer los datos del usuario y colocarlos en Usuarios
    const usuario = new Usuarios(req.body);
    // hashear el password
    usuario.password = await bcrypt.hash(req.body.password, 12);
    // guardar el usuario
    try {
        await usuario.save();
        res.json({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.log(error);
        res.json({ message: "Hubo un error" });
    }
};

exports.autenticarUsuario = async (req, res) => {
    // buscar el usuario
    const { email, password } = req.body;
    const usuario = await Usuarios.findOne({ email });

    try {
        if (!usuario) {
            // Si el usuario no existe
            res.status(401).json({ message: "El usuario no existe" });
        } else {
            // Si el usuario existe, verificar el password
            if (!bcrypt.compareSync(password, usuario.password)) {
                // password incorrecto
                res.status(401).json({ message: "Password incorrecto" });
            } else {
                // password correcto, firmar el token
                const token = jwt.sign(
                    {
                        email: usuario.email,
                        nombre: usuario.nombre,
                        _id: usuario._id,
                    },
                    "secret", // Esto deberia ir a las variables de entorno
                    {
                        expiresIn: "1h",
                    }
                );
                // retornar el token
                res.json({ token });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
