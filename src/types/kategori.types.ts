import z from "zod";

export const createKategoriSchema = z.object({
    name: z.string().nonempty("Nama kategori wajib diisi").trim(),
    description: z.string().optional(),
    maxFile: z.number().int().min(1, "Minimal 1 file").default(1),
    formNo: z.string().nonempty("Label No. Form wajib diisi (Contoh: NIK, No. Akta)").trim(),
    rulesFormNama: z.boolean().default(false),
    rulesFormTanggal: z.boolean().default(false),

    // Dynamic Validation Rules
    noType: z.enum(['NUMERIC', 'ALPHANUMERIC', 'CUSTOM']).default('ALPHANUMERIC'),
    noMinLength: z.coerce.number().int().optional(),
    noMaxLength: z.coerce.number().int().optional(),
    noRegex: z.string().optional(),
    noPrefix: z.string().optional(),
    noFormat: z.string().optional(),
    noMask: z.string().optional(),
    uniqueConstraint: z.enum(['NONE', 'NO', 'NO_TANGGAL', 'NO_NOFISIK']).default('NONE'),
    isEncrypt: z.boolean().default(false),
});

export const updateKategoriSchema = createKategoriSchema.partial();

export const findAllKategoriSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    sortBy: z.enum(['id', 'name', 'createdAt']).optional().default('id'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const kategoriSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    maxFile: z.number(),
    formNo: z.string(),
    rulesFormNama: z.boolean(),
    rulesFormTanggal: z.boolean(),

    // Dynamic Validation Rules
    noType: z.enum(['NUMERIC', 'ALPHANUMERIC', 'CUSTOM']).optional(),
    noMinLength: z.number().nullable().optional(),
    noMaxLength: z.number().nullable().optional(),
    noRegex: z.string().nullable().optional(),
    noPrefix: z.string().nullable().optional(),
    noFormat: z.string().nullable().optional(),
    noMask: z.string().nullable().optional(),
    uniqueConstraint: z.enum(['NONE', 'NO', 'NO_TANGGAL', 'NO_NOFISIK']).optional().default('NONE'),
    isEncrypt: z.boolean(),

    createdAt: z.string(),
    updatedAt: z.string(),
});

export type CreateKategoriDto = z.infer<typeof createKategoriSchema>;
export type UpdateKategoriDto = z.infer<typeof updateKategoriSchema>;
export type FindAllKategoriDto = z.infer<typeof findAllKategoriSchema>;
export type Kategori = z.infer<typeof kategoriSchema>;
export type KategoriSortableKeys = z.infer<typeof findAllKategoriSchema>['sortBy'];
