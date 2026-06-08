export const validateSchema = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // Valida y limpia campos no definidos
    next();
  } catch (error) {
    return res.status(400).json({ 
      error: "Datos de entrada inválidos", 
      detalles: error.errors.map(e => ({ campo: e.path.join('.'), mensaje: e.message }))
    });
  }
};