const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");

require("dotenv").config();

// Cors
const cors = require("cors");

// Conectar a la base de datos
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
});

// Crear servidor
const app = express();

// Carpeta publica
app.use(express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definir un dominio para recibir peticiones
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        // Revizar si la peticion viene de un servidor en whitelist
        const existe = whitelist.some((dominio) => dominio === origin);
        if (existe) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
};

// Habilitar CORS
app.use(cors(corsOptions));

// Rutas
app.use("/", routes());

app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
});
