import { z } from 'zod';

export const pacienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos son obligatorios"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos").optional(),
  email: z.string().email("Correo electrónico inválido").optional(),
  fechaNacimiento: z.string().optional(),
  motivoConsulta: z.string().optional()
});

// Esquema para actualización (hace que todos los campos sean opcionales)
export const updatePacienteSchema = pacienteSchema.partial();