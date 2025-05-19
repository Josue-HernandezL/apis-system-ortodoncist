import admin from '../../firebaseConfig.js';

const db = admin.database();
const refPagos = db.ref('pagos');

export const crearPago = async (req, res) => {
  try {
    const newRef = refPagos.push();
    await newRef.set(req.body);
    res.status(201).json({ id: newRef.key, ...req.body });
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ error: 'No se pudo crear el pago' });
  }
};

export const obtenerPagos = async (req, res) => {
  try {
    const snapshot = await refPagos.once('value');
    res.status(200).json(snapshot.val() || {});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
};

export const obtenerPagoPorId = async (req, res) => {
  const pagoId = req.params.id;
  try {
    const snapshot = await refPagos.child(pagoId).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.status(200).json({ id: pagoId, ...snapshot.val() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pago' });
  }
};

export const actualizarPago = async (req, res) => {
  const pagoId = req.params.id;
  try {
    await refPagos.child(pagoId).update(req.body);
    res.status(200).json({ message: 'Pago actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el pago' });
  }
};

export const eliminarPago = async (req, res) => {
  const pagoId = req.params.id;
  try {
    await refPagos.child(pagoId).remove();
    res.status(200).json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el pago' });
  }
};
