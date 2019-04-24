const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario.js')
const Producto = require('../models/producto.js')

const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let _id = req.params.id;

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se subió ningún archivo'
            }
        });

    }

    let tiposValidos = ['usuario', 'producto'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los únicos tipos válidos son ${ tiposValidos.join(', ')}`,
                tipo
            }
        })
    }

    let archivo = req.files.archivo;
    let extensionArchivo = archivo.name.split('.')[archivo.name.split('.').length - 1];


    let extensionesValidas = ['gif', 'jpg', 'png', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las únicas extensiones válidas son ${ extensionesValidas.join(', ')}`,
                extension: extensionArchivo
            }
        })
    }

    let archivoGuardar = `${ _id }-${ new Date().getMilliseconds()}.${ extensionArchivo}`
    archivo.mv(`uploads/${ tipo }/${ archivoGuardar }`, (err) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (tipo == 'usuario') {
            actImagenUsuario(_id, res, archivoGuardar, tipo);
        } else if (tipo == 'producto') {
            actImagenProducto(_id, res, archivoGuardar, tipo);
        }
    });

});

function actImagenUsuario(_id, res, archivoGuardar, tipo) {

    Usuario.findById(_id, (err, usuarioDB) => {

        if (err) {

            borrarArchivo(tipo, archivoGuardar);

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borrarArchivo(tipo, archivoGuardar);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario inexistente'
                }
            })

        }

        borrarArchivo(tipo, usuarioDB.img);

        usuarioDB.img = archivoGuardar;

        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Imagen subida correctamente',
                imagen: usuarioGuardado.img
            });

        })
    });

}

function actImagenProducto(_id, res, archivoGuardar, tipo) {

    Producto.findById(_id, (err, productoDB) => {

        if (err) {

            borrarArchivo(tipo, archivoGuardar);

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borrarArchivo(tipo, archivoGuardar);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto inexistente'
                }
            })

        }

        borrarArchivo(tipo, productoDB.img);

        productoDB.img = archivoGuardar;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Imagen subida correctamente',
                imagen: productoGuardado.img
            });

        })
    });

}

function borrarArchivo(tipo, nombreImagen) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;