const express = require("express");
let {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

//mostrar todas las categorias
app.get("/categoria", verificaToken, (req, res) => {
    //todas las categorias
    Categoria.find({})
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                categorias,
            });
        });
});

//Mostrar una categoria por ID
app.get("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    //Categoria.find({}).exec((err, categoriaDB) => {
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe",
                },
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

//Crear nueva categoria
app.put("/categoria", verificaToken, (req, res) => {
    //regresa  la nueva categoria
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe",
                },
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

//Actualizar la categoria
app.put("/categoria/:id", verificaToken, (req, res) => {
    //nombre de categoria
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion,
    };
    Categoria.findByIdAndUpdate(
        id,
        descCategoria, { new: true, runValidators: true },
        (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El id no existe",
                    },
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB,
            });
        }
    );
});

//Borrado de la categoria
app.delete(
    "/categoria/:id", [verificaToken, verificaAdmin_Role],
    (req, res) => {
        //Solo borrar un administrador puede tener la categoria.
        //eliminar fisicamente
        let id = req.params.id;
        Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            if (!categoriaBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El id no existe",
                    },
                });
            }
            if (!categoriaBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoria no encontrada",
                    },
                });
            }
            res.json({
                ok: true,
                message: "Categoria Borrada",
            });
        });
    }
);

module.exports = app;