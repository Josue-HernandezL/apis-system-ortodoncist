import express from 'express';
import db from '../../firebaseConfig.js';
 
const router = express.Router();
const refPagos = db.ref('pagos');

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

// POST: Crear pago
router.post('/', async (req, res) => {
  console.log('POST recibido:', req.body);  // para verificar en consola

  const newRef = refPagos.push();
  await newRef.set(req.body);

  res.json({ id: newRef.key, ...req.body });
});

// GET: Leer todos los pagos
router.get('/', async (req, res) => {
  const snapshot = await refPagos.once('value');
  res.json(snapshot.val() || {});
});

// GET: Obtener un pago específica por ID
router.get('/:id', async (req, res) => {
  const pagoId = req.params.id;
  const pagoRef = refPagos.child(pagoId);

  try {
    const snapshot = await pagoRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'pago no encontrado' });
    }

    res.json({ id: pagoId, ...snapshot.val() });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT: Actualizar pago
router.put('/:id', async (req, res) => {
  const pagoId = req.params.id;
  const updateData = req.body;

  try {
    await refPagos.child(pagoId).update(updateData);
    res.json({ message: 'pago actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando pago:', error);
    res.status(500).json({ error: 'No se pudo actualizar el pago' });
  }
});

// DELETE: Eliminar pago
router.delete('/:id', async (req, res) => {
  await pagos.child(req.params.id).remove();
  res.json({ message: 'pago eliminado' });
});

export default router;