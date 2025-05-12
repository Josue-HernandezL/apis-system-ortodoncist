import express from 'express';
import db from '../config/firebaseConfig.js';

const router = express.Router();
const refPacientes = db.ref('pacientes');

router.post('/', async (req, res) => {
  const newRef = refPacientes.push();
  await newRef.set(req.body);
  res.json({ id: newRef.key, ...req.body });
  console.log('Paciente agregado:', req.body);
});

router.get('/', async (req, res) => {
  const snapshot = await refPacientes.once('value');
  res.json(snapshot.val() || {});
    console.log('Lista de pacientes:', snapshot.val());
});

router.put('/:id', async (req, res) => {
  await refPacientes.child(req.params.id).update(req.body);
  res.json({ message: 'Paciente actualizado' });
    console.log('Paciente actualizado:', req.params.id, req.body);
});

router.delete('/:id', async (req, res) => {
  await refPacientes.child(req.params.id).remove();
  res.json({ message: 'Paciente eliminado' });
    console.log('Paciente eliminado:', req.params.id);
});

export default router;

