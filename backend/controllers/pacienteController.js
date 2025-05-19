import admin from '../../firebaseConfig.js';
const db = admin.database();


const pacientesRef = db.ref('pacientes');

export const getPacientes = async (req, res) => {
  try {
    const snapshot = await pacientesRef.once('value');
    const data = snapshot.val();
    if (!data) return res.status(200).json({});

    const pacientes = Object.entries(data).map(([id, paciente]) => ({
      id,
      ...paciente
    }));
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPacienteById = async (req, res) => {
  try {
    const snapshot = await pacientesRef.child(req.params.id).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Paciente no encontrado' });

    res.status(200).json({ id: req.params.id, ...snapshot.val() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createPaciente = async (req, res) => {
  try {
    const nuevoPaciente = req.body;
    const nuevoRef = pacientesRef.push();
    await nuevoRef.set(nuevoPaciente);
    res.status(201).json({ message: 'Paciente creado', id: nuevoRef.key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await pacientesRef.child(id).update(req.body);
    res.status(200).json({ message: 'Paciente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    await pacientesRef.child(id).remove();
    res.status(200).json({ message: 'Paciente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
