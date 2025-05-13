import express from 'express';
import db from '../../firebaseConfig.js';
 
const router = express.Router();
const refUsuarios = db.ref('usuarios');

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

// POST: Crear usuario
router.post('/', async (req, res) => {
  console.log('POST recibido:', req.body);  // para verificar en consola

  const newRef = refUsuarios.push();
  await newRef.set(req.body);

  res.json({ id: newRef.key, ...req.body });
});

// GET: Leer todos los usuarios
router.get('/', async (req, res) => {
  const snapshot = await refUsuarios.once('value');
  res.json(snapshot.val() || {});
});

// GET: Obtener un usuario específico por ID
router.get('/:id', async (req, res) => {
  const usuarioId = req.params.id;
  const usuarioRef = refUsuarios.child(usuarioId);

  try {
    const snapshot = await usuarioRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'usuario no encontrado' });
    }

    res.json({ id: usuarioId, ...snapshot.val() });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT: Actualizar usuario
router.put('/:id', async (req, res) => {
  const usuarioId = req.params.id;
  const updateData = req.body;

  try {
    await refUsuarios.child(usuarioId).update(updateData);
    res.json({ message: 'usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'No se pudo actualizar el usuario' });
  }
});

// DELETE: Eliminar usuario
router.delete('/:id', async (req, res) => {
  await refUsuarios.child(req.params.id).remove();
  res.json({ message: 'usuario eliminado' });
});

export default router;