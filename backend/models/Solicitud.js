const mongoose = require('mongoose');

const SolicitudSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nombre: {
    type: String,
    required: false
  },
  telefono: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  comentario: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Solicitud', SolicitudSchema);
