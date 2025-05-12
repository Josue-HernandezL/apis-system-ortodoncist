import dotenv from 'dotenv';
dotenv.config();

const API_SECRET = (process.env.ACCES_KEY || '').trim();

export function verifyAccesKey(req, res, next) {
  const accesKey = (req.headers['x-api-key'] || '').trim();

  if (accesKey === API_SECRET) {
    return next();
  } else {
    console.error('Acceso denegado. Clave de acceso no válida.');
    return res.status(403).json({
      message: 'No autorizado',
      recibido: accesKey,
      esperado: API_SECRET
    });
  }
}
