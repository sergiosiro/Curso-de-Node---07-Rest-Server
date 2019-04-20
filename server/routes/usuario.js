const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.js');
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, function(req, res) {

    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 0;
    Usuario.find({ estado: true }, 'nombre email role estado google')
        .skip(skip)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, cantidad) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                });
            })
        })
});

app.post('/usuario', [verificaToken, verificaAdmin], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        estado: body.estado,
        google: body.google
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.put('/usuario/:id', [verificaToken, verificaAdmin], function(req, res) {

    let _id = req.params.id;

    Usuario.findById(_id, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existente'
                }
            });
        }

        let body = req.body;
        usuarioDB.nombre = body.nombre;
        usuarioDB.email = body.email;
        usuarioDB.img = body.img;
        usuarioDB.role = body.role;
        usuarioDB.estado = body.estado;

        usuarioDB.save((err) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });

        });

    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdmin], function(req, res) {

    let _id = req.params.id;

    Usuario.findByIdAndRemove(_id, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

module.exports = app;