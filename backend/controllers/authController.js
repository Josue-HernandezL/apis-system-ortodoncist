import admin from '../../firebaseConfig.js';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const db = admin.database();
const usuariosRef = db.ref('usuarios');
const solicitudesRef = db.ref('solicitudes');
const ONLY_ADMIN_EMAIL = 'jh6466011@gmail.com'; // Cambia esto si es necesario

// Verifica si ya existe un usuario admin
const existeAdmin = async () => {
  const users = await admin.auth().listUsers();
  return users.users.some(u => u.email === ONLY_ADMIN_EMAIL);
};

export const crearAdmin = async (req, res) => {
  try {
    const yaExiste = await existeAdmin();
    if (yaExiste) return res.status(403).json({ error: 'Ya hay un administrador registrado.' });

    const { email, password, displayName } = req.body;
    if (email !== ONLY_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Este correo no está autorizado como administrador.' });
    }

    const userRecord = await admin.auth().createUser({ email, password, displayName });

    await usuariosRef.child(userRecord.uid).set({
      email,
      displayName,
      rol: 'admin',
      creadoEn: Date.now()
    });

    res.status(201).json({ message: 'Administrador creado exitosamente.', uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearUsuario = async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado.' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const emailAdmin = decoded.email;

    if (emailAdmin !== ONLY_ADMIN_EMAIL || !decoded.email_verified) {
      return res.status(403).json({ error: 'Solo el administrador con correo verificado puede crear usuarios.' });
    }

    const { email, password, displayName } = req.body;

    const nuevoUsuario = await admin.auth().createUser({ email, password, displayName });

    await usuariosRef.child(nuevoUsuario.uid).set({
      email,
      displayName,
      rol: 'usuario',
      creadoPor: emailAdmin,
      creadoEn: Date.now()
    });

    return res.status(201).json({ message: 'Usuario creado y registrado en la base de datos.', uid: nuevoUsuario.uid });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const enviarLinkRecuperacion = async (req, res) => {
  const { email } = req.body;
  try {
    const link = await admin.auth().generatePasswordResetLink(email);
    res.status(200).json({ message: 'Correo de recuperación enviado.', link });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔽 NUEVO: Solicitud de usuario
export const solicitarRegistro = async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const solicitudId = uuidv4();

    await solicitudesRef.child(solicitudId).set({
      email,
      password,
      displayName,
      estado: 'pendiente',
      fecha: Date.now()
    });

    const linkAprobacion = `https://apis-system-ortodoncist.onrender.com/api/auth/aprobar/${solicitudId}`;
    console.log('Enviando correo...');
    await enviarCorreoAdmin(email, displayName, linkAprobacion);
    console.log('Correo enviado.');


    res.status(200).json({ message: 'Solicitud enviada para aprobación.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔽 NUEVO: Aprobación por parte del admin
export const aprobarSolicitud = async (req, res) => {
  const { solicitudId } = req.params;
  const solicitudRef = solicitudesRef.child(solicitudId);

  try {
    const snapshot = await solicitudRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).send('Solicitud no encontrada.');
    }

    const { email, password, displayName, estado } = snapshot.val();
    if (estado === 'aprobada') {
      return res.status(400).send('Esta solicitud ya fue aprobada.');
    }

    const nuevoUsuario = await admin.auth().createUser({ email, password, displayName });

    await usuariosRef.child(nuevoUsuario.uid).set({
      email,
      displayName,
      rol: 'usuario',
      creadoPor: 'admin',
      creadoEn: Date.now()
    });

    await solicitudRef.update({ estado: 'aprobada', aprobadaEn: Date.now() });

    // 🔔 Notificar al usuario
    await enviarCorreoUsuarioAprobado(email, displayName);

    res.status(200).send('✅ Usuario creado y notificado al correo.');
  } catch (error) {
    res.status(500).send('Error al aprobar solicitud: ' + error.message);
  }
};

async function enviarCorreoUsuarioAprobado(email, nombre) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_MAIL,
      pass: process.env.ADMIN_MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Sistema Ortodoncista" <${process.env.ADMIN_MAIL}>`,
    to: email,
    subject: '✅ Tu cuenta ha sido aprobada',
    html: `
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Tu solicitud para registrarte en el sistema ha sido <strong>aprobada</strong>.</p>
      <p>Ahora puedes iniciar sesión en: <a href="https://apis-system-ortodoncist.onrender.com/login">Iniciar sesión</a></p>
    `
  });
}


// 🔽 NUEVO: Función para enviar correo al admin
async function enviarCorreoAdmin(correoSolicitante, nombre, link) {

  console.log('ADMIN_MAIL:', process.env.ADMIN_MAIL);
  console.log('ADMIN_MAIL_PASS:', process.env.ADMIN_MAIL_PASS ? '****' : 'MISSING');


  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_MAIL,
    pass: process.env.ADMIN_MAIL_PASS
  }
});

  await transporter.sendMail({
    from: `"Sistema Ortodoncista" <${process.env.ADMIN_MAIL}>`,
    to: ONLY_ADMIN_EMAIL,
    subject: `Nueva solicitud de registro: ${correoSolicitante}`,
    html: `
      <p>Nombre: <strong>${nombre}</strong></p>
      <p>Correo: <strong>${correoSolicitante}</strong></p>
      <p>Haz clic para aprobar el registro:</p>
      <a href="${link}">${link}</a>
    `
  });
}
