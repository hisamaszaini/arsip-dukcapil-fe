import z from "zod";

export type UserRole = 'ADMIN' | 'OPERATOR';

export const roleUserEnum = z.enum([
    'ADMIN',
    'OPERATOR'
]);

export const statusUserEnum = z.enum([
    'ACTIVE',
    'INACTIVE'
]);

export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    username: z.string(),
    role: z.enum(['ADMIN', 'OPERATOR']),
    statusUser: z.enum(['ACTIVE', 'INACTIVE']),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});

export const createSchema = z.object({
    name: z.string().nonempty('Nama wajib diisi').trim(),
    email: z.string().email().nonempty('Email wajib diisi').trim(),
    username: z.string().nonempty('Username wajib diisi').trim(),
    role: roleUserEnum.default('ADMIN'),
    statusUser: statusUserEnum.default('ACTIVE'),
    password: z.string().nonempty('Password wajib diisi').min(6, 'Password wajib diisi minimal 6 karakter'),
    confirmPassword: z.string().nonempty('Konfirmasi password wajib diisi').min(6, 'Konfirmasi Password wajib diisi minimal 6 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
});

export const updateSchema = createSchema
    .partial()
    .extend({
        password: z.string()
            .transform(val => val === '' ? undefined : val)
            .optional()
            .refine(val => !val || val.length >= 6, 'Password minimal 6 karakter'),

        confirmPassword: z.string()
            .transform(val => val === '' ? undefined : val)
            .optional()
            .refine(val => !val || val.length >= 6, 'Konfirmasi password minimal 6 karakter'),
    })
    .refine(
        (data) => {
            if (!data.password && !data.confirmPassword) return true; // kosong → ok
            return data.password === data.confirmPassword;
        },
        {
            message: 'Password dan konfirmasi password tidak cocok',
            path: ['confirmPassword'],
        }
    );

export const loginSchema = z.object({
    username: z.string().nonempty('Username wajib diisi').trim(),
    password: z.string().nonempty('Password wajib diisi').min(6, 'Password wajib diisi minimal 6 karakter'),
});

export const findAllUserSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).optional().default(20),
    search: z.string().optional(),
    role: roleUserEnum.optional(),
    statusUser: statusUserEnum.optional(),
    sortBy: z.enum(['id', 'name', 'email', 'username', 'role', 'statusUser', 'createdAt']).optional().default('id'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type FindAllUserDto = z.infer<typeof findAllUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserSortableKeys = z.infer<typeof findAllUserSchema>['sortBy'];