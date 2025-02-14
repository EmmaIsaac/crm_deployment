const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const productosController = require("../controllers/productosController");
const pedidosController = require("../controllers/pedidosController");
const usuariosController = require("../controllers/usuariosController");

// middleware para proteger las rutas
const auth = require("../middlewares/auth");

module.exports = function () {
    // Agrega nuevos clientes via POST
    router.post("/clientes", auth, clienteController.nuevoCliente);

    // Obtener todos los clientes
    router.get("/clientes", auth, clienteController.mostrarClientes);

    // Muestra un cliente en especifico (ID)
    router.get("/clientes/:idCliente", auth, clienteController.mostrarCliente);

    // actualizar cliente
    router.put(
        "/clientes/:idCliente",
        auth,
        clienteController.actualizarCliente
    );

    // Eliminar cliente
    router.delete(
        "/clientes/:idCliente",
        auth,
        clienteController.eliminarCliente
    );

    /** PRODUCTOS  */

    // Agrega nuevos productos via POST
    router.post(
        "/productos",
        auth,
        productosController.subirArchivo,
        productosController.nuevoProducto
    );

    // Mostrar todos los productos
    router.get("/productos", auth, productosController.mostrarProductos);

    // Muestra un producto en especifico (ID)
    router.get(
        "/productos/:idProducto",
        auth,
        productosController.mostrarProducto
    );

    // Actualizar producto
    router.put(
        "/productos/:idProducto",
        auth,
        productosController.subirArchivo,
        productosController.actualizarProducto
    );

    // Eliminar producto
    router.delete(
        "/productos/:idProducto",
        auth,
        productosController.eliminarProducto
    );

    // Busqueda de productos
    router.post(
        "/productos/busqueda/:query",
        auth,
        productosController.buscarProducto
    );

    /** PEDIDOS */

    // Agrega nuevos pedidos via POST
    router.post(
        "/pedidos/nuevo/:idUsuario",
        auth,
        pedidosController.nuevoPedido
    );

    // Mostrar todos los pedidos
    router.get("/pedidos", auth, pedidosController.mostrarPedidos);

    // Muestra un pedido en especifico (ID)
    router.get("/pedidos/:idPedido", auth, pedidosController.mostrarPedido);

    // Actualizar pedido
    router.put("/pedidos/:idPedido", auth, pedidosController.actualizarPedido);

    // Eliminar pedido
    router.delete("/pedidos/:idPedido", auth, pedidosController.eliminarPedido);

    /** USUARIOs */

    // Crear cuenta de usuario
    router.post("/crear-cuenta", auth, usuariosController.registrarUsuario);

    //Iniciar sesion
    router.post("/iniciar-sesion", usuariosController.autenticarUsuario);

    return router;
};
