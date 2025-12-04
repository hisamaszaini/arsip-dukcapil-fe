import z from "zod";

export const createArsipSchema = z.object({
    idKategori: z.number(),
    no: z.string().optional(),
    nama: z.string().optional(),
    tanggal: z.string().optional(), // ISO Date string
    noFisik: z.string().nonempty("Nomor Fisik wajib diisi").trim(),
});

export const arsipSchema = z.object({
    id: z.number(),
    idKategori: z.number(),
    no: z.string(),
    nama: z.string().nullable(),
    tanggal: z.string().nullable(),
    noFisik: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdById: z.number().optional(),
    arsipFiles: z.array(
        z.object({
            id: z.number(),
            originalName: z.string(),
            path: z.string(),
        })
    ),
    isSync: z.boolean().default(false),
    syncAt: z.string().nullable().optional(),
});

export const findAllArsipSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    sortBy: z.enum(['id', 'no', 'nama', 'noFisik', 'createdAt', 'updatedAt']).optional().default('id'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    kategoriId: z.number().optional(),
});

export type CreateArsipDto = z.infer<typeof createArsipSchema>;
export type UpdateArsipDto = z.infer<typeof createArsipSchema>; // Reusing create schema for now, or use partial
export type FindAllArsipDto = z.infer<typeof findAllArsipSchema>;
export type Arsip = z.infer<typeof arsipSchema>;
export type ArsipSortableKeys = z.infer<typeof findAllArsipSchema>['sortBy'];
