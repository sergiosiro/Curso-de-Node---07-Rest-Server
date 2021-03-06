const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es obligatorio'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    img: { type: String, required: false }
});


module.exports = mongoose.model('Producto', productoSchema);