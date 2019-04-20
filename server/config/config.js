// ***********************
// **** PUERTO
// *********************** 

process.env.PORT = process.env.PORT || 3000;

// ***********************
// **** ENTORNO
// *********************** 

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ***********************
// **** BASE DE DATOS
// *********************** 

let urlBD;

if (process.env.NODE_ENV == 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://strider:JidKhiuouMaq22gf@cluster0-wwgbs.mongodb.net/cafe?retryWrites=true';
}
process.env.URLDB = process.env.URLDB || urlBD;