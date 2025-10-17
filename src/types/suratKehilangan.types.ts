import z from "zod";
import { createFileSchema } from "./file.types";

export const createSchema = z.object({
    nik: z.string().nonempty('NIK wajib diisi').trim().regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit angka'),
    nama: z.string().nonempty('Nama wajib diisi').trim(),
    file: createFileSchema("File Surat Kehilangan", true),
});

export const updateSchema = z.object({
    nik: z
        .string()
        .nonempty("NIK wajib diisi")
        .trim()
        .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
    nama: z.string().nonempty("Nama wajib diisi").trim(),
    file: createFileSchema("File Surat Kehilangan", false),
});

export const findAllSuratKehilanganSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    sortBy: z.enum([
        'id',
        'nik',
        'nama',
        'createdAt',
    ]).optional().default('id'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const SuratKehilanganSchema = z.object({
    id: z.number(),
    nik: z.string(),
    nama: z.string(),
    file: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
export type FindAllSuratKehilanganDto = z.infer<typeof findAllSuratKehilanganSchema>;
export type SuratKehilangan = z.infer<typeof SuratKehilanganSchema>;
export type SuratKehilanganSortableKeys = z.infer<typeof findAllSuratKehilanganSchema>['sortBy'];