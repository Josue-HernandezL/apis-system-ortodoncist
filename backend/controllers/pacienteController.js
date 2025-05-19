import db from '../../firebaseConfig.js';

const pacientesRef = db.ref('pacientes');

export const getPacientes = async (req, res) => {
  try {
    const snapshot = await pacientesRef.get();
    const pacientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPacienteById = async (req, res) => {
  try {
    const doc = await pacientesRef.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPaciente = async (req, res) => {
  try {
    const nuevoPaciente = req.body;
    const docRef = await pacientesRef.add(nuevoPaciente);
    res.status(201).json({ message: 'Paciente creado', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await pacientesRef.doc(id).update(req.body);
    res.status(200).json({ message: 'Paciente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await pacientesRef.doc(id).delete();
    res.status(200).json({ message: 'Paciente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
