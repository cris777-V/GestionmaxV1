require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Usuario = require('./models/Usuario');
const Solicitud = require('./models/Solicitud');


const app = express();

const session = require('express-session');

app.use(session({
  secret: 'gestionmax_supersecreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
}));




app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB conectado'))
  .catch((err) => console.error('🔴 Error en MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor GestionMax funcionando');
});

// Ruta de registro
app.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ nombre, correo, contraseña: hash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan campos' });
    }

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo no registrado' });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

app.post('/solicitud', async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ mensaje: 'No autorizado' });
  }

  const { comentario } = req.body;

  if (!comentario) {
    return res.status(400).json({ mensaje: 'Comentario requerido' });
  }

  try {
    const nuevaSolicitud = new Solicitud({
      usuario: req.session.usuario.id,
      comentario
    });

    await nuevaSolicitud.save();

    res.status(201).json({ mensaje: 'Solicitud enviada con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al guardar la solicitud' });
  }
});


    // Aquí puedes guardar en sesión si usas sesiones:

req.session.usuario = {
  id: usuario._id,
  nombre: usuario.nombre,
  correo: usuario.correo
};


    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', nombre: usuario.nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


app.get('/panel', (req, res) => {
  if (req.session.usuario) {
    res.json({
      mensaje: `Bienvenido, ${req.session.usuario.nombre}`,
      usuario: req.session.usuario
    });
  } else {
    res.status(401).json({ mensaje: 'No has iniciado sesión' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesión cerrada con éxito' });
  });
});

app.get('/mis-solicitudes', async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ mensaje: 'No autorizado' });
  }

  try {
    const solicitudes = await Solicitud.find({ usuario: req.session.usuario.id }).sort({ fecha: -1 });
    res.json(solicitudes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener las solicitudes' });
  }
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
