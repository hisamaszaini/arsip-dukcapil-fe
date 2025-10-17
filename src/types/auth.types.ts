import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().nonempty('Username wajib diisi').trim(),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export type LoginDto = z.infer<typeof loginSchema>;