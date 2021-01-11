const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");

//Obtener todos los productos
app.get("/producto", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    let condicion = { disponible: true };

    Producto.find(
            condicion,
            "nombre precioUni descripcion disponible categoria usuario"
        )
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            Producto.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo,
                });
            });
        });
});

//obtener un producto por id
app.get("/producto/:id", verificaToken, (req, res) => {
    //populate: usuario y categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El producto no existe",
                    },
                });
            }

            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});

//Buscar productos
app.get("/producto/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                productos,
            });
        });
});

//crear un producto
app.post("/producto", verificaToken, (req, res) => {
    //Grabar el producto
    //Grabar una categoria del listao

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.dispoible,
        usuario: req.usuario._id,
        categoria: body.categoria,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe",
                },
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB,
        });
    });
});

//Actualizar un producto
app.put("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    };
    Producto.findByIdAndUpdate(
        id,
        descProducto, { new: true, runValidators: true },
        (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El producto no existe",
                    },
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
            });
        }
    );
});

//Borrar un producto
app.delete("/producto/:id", verificaToken, (req, res) => {
    //Actualizar el disponible a false
    let id = req.params.id;
    let cambiaDisponible = {
        disponible: false,
    };
    Producto.findByIdAndUpdate(
        id,
        cambiaDisponible, { new: true },
        (err, productoBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El producto no existe",
                    },
                });
            }
            res.json({
                ok: true,
                message: "Producto Borrada",
            });
        }
    );
});

module.exports = app;