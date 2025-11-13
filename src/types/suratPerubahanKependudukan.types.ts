import z from "zod";

export const createSchema = z.object({
    nik: z.string().nonempty('NIK wajib diisi').trim().regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit angka'),
    // nama: z.string().nonempty('Nama wajib diisi').trim(),
    noFisik: z
        .string()
        .trim()
        .nonempty("Nomor Fisik wajib diisi")
        .transform((val) => val.toUpperCase()),
});

export const updateSchema = z.object({
    nik: z.string().nonempty("NIK wajib diisi").trim().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka").optional(),
    // nama: z.string().nonempty("Nama wajib diisi").trim(),
    noFisik: z
        .string()
        .trim()
        .optional()
        .transform((val) => (val ? val.toUpperCase() : undefined)),

    fileIds: z
        .union([
            z.array(z.union([z.string(), z.number()])),
            z.string().transform((val) => [val]),
            z.number().transform((val) => [val]),
        ])
        .optional()
        .transform((val) => (val ? val.map((v) => Number(v)) : undefined)),
});

export const findAllSuratPerubahanKependudukanSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    sortBy: z.enum([
        'id',
        'nik',
        // 'nama',
        'noFisik',
        'createdAt',
    ]).optional().default('id'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const SuratPerubahanKependudukanSchema = z.object({
    id: z.number(),
    nik: z.string(),
    // nama: z.string(),
    noFisik: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    arsipFiles: z
        .array(
            z.object({
                id: z.number(),
                originalName: z.string(),
                path: z.string(),
            })
        )
        .optional(),
});

export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
export type FindAllSuratPerubahanKependudukanDto = z.infer<typeof findAllSuratPerubahanKependudukanSchema>;
export type SuratPerubahanKependudukan = z.infer<typeof SuratPerubahanKependudukanSchema>;
export type SuratPerubahanKependudukanSortableKeys = z.infer<typeof findAllSuratPerubahanKependudukanSchema>['sortBy'];