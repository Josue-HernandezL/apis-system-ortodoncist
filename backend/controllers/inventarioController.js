import admin from '../../firebaseConfig.js';

const db = admin.database();

const refInventario = db.ref('inventario');

export const crearItem = async (req, res) => {
  try {
    const newRef = refInventario.push();
    await newRef.set(req.body);
    res.status(201).json({ id: newRef.key, ...req.body });
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(500).json({ error: 'No se pudo crear el item de inventario' });
  }
};

export const obtenerInventario = async (req, res) => {
  try {
    const snapshot = await refInventario.once('value');
    res.status(200).json(snapshot.val() || {});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el inventario' });
  }
};

export const obtenerItemPorId = async (req, res) => {
  const inventarioId = req.params.id;
  try {
    const snapshot = await refInventario.child(inventarioId).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.status(200).json({ id: inventarioId, ...snapshot.val() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el item' });
  }
};

export const actualizarItem = async (req, res) => {
  const inventarioId = req.params.id;
  try {
    await refInventario.child(inventarioId).update(req.body);
    res.status(200).json({ message: 'Item actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el item' });
  }
};

export const eliminarItem = async (req, res) => {
  const inventarioId = req.params.id;
  try {
    await refInventario.child(inventarioId).remove();
    res.status(200).json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el item' });
  }
};
