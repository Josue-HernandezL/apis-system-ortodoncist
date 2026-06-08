import admin from '../../firebaseConfig.js';
const db = admin.database();
const pacientesRef = db.ref('pacientes');

export const getPacientes = async (req, res) => {
  const snapshot = await pacientesRef.once('value');
  const data = snapshot.val();
  if (!data) return res.status(200).json([]); // Retornar arreglo vacío es mejor práctica

  const pacientes = Object.entries(data).map(([id, paciente]) => ({
    id,
    ...paciente
  }));
  res.status(200).json(pacientes);
};

export const getPacienteById = async (req, res) => {
  const snapshot = await pacientesRef.child(req.params.id).once('value');
  if (!snapshot.exists()) return res.status(404).json({ error: 'Paciente no encontrado' });

  res.status(200).json({ id: req.params.id, ...snapshot.val() });
};

export const createPaciente = async (req, res) => {
  const nuevoRef = pacientesRef.push();
  await nuevoRef.set(req.body);
  res.status(201).json({ message: 'Paciente creado', id: nuevoRef.key, ...req.body });
};

export const updatePaciente = async (req, res) => {
  const { id } = req.params;
  const snapshot = await pacientesRef.child(id).once('value');
  if (!snapshot.exists()) return res.status(404).json({ error: 'Paciente no encontrado' });

  await pacientesRef.child(id).update(req.body);
  res.status(200).json({ message: 'Paciente actualizado' });
};

export const deletePaciente = async (req, res) => {
  const { id } = req.params;
  const snapshot = await pacientesRef.child(id).once('value');
  if (!snapshot.exists()) return res.status(404).json({ error: 'Paciente no encontrado' });

  await pacientesRef.child(id).remove();
  res.status(200).json({ message: 'Paciente eliminado' });
};