import z from "zod";
import { createFileSchema } from "./file.types";

export const createSchema = z.object({
  nik: z.string().nonempty('NIK wajib diisi').trim().regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit angka'),
  noAkta: z.string().trim().optional(),
  nama: z.string().nonempty('Nama wajib diisi').trim(),
  fileSuratKematian: createFileSchema("File Surat Kematian", true),
  fileKk: createFileSchema("File KK", true),
  fileLampiran: createFileSchema("File Lampiran", false),
  fileRegister: createFileSchema("File Register", false),
  fileLaporan: createFileSchema("File Laporan", false),
  fileSPTJM: createFileSchema("File SPTJM Kebenaran Identitas Jenazah", false),
});

export const updateSchema = z.object({
  nik: z
    .string()
    .nonempty("NIK wajib diisi")
    .trim()
    .regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"),
  noAkta: z.string().trim().optional(),
  nama: z.string().nonempty("Nama wajib diisi").trim(),
  fileSuratKematian: createFileSchema("File Surat Kematian", false),
  fileKk: createFileSchema("File KK", false),
  fileLampiran: createFileSchema("File Lampiran", false),
  fileRegister: createFileSchema("File Register", false),
  fileLaporan: createFileSchema("File Laporan", false),
  fileSPTJM: createFileSchema("File SPTJM Kebenaran Identitas Jenazah", false),
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

export const aktaKematianSchema = z.object({
  id: z.number(),
  nik: z.string(),
  noAkta: z.string().optional(),
  nama: z.string(),
  fileSuratKematian: z.string(),
  fileKk: z.string(),
  fileLampiran: z.string(),
  fileRegister: z.string(),
  fileLaporan: z.string(),
  fileSPTJM: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
export type FindAllAktaDto = z.infer<typeof findAllAktaSchema>;
export type AktaKematian = z.infer<typeof aktaKematianSchema>;
export type AktaKematianSortableKeys = z.infer<typeof findAllAktaSchema>['sortBy'];