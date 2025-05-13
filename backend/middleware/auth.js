import dotenv from 'dotenv';
dotenv.config();

const API_SECRET = (process.env.ACCES_KEY || '').trim();

export function verifyAccesKey(req, res, next) {
  let accesKey = (req.headers['x-api-key'] || '').trim();
    console.log('Acceso a la API');
  if (accesKey === API_SECRET) {
    return next();
    console.log('Acceso permitido');
  } else {
    console.error('Acceso denegado. Clave de acceso no válida.');
    console
    return res.status(403).json({
      message: 'No autorizado',
      error: 'Acceso denegado. Clave de acceso no válida.',
      status: 403
    });
  }
}
