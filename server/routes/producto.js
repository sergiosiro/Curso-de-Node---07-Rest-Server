const express = require('express');
const Producto = require('../models/producto.js');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

app.get('/producto', verificaToken, function(req, res) {

    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 0;
    Producto.find({ disponible: true })
        .skip(skip)
        .limit(limit)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, cantidad) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    cantidad
                });
            })
        })
});

app.get('/producto/:id', verificaToken, function(req, res) {

    let _id = req.params.id;

    Producto.findById(_id, (err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }

            if (!productoDB.disponible) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no disponible'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')

});

app.get('/producto/buscar/:termino', verificaToken, function(req, res) {

    let termino = req.params.termino;
    let expReg = new RegExp(termino, 'i');
    Producto.find({ nombre: expReg })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        })

});

app.post('/producto', verificaToken, function(req, res) {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

app.put('/producto/:id', verificaToken, function(req, res) {

    let _id = req.params.id;
    let body = req.body;
    let actProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    };
    Producto.findByIdAndUpdate(_id, actProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existente'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })

});

app.delete('/producto/:id', verificaToken, function(req, res) {

    let _id = req.params.id;

    Producto.findByIdAndUpdate(_id, { disponible: false }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existente'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })

});

module.exports = app;