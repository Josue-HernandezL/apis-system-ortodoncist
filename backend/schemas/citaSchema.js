import { z } from 'zod';

export const citaSchema = z.object({
  pacienteId: z.string().min(1, "El ID del paciente es obligatorio"),
  fecha: z.string().datetime({ message: "Fecha inválida, debe ser ISO 8601" }),
  motivo: z.string().min(5, "El motivo debe tener al menos 5 caracteres"),
  estado: z.enum(["pendiente", "completada", "cancelada"]).default("pendiente"),
});