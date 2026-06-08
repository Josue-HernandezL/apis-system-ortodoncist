import { z } from 'zod';

export const inventarioSchema = z.object({
  nombre: z.string().min(2, "El nombre del artículo es obligatorio"),
  cantidad: z.number().int().nonnegative("La cantidad no puede ser negativa"),
  categoria: z.string().optional(),
  precioUnitario: z.number().nonnegative().optional(),
  fechaCaducidad: z.string().optional(),
  proveedor: z.string().optional()
});

export const updateInventarioSchema = inventarioSchema.partial();