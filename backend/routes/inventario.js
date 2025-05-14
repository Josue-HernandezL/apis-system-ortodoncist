import express from 'express';
import db from '../../firebaseConfig.js';
 
const router = express.Router();
const refInventario = db.ref('inventario');

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

// POST: Crear ineventario
router.post('/', async (req, res) => {
  console.log('POST recibido:', req.body);  // para verificar en consola

  const newRef = refInventario.push();
  await newRef.set(req.body);

  res.json({ id: newRef.key, ...req.body });
});

// GET: Leer todos los inventario
router.get('/', async (req, res) => {
  const snapshot = await refInventario.once('value');
  res.json(snapshot.val() || {});
});

// GET: Obtener un inventario específica por ID
router.get('/:id', async (req, res) => {
  const inventarioId = req.params.id;
  const inventarioRef = refInventario.child(inventarioId);

  try {
    const snapshot = await inventarioRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'inventario no encontrado' });
    }

    res.json({ id: inventarioId, ...snapshot.val() });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT: Actualizar inventario
router.put('/:id', async (req, res) => {
  const inventarioId = req.params.id;
  const updateData = req.body;

  try {
    await refInventario.child(inventarioId).update(updateData);
    res.json({ message: 'inventario actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando inventario:', error);
    res.status(500).json({ error: 'No se pudo actualizar el inventario' });
  }
});

// DELETE: Eliminar inventario
router.delete('/:id', async (req, res) => {
  await refInventario.child(req.params.id).remove();
  res.json({ message: 'inventario eliminado' });
});

export default router;