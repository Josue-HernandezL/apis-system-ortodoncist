import express from 'express';
import {
  crearItem,
  obtenerInventario,
  obtenerItemPorId,
  actualizarItem,
  eliminarItem
} from '../controllers/inventarioController.js';

import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, crearItem);
router.get('/', authenticate, obtenerInventario);
router.get('/:id', authenticate, obtenerItemPorId);
router.put('/:id', authenticate, actualizarItem);
router.delete('/:id', authenticate, eliminarItem);

export default router;
