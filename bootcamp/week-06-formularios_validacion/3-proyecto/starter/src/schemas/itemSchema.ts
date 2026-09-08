// src/schemas/itemSchema.ts
// Esquema de validación con Zod para el formulario de Cooperativa de Vivienda

import { z } from 'zod';

export const itemSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'Máximo 80 caracteres'),

  ciudad: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),

  tipoVivienda: z.enum(['Apartamento', 'Casa', 'Dúplex', 'Vivienda VIS'], {
    message: 'Selecciona un tipo de vivienda válido',
  }),

  precio: z
    .string()
    .min(1, 'El valor comercial estimado es requerido')
    .max(50, 'Formato de precio demasiado largo'),

  ahorroMensual: z
    .string()
    .min(1, 'La cuota de ahorro mensual es requerida')
    .max(50, 'Formato de cuota demasiado largo'),

  area: z.coerce
    .number()
    .positive('El área debe ser mayor a 0 m²')
    .min(20, 'El área mínima para una vivienda es 20 m²')
    .max(500, 'El área máxima es 500 m²'),

  habitaciones: z.coerce
    .number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 habitación')
    .max(10, 'Máximo 10 habitaciones'),

  banos: z.coerce
    .number()
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1 baño')
    .max(10, 'Máximo 10 baños'),

  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),

  subsidio: z.boolean().default(true),

  imagen: z
    .string()
    .optional()
    .or(z.literal('')),
});

// Inferencia automática del tipo TypeScript desde el schema de Zod
export type ItemFormData = z.infer<typeof itemSchema>;
