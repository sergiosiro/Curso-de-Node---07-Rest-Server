const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let img = req.params.img;
    let tipo = req.params.tipo;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);

    } else {

        let archivoNoImage = path.resolve(__dirname, '../assets/no-image.png');
        res.sendFile(archivoNoImage);

    }

});

module.exports = app;