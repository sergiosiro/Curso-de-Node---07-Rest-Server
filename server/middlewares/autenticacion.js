const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });

        }
        req.usuario = decoded.data;
        next();

    })

}

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });

        }
        req.usuario = decoded.data;
        next();

    })

}

let verificaAdmin = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario logueado no es administrador'
            }
        });

    }

    next();

}

module.exports = {
    verificaToken,
    verificaAdmin,
    verificaTokenImg
}