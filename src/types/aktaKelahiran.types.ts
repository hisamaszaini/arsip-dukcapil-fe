import z from "zod";
import { createFileSchema } from "./file.types";

export const createSchema = z.object({
    nik: z.string().nonempty('NIK wajib diisi').trim().regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit angka'),
    nama: z.string().nonempty('Nama wajib diisi').trim(),
    fileSuratKelahiran: createFileSchema("File Surat Kelahiran", true),
    fileKk: createFileSchema("File KK", true),
    fileSuratNikah: createFileSchema("File Surat Nikah", true),
    fileSPTJMKelahiran: createFileSchema("File SPTJM Kelahiran", true),
    fileSPTJMPernikahan: createFileSchema("File SPTJM Pernikahan", true),
    fileLampiran: createFileSchema("File Lampiran", false),
});

export const updateSchema = z.object({
  nik: z
    .string()
    .nonempty("NIK wajib diisi")
    .trim()
    .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
  nama: z.string().nonempty("Nama wajib diisi").trim(),

  fileSuratKelahiran: createFileSchema("File Surat Kelahiran", false),
  fileKk: createFileSchema("File KK", false),
  fileSuratNikah: createFileSchema("File Surat Nikah", false),
  fileSPTJMKelahiran: createFileSchema("File SPTJM Kelahiran", false),
  fileSPTJMPernikahan: createFileSchema("File SPTJM Pernikahan", false),
  fileLampiran: createFileSchema("File Lampiran", false),
});

export const findAllAktaSchema = z.object({
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

export const aktaKelahiranSchema = z.object({
    id: z.number(),
    nik: z.string(),
    nama: z.string(),
    fileSuratKelahiran: z.string(),
    fileKk: z.string(),
    fileSuratNikah: z.string(),
    fileSPTJMKelahiran: z.string(),
    fileSPTJMPernikahan: z.string(),
    fileLampiran: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
export type FindAllAktaDto = z.infer<typeof findAllAktaSchema>;
export type AktaKelahiran = z.infer<typeof aktaKelahiranSchema>;
export type AktaKelahiranSortableKeys = z.infer<typeof findAllAktaSchema>['sortBy'];