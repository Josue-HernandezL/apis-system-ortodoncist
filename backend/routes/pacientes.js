// routes/pacientes.js

import express from 'express';
import db from '../firebaseConfig.js';

const router = express.Router();
const refPacientes = db.ref('pacientes');

router.post('/', async (req, res) => {
  const { nombre, edad } = req.body;

  if (!nombre || !edad) {
    return res.status(400).json({ message: 'Nombre y edad son obligatorios' });
  }

  try {
    const nuevoPacienteRef = refPacientes.push();
    await nuevoPacienteRef.set({ nombre, edad });
    console.log('Paciente guardado:', { id: nuevoPacienteRef.key, nombre, edad });

    res.status(201).json({ id: nuevoPacienteRef.key, nombre, edad });
  } catch (error) {
    console.error('❌ Error al guardar paciente:', error);
    res.status(500).json({ message: 'Error interno al guardar paciente' });
  }
});

router.get('/', async (req, res) => {
  try {
    const snapshot = await refPacientes.once('value');
    res.json(snapshot.val() || {});
  } catch (error) {
    console.error('❌ Error al obtener pacientes:', error);
    res.status(500).json({ message: 'Error interno al obtener pacientes' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await refPacientes.child(req.params.id).update(req.body);
    res.json({ message: 'Paciente actualizado' });
  } catch (error) {
    console.error('❌ Error al actualizar paciente:', error);
    res.status(500).json({ message: 'Error interno al actualizar paciente' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await refPacientes.child(req.params.id).remove();
    res.json({ message: 'Paciente eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar paciente:', error);
    res.status(500).json({ message: 'Error interno al eliminar paciente' });
  }
});

export default router;
