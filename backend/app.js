require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('🟢 MongoDB conectado'))
.catch((err) => console.error('🔴 Error en MongoDB:', err));


const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Servidor GestionMax funcionando');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
