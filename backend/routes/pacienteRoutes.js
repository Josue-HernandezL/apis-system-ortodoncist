import express from 'express';
import {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente
} from '../controllers/pacienteController.js';

import { authenticate } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import { pacienteSchema, updatePacienteSchema } from '../schemas/pacienteSchema.js';

const router = express.Router();

router.get('/', authenticate, getPacientes);
router.get('/:id', authenticate, getPacienteById);

router.post('/', authenticate, validateSchema(pacienteSchema), createPaciente);
router.put('/:id', authenticate, validateSchema(updatePacienteSchema), updatePaciente);

router.delete('/:id', authenticate, deletePaciente);

export default router;