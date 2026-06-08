import express from 'express';
import {
  crearCita,
  obtenerCitas,
  obtenerCitaPorId,
  actualizarCita,
  eliminarCita
} from '../controllers/citaController.js';

import { validateSchema } from '../middleware/validate.js';
import { citaSchema } from '../schemas/citaSchema.js';

import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas protegidas con JWT
router.post('/', authenticate, validateSchema(citaSchema), crearCita);
router.get('/', authenticate, obtenerCitas);
router.get('/:id', authenticate, obtenerCitaPorId);
router.put('/:id', authenticate, validateSchema(citaSchema), actualizarCita);
router.delete('/:id', authenticate, eliminarCita);

export default router;
