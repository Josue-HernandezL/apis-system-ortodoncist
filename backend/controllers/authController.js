import admin from '../../firebaseConfig.js';

const db = admin.database();
const usuariosRef = db.ref('usuarios');
const ONLY_ADMIN_EMAIL = 'jh6466011@gmail.com'; // Cambia esto por el correo del admin

// Verifica si ya existe un usuario con ese correo
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

    // ⬇️ Solo si pasa la validación, se continúa
    const { email, password, displayName } = req.body;

    const nuevoUsuario = await admin.auth().createUser({ email, password, displayName });

    await admin.database().ref('usuarios').child(nuevoUsuario.uid).set({
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
