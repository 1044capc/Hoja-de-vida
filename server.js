require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Conectado correctamente'))
  .catch(err => console.error('Error al conectar MongoDB:', err));

// Esquema y Modelo de Mongoose
const experienciaSchema = new mongoose.Schema({
  empresa: { type: String, required: true },
  puesto: { type: String, required: true },
  fechaInicio: { type: String, required: true },
  fechaFin: { type: String, default: 'Presente' },
  descripcion: { type: String, required: true },
  tecnologias: [{ type: String }]
}, { timestamps: true });

const Experiencia = mongoose.model('Experiencia', experienciaSchema);

// --- RUTAS DE LA API (CRUD) ---

// GET: Obtener todas las experiencias
app.get('/api/experiencias', async (req, res) => {
  try {
    const experiencias = await Experiencia.find().sort({ createdAt: -1 });
    res.json(experiencias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// POST: Crear nueva experiencia
app.post('/api/experiencias', async (req, res) => {
  try {
    const nuevaExp = new Experiencia(req.body);
    const guardada = await nuevaExp.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// PUT: Actualizar experiencia por ID
app.put('/api/experiencias/:id', async (req, res) => {
  try {
    const actualizada = await Experiencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizada) return res.status(404).json({ mensaje: 'No encontrada' });
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// DELETE: Eliminar experiencia por ID
app.delete('/api/experiencias/:id', async (req, res) => {
  try {
    const eliminada = await Experiencia.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ mensaje: 'No encontrada' });
    res.json({ mensaje: 'Experiencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor API corriendo en http://localhost:${PORT}`));