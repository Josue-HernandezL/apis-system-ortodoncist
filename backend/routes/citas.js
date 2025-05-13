import express from 'express';
import db from '../../firebaseConfig.js';
 
const router = express.Router();
const refCitas = db.ref('citas');

const ref = db.ref("Pruba de conexion");
await ref.set({ mensaje: 'Conexión exitosa desde Node.js' });
console.log('✅ Dato escrito con éxito');

ref.once('value')
  .then(snapshot => {
    console.log('✅ Dato leído:', snapshot.val());
  })
  .catch(error => {
    console.error('Error al leer:', error);
  });

// POST: Crear cita
router.post('/', async (req, res) => {
  console.log('POST recibido:', req.body);  // para verificar en consola

  const newRef = refCitas.push();
  await newRef.set(req.body);

  res.json({ id: newRef.key, ...req.body });
});

// GET: Leer todos los citas
router.get('/', async (req, res) => {
  const snapshot = await refCitas.once('value');
  res.json(snapshot.val() || {});
});

// GET: Obtener un cita específica por ID
router.get('/:id', async (req, res) => {
  const citaId = req.params.id;
  const citaRef = refCitas.child(citaId);

  try {
    const snapshot = await citaRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'cita no encontrado' });
    }

    res.json({ id: citaId, ...snapshot.val() });
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT: Actualizar cita
router.put('/:id', async (req, res) => {
  const citaId = req.params.id;
  const updateData = req.body;

  try {
    await refCitas.child(citaId).update(updateData);
    res.json({ message: 'cita actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando cita:', error);
    res.status(500).json({ error: 'No se pudo actualizar el cita' });
  }
});

// DELETE: Eliminar cita
router.delete('/:id', async (req, res) => {
  await Citas.child(req.params.id).remove();
  res.json({ message: 'cita eliminado' });
});

export default router;