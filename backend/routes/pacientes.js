import express from 'express';
import db from '../../firebaseConfig.js';
 
const router = express.Router();
const refPacientes = db.ref('pacientes');

const ref = db.ref("Pruba de conexion");
await ref.set({ mensaje: 'Conexión exitosa desde Node.js' });
console.log('✅ Dato escrito con éxito');

ref.once('value')
  .then(snapshot => {
    console.log('✅ Dato leído:', snapshot.val());
  })
  .catch(error => {
    console.error('❌ Error al leer:', error);
  });

// POST: Crear paciente
router.post('/', async (req, res) => {
  console.log('📩 POST recibido:', req.body);  // para verificar en consola

  const newRef = refPacientes.push();
  await newRef.set(req.body);

  res.json({ id: newRef.key, ...req.body });
});

// GET: Leer todos los pacientes
router.get('/', async (req, res) => {
  const snapshot = await refPacientes.once('value');
  res.json(snapshot.val() || {});
});

// GET: Obtener un paciente específico por ID
router.get('/:id', async (req, res) => {
  const pacienteId = req.params.id;
  const pacienteRef = refPacientes.child(pacienteId);

  try {
    const snapshot = await pacienteRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json({ id: pacienteId, ...snapshot.val() });
  } catch (error) {
    console.error('❌ Error al obtener paciente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT: Actualizar paciente
router.put('/:id', async (req, res) => {
  const pacienteId = req.params.id;
  const updateData = req.body;

  try {
    await refPacientes.child(pacienteId).update(updateData);
    res.json({ message: 'Paciente actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error actualizando paciente:', error);
    res.status(500).json({ error: 'No se pudo actualizar el paciente' });
  }
});

// DELETE: Eliminar paciente
router.delete('/:id', async (req, res) => {
  await refPacientes.child(req.params.id).remove();
  res.json({ message: 'Paciente eliminado' });
});

export default router;