import admin from '../../firebaseConfig.js';
const db = admin.database();
const refPagos = db.ref('pagos');

export const crearPago = async (req, res) => {
  const newRef = refPagos.push();
  await newRef.set(req.body);
  res.status(201).json({ id: newRef.key, ...req.body });
};

export const obtenerPagos = async (req, res) => {
  const snapshot = await refPagos.once('value');
  const data = snapshot.val();
  
  if (!data) return res.status(200).json([]);

  const pagos = Object.entries(data).map(([id, pago]) => ({
    id,
    ...pago
  }));
  res.status(200).json(pagos);
};

export const obtenerPagoPorId = async (req, res) => {
  const pagoId = req.params.id;
  const snapshot = await refPagos.child(pagoId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Pago no encontrado' });
  }
  res.status(200).json({ id: pagoId, ...snapshot.val() });
};

export const actualizarPago = async (req, res) => {
  const pagoId = req.params.id;
  const snapshot = await refPagos.child(pagoId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Pago no encontrado' });
  }

  await refPagos.child(pagoId).update(req.body);
  res.status(200).json({ message: 'Pago actualizado correctamente' });
};

export const eliminarPago = async (req, res) => {
  const pagoId = req.params.id;
  const snapshot = await refPagos.child(pagoId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Pago no encontrado' });
  }

  await refPagos.child(pagoId).remove();
  res.status(200).json({ message: 'Pago eliminado correctamente' });
};