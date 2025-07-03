// models/OrdenPos.js
const mongoose = require('mongoose');

const OrdenPosSchema = new mongoose.Schema({
  pedido: [
    {
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ],
  tipo: {
    type: String,
    enum: ['domicilio', 'mesa'],
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OrdenPos', OrdenPosSchema);
