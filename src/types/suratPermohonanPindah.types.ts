import z from "zod";
import { createFileSchema } from "./file.types";

export const createSchema = z.object({
    nik: z.string().nonempty('NIK wajib diisi').trim().regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit angka'),
    nama: z.string().nonempty('Nama wajib diisi').trim(),
    filePmhnPindah: createFileSchema("File Permohonan Pindah", true),
    fileKk: createFileSchema("File KK", true),
    fileLampiran: createFileSchema("File Lampiran", false),
});

export const updateSchema = z.object({
    nik: z.string().nonempty("NIK wajib diisi").trim().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
    nama: z.string().nonempty("Nama wajib diisi").trim(),

    filePmhnPindah: createFileSchema("File Permohonan Pindah", false),
    fileKk: createFileSchema("File KK", false),
    fileLampiran: createFileSchema("File Lampiran", false),
});

export const findAllSuratPermohonanPindahSchema = z.object({
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

export const SuratPermohonanPindahSchema = z.object({
    id: z.number(),
    nik: z.string(),
    nama: z.string(),
    filePmhnPindah: z.string(),
    fileKk: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
export type FindAllSuratPermohonanPindahDto = z.infer<typeof findAllSuratPermohonanPindahSchema>;
export type SuratPermohonanPindah = z.infer<typeof SuratPermohonanPindahSchema>;
export type SuratPermohonanPindahSortableKeys = z.infer<typeof findAllSuratPermohonanPindahSchema>['sortBy'];