import express from 'express';
import {
  crearAdmin,
  crearUsuario,
  enviarLinkRecuperacion,
  solicitarRegistro,
  aprobarSolicitud
} from '../controllers/authController.js';

const router = express.Router();

// Crear único admin
router.post('/admin', crearAdmin);

// Crear usuarios (requiere token de admin verificado)
router.post('/register', crearUsuario);

// Recuperación de contraseña
router.post('/reset-password', enviarLinkRecuperacion);

// 🔽 Nuevas rutas
router.post('/solicitud', solicitarRegistro);
router.get('/aprobar/:solicitudId', aprobarSolicitud);

export default router;
