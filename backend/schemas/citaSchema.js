import { z } from 'zod';

export const citaSchema = z.object({
  pacienteId: z.string().min(1, "El ID del paciente es obligatorio"),
  pacienteNombre: z.string().optional(), // Si guardas el nombre para no hacer doble consulta
  fechaHora: z.string().min(1, "La fecha y hora son obligatorias"),
  motivo: z.string().min(3, "El motivo de la cita es muy corto"),
  estado: z.enum(["pendiente", "confirmada", "cancelada", "completada"]).default("pendiente"),
  notas: z.string().optional()
});

export const updateCitaSchema = citaSchema.partial();