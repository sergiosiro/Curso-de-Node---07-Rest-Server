const express = require('express');
const Categoria = require('../models/categoria.js');
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');
const app = express();

app.get('/categoria', verificaToken, function(req, res) {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, cantidad) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    categorias,
                    cantidad
                });
            })
        })
});

app.get('/categoria/:id', verificaToken, function(req, res) {

    let _id = req.params.id;

    Categoria.findById(_id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    })

});

app.post('/categoria', verificaToken, function(req, res) {
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

app.put('/categoria/:id', verificaToken, function(req, res) {

    let _id = req.params.id;


    Categoria.findByIdAndUpdate(_id, { nombre: req.body.nombre }, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no existente'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin], function(req, res) {

    let _id = req.params.id;

    Categoria.findByIdAndRemove(_id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

module.exports = app;