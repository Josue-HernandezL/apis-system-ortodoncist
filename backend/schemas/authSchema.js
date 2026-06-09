import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email("Debe ser un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  displayName: z.string().min(2, "El nombre de usuario es obligatorio")
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Debe ser un correo electrónico válido")
});