const Pedidos = require("../models/Pedidos");

exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedidos(req.body);

    try {
        // almacenar el registro
        await pedido.save();
        res.json({ message: "Se agrego un nuevo pedido" });
    } catch (error) {
        // si hay error, console.log y next
        console.log(error);
        next();
    }
};

// Muestra todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
    try {
        // obtner todos los pedidos
        const pedidos = await Pedidos.find({}).populate("cliente").populate({
            path: "pedido.producto",
            model: "Productos",
        });
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Muestra un pedido en especifico (ID)
exports.mostrarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedidos.findById(req.params.idPedido)
            .populate("cliente")
            .populate({
                path: "pedido.producto",
                model: "Productos",
            });
        if (!pedido) {
            res.json({ message: "El pedido no existe" });
            return next();
        }
        // si el pedido existe - mostrar
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Actualizar un pedido por su ID
exports.actualizarPedido = async (req, res, next) => {
    try {
        const pedido = await Pedidos.findOneAndUpdate(
            { _id: req.params.idPedido },
            req.body,
            { new: true }
        )
            .populate("cliente")
            .populate({
                path: "pedido.producto",
                model: "Productos",
            });
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
};

// Eliminar un pedido por su ID
exports.eliminarPedido = async (req, res, next) => {
    try {
        await Pedidos.findOneAndDelete({ _id: req.params.idPedido });
        res.json({ message: "El pedido se ha eliminado" });
    } catch (error) {
        res.json(error);
        next();
    }
};
