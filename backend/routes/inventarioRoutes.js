import express from 'express';
import {
  crearItem,
  obtenerInventario,
  obtenerItemPorId,
  actualizarItem,
  eliminarItem
} from '../controllers/inventarioController.js';

import { authenticate } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import { inventarioSchema, updateInventarioSchema } from '../schemas/inventarioSchema.js';

const router = express.Router();

router.get('/', authenticate, obtenerInventario);
router.get('/:id', authenticate, obtenerItemPorId);

// Rutas protegidas y validadas
router.post('/', authenticate, validateSchema(inventarioSchema), crearItem);
router.put('/:id', authenticate, validateSchema(updateInventarioSchema), actualizarItem);
router.delete('/:id', authenticate, eliminarItem);

export default router;