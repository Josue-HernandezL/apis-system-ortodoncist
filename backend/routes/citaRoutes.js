import express from 'express';
import {
  crearCita,
  obtenerCitas,
  obtenerCitaPorId,
  actualizarCita,
  eliminarCita
} from '../controllers/citaController.js';

import { authenticate } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import { citaSchema, updateCitaSchema } from '../schemas/citaSchema.js';

const router = express.Router();

router.get('/', authenticate, obtenerCitas);
router.get('/:id', authenticate, obtenerCitaPorId);

// Rutas validadas
router.post('/', authenticate, validateSchema(citaSchema), crearCita);
router.put('/:id', authenticate, validateSchema(updateCitaSchema), actualizarCita);

router.delete('/:id', authenticate, eliminarCita);

export default router;
