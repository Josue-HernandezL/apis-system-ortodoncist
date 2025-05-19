import express from 'express';
import {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente
} from '../controllers/pacienteController.js';

import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getPacientes);
router.get('/:id', authenticate, getPacienteById);
router.post('/', authenticate, createPaciente);
router.put('/:id', authenticate, updatePaciente);
router.delete('/:id', authenticate, deletePaciente);

export default router;
