import db from '../../firebaseConfig.js';

const refCitas = db.ref('citas');

export const crearCita = async (req, res) => {
  try {
    const newRef = refCitas.push();
    await newRef.set(req.body);
    res.status(201).json({ id: newRef.key, ...req.body });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ error: 'No se pudo crear la cita' });
  }
};

export const obtenerCitas = async (req, res) => {
  try {
    const snapshot = await refCitas.once('value');
    res.status(200).json(snapshot.val() || {});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

export const obtenerCitaPorId = async (req, res) => {
  const citaId = req.params.id;
  try {
    const snapshot = await refCitas.child(citaId).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.status(200).json({ id: citaId, ...snapshot.val() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cita' });
  }
};

export const actualizarCita = async (req, res) => {
  const citaId = req.params.id;
  try {
    await refCitas.child(citaId).update(req.body);
    res.status(200).json({ message: 'Cita actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar la cita' });
  }
};

export const eliminarCita = async (req, res) => {
  const citaId = req.params.id;
  try {
    await refCitas.child(citaId).remove();
    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar la cita' });
  }
};
