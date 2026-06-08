import express from 'express';
import {
  crearPago,
  obtenerPagos,
  obtenerPagoPorId,
  actualizarPago,
  eliminarPago
} from '../controllers/pagoController.js';

import { authenticate } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import { pagoSchema, updatePagoSchema } from '../schemas/pagoSchema.js';

const router = express.Router();

router.get('/', authenticate, obtenerPagos);
router.get('/:id', authenticate, obtenerPagoPorId);

// Rutas validadas
router.post('/', authenticate, validateSchema(pagoSchema), crearPago);
router.put('/:id', authenticate, validateSchema(updatePagoSchema), actualizarPago);

router.delete('/:id', authenticate, eliminarPago);

export default router;