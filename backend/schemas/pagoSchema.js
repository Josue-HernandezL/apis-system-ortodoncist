import { z } from 'zod';

export const pagoSchema = z.object({
  pacienteId: z.string().min(1, "El ID del paciente es obligatorio"),
  monto: z.number().positive("El monto debe ser un número positivo"),
  fecha: z.string().min(1, "La fecha de pago es obligatoria"),
  metodoPago: z.enum(["efectivo", "tarjeta", "transferencia"]).default("efectivo"),
  concepto: z.string().min(3, "El concepto del pago es muy corto"),
  estado: z.enum(["completado", "pendiente", "reembolsado"]).default("completado")
});

export const updatePagoSchema = pagoSchema.partial();