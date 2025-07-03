const mongoose = require('mongoose');

const OrdenPosSchema = new mongoose.Schema({
  pedido: [
    {
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ],
  tipo: String,
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OrdenPos', OrdenPosSchema);
