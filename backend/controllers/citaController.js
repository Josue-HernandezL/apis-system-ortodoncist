import admin from '../../firebaseConfig.js';
const db = admin.database();
const refCitas = db.ref('citas');

export const crearCita = async (req, res) => {
  const newRef = refCitas.push();
  await newRef.set(req.body);
  res.status(201).json({ id: newRef.key, ...req.body });
};

export const obtenerCitas = async (req, res) => {
  const snapshot = await refCitas.once('value');
  const data = snapshot.val();
  if (!data) return res.status(200).json([]);

  const citas = Object.entries(data).map(([id, cita]) => ({
    id,
    ...cita
  }));
  res.status(200).json(citas);
};

export const obtenerCitaPorId = async (req, res) => {
  const citaId = req.params.id;
  const snapshot = await refCitas.child(citaId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }
  res.status(200).json({ id: citaId, ...snapshot.val() });
};

export const actualizarCita = async (req, res) => {
  const citaId = req.params.id;
  const snapshot = await refCitas.child(citaId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  await refCitas.child(citaId).update(req.body);
  res.status(200).json({ message: 'Cita actualizada correctamente' });
};

export const eliminarCita = async (req, res) => {
  const citaId = req.params.id;
  const snapshot = await refCitas.child(citaId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  await refCitas.child(citaId).remove();
  res.status(200).json({ message: 'Cita eliminada correctamente' });
};