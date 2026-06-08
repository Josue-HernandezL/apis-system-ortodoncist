import admin from '../../firebaseConfig.js';
const db = admin.database();
const refInventario = db.ref('inventario');

export const crearItem = async (req, res) => {
  const newRef = refInventario.push();
  await newRef.set(req.body);
  res.status(201).json({ id: newRef.key, ...req.body });
};

export const obtenerInventario = async (req, res) => {
  const snapshot = await refInventario.once('value');
  const data = snapshot.val();
  
  if (!data) return res.status(200).json([]);

  const inventario = Object.entries(data).map(([id, item]) => ({
    id,
    ...item
  }));
  res.status(200).json(inventario);
};

export const obtenerItemPorId = async (req, res) => {
  const inventarioId = req.params.id;
  const snapshot = await refInventario.child(inventarioId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  res.status(200).json({ id: inventarioId, ...snapshot.val() });
};

export const actualizarItem = async (req, res) => {
  const inventarioId = req.params.id;
  const snapshot = await refInventario.child(inventarioId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }

  await refInventario.child(inventarioId).update(req.body);
  res.status(200).json({ message: 'Item actualizado correctamente' });
};

export const eliminarItem = async (req, res) => {
  const inventarioId = req.params.id;
  const snapshot = await refInventario.child(inventarioId).once('value');
  
  if (!snapshot.exists()) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }

  await refInventario.child(inventarioId).remove();
  res.status(200).json({ message: 'Item eliminado correctamente' });
};