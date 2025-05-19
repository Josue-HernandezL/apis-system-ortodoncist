import express from 'express';
import {
  crearPago,
  obtenerPagos,
  obtenerPagoPorId,
  actualizarPago,
  eliminarPago
} from '../controllers/pagoController.js';

import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, crearPago);
router.get('/', authenticate, obtenerPagos);
router.get('/:id', authenticate, obtenerPagoPorId);
router.put('/:id', authenticate, actualizarPago);
router.delete('/:id', authenticate, eliminarPago);

export default router;
