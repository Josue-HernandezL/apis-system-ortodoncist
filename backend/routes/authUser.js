import express from 'express';
import db from '../../firebaseConfig.js';

const router = express.Router();
const refUsuarios = db.ref('usuarios');

// Simula login básico sin tokens
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  const snapshot = await refUsuarios.once('value');
  const usuarios = snapshot.val();

  const encontrado = Object.entries(usuarios || {}).find(
    ([, usuario]) => usuario.correo === correo && usuario.password === password
  );

  if (encontrado) {
    const [id, usuario] = encontrado;
    res.json({ mensaje: 'Login exitoso', id, ...usuario });
  } else {
    res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
  }
});

export default router;
