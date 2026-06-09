import admin from '../../firebaseConfig.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const db = admin.database();
const usuariosRef = db.ref('usuarios');
const solicitudesRef = db.ref('solicitudes');
const ONLY_ADMIN_EMAIL = process.env.ADMIN_MAIL; 

const existeAdmin = async () => {
  const users = await admin.auth().listUsers();
  return users.users.some(u => u.email === ONLY_ADMIN_EMAIL);
};

export const crearAdmin = async (req, res) => {
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
};

export const crearUsuario = async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado.' });

  const decoded = await admin.auth().verifyIdToken(token);
  const emailAdmin = decoded.email;

  if (emailAdmin !== ONLY_ADMIN_EMAIL || !decoded.email_verified) {
    return res.status(403).json({ error: 'Solo el administrador puede crear usuarios directamente.' });
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

  return res.status(201).json({ message: 'Usuario creado exitosamente.', uid: nuevoUsuario.uid });
};

export const enviarLinkRecuperacion = async (req, res) => {
  const { email } = req.body;
  const link = await admin.auth().generatePasswordResetLink(email);
  res.status(200).json({ message: 'Correo de recuperación enviado.', link });
};

// 🔒 SOLICITUD DE REGISTRO SEGURA
export const solicitarRegistro = async (req, res) => {
  const { email, password, displayName } = req.body;

  // 1. Crea el usuario en Firebase de inmediato para que encripte el password, PERO DESHABILITADO
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName,
    disabled: true // El usuario no puede hacer login hasta ser aprobado
  });

  // 2. Guarda la solicitud usando el UID de Firebase (SIN CONTRASEÑA)
  await solicitudesRef.child(userRecord.uid).set({
    email,
    displayName,
    estado: 'pendiente',
    fecha: Date.now()
  });

  const linkAprobacion = `https://sistema-dentista.onrender.com/api/auth/aprobar/${userRecord.uid}`;
  await enviarCorreoAdmin(email, displayName, linkAprobacion);

  res.status(200).json({ message: 'Solicitud enviada para aprobación.' });
};

// ✅ APROBACIÓN SEGURA
export const aprobarSolicitud = async (req, res) => {
  const { solicitudId } = req.params; // Este ahora es el UID del usuario en Firebase
  const solicitudRef = solicitudesRef.child(solicitudId);

  const snapshot = await solicitudRef.once('value');
  if (!snapshot.exists()) return res.status(404).send('Solicitud no encontrada.');

  const { email, displayName, estado } = snapshot.val();
  if (estado === 'aprobada') return res.status(400).send('Esta solicitud ya fue aprobada.');

  // 1. Habilita al usuario en Firebase para que ya pueda iniciar sesión
  await admin.auth().updateUser(solicitudId, { disabled: false });

  // 2. Registralo en la base de datos oficial
  await usuariosRef.child(solicitudId).set({
    email,
    displayName,
    rol: 'usuario',
    creadoPor: 'admin',
    creadoEn: Date.now()
  });

  await solicitudRef.update({ estado: 'aprobada', aprobadaEn: Date.now() });

  await enviarCorreoUsuarioAprobado(email, displayName);

  res.status(200).send('✅ Usuario aprobado, habilitado y notificado al correo.');
};

// 📧 Utilidades de Correo (Sin cambios mayores)
async function enviarCorreoUsuarioAprobado(email, nombre) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.ADMIN_MAIL, pass: process.env.ADMIN_MAIL_PASS }
  });
  await transporter.sendMail({
    from: `"Sistema Ortodoncista" <${process.env.ADMIN_MAIL}>`,
    to: email,
    subject: '✅ Tu cuenta ha sido aprobada',
    html: `<p>Hola <strong>${nombre}</strong>,</p><p>Tu solicitud ha sido <strong>aprobada</strong>.</p><p>Ahora puedes iniciar sesión en: <a href="https://sistema-dentista.onrender.com/login">Iniciar sesión</a></p>`
  });
}

async function enviarCorreoAdmin(correoSolicitante, nombre, link) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: process.env.ADMIN_MAIL, pass: process.env.ADMIN_MAIL_PASS }
  });
  await transporter.sendMail({
    from: `"Sistema Ortodoncista" <${process.env.ADMIN_MAIL}>`,
    to: ONLY_ADMIN_EMAIL,
    subject: `Nueva solicitud de registro: ${correoSolicitante}`,
    html: `<p>Nombre: <strong>${nombre}</strong></p><p>Correo: <strong>${correoSolicitante}</strong></p><p>Haz clic para aprobar:</p><a href="${link}">${link}</a>`
  });
}