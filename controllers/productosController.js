const Productos = require("../models/Productos");

const multer = require("multer");
const shortid = require("shortid");

const configuracionMulter = {
    storage: (fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + "../../uploads/");
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split("/")[1];
            cb(null, `${shortid.generate()}.${extension}`);
        },
    })),
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(new Error("Formato No válido"));
        }
    },
};

// pasar la configuración y el campo
const upload = multer(configuracionMulter).single("imagen");

// Sube un archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ message: error });
        }
        return next();
    });
};

// Agrega nuevos productos via POST
exports.nuevoProducto = async (req, res, next) => {
    const producto = new Productos(req.body);

    try {
        if (req.file) {
            producto.imagen = req.file.filename;
        }
        // almacenar el registro
        await producto.save();
        res.json({ message: "Se agrego un nuevo producto" });
    } catch (error) {
        // si hay error, console.log y next
        console.log(error);
        next();
    }
};

// Mostrar todos los productos
exports.mostrarProductos = async (req, res, next) => {
    try {
        // obtner todos los productos
        const productos = await Productos.find({});
        res.json(productos);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Muestra un producto en especifico (ID)
exports.mostrarProducto = async (req, res, next) => {
    try {
        const producto = await Productos.findById(req.params.idProducto);

        if (!producto) {
            res.json({ message: "El producto no existe" });
            return;
        }
        // si el producto existe - mostrar
        res.json(producto);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Actualizar un producto por su ID
exports.actualizarProducto = async (req, res, next) => {
    try {
        let nuevoProducto = req.body;

        if (req.file) {
            nuevoProducto.imagen = req.file.filename;
        } else {
            let productoAnterior = await Productos.findById(
                req.params.idProducto
            );
            nuevoProducto.imagen = productoAnterior.imagen;
        }
        let producto = await Productos.findOneAndUpdate(
            { _id: req.params.idProducto },
            nuevoProducto,
            { new: true }
        );
        res.json(producto);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Eliminar producto por su ID
exports.eliminarProducto = async (req, res, next) => {
    try {
        await Productos.findOneAndDelete({ _id: req.params.idProducto });
        res.json({ message: "El producto se ha eliminado" });
    } catch (error) {
        res.json(error);
        next();
    }
};

// Buscar productos
exports.buscarProducto = async (req, res, next) => {
    try {
        const { query } = req.params;
        const producto = await Productos.find({
            nombre: new RegExp(query, "i"),
        });
        res.json(producto);
    } catch (error) {
        res.json(error);
        next();
    }
};
