import express from 'express';
import {
  crearAdmin,
  crearUsuario,
  enviarLinkRecuperacion,
  solicitarRegistro,
  aprobarSolicitud
} from '../controllers/authController.js';
import { validateSchema } from '../middleware/validate.js';
import { registerSchema, resetPasswordSchema } from '../schemas/authSchema.js';

const router = express.Router();

// Crear único admin
router.post('/admin', validateSchema(registerSchema), crearAdmin);

// Crear usuarios directamente (requiere token de admin)
router.post('/register', validateSchema(registerSchema), crearUsuario);

// Recuperación de contraseña
router.post('/reset-password', validateSchema(resetPasswordSchema), enviarLinkRecuperacion);

// Solicitud de registro (Usuario que espera ser aprobado)
router.post('/solicitud', validateSchema(registerSchema), solicitarRegistro);

// Aprobar solicitud (Esta es GET porque se hace clic desde un correo)
router.get('/aprobar/:solicitudId', aprobarSolicitud);

export default router;