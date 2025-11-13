import z from "zod";

const noAktaSchema = z
  .string()
  .nonempty("No. Akta wajib diisi")
  .trim()
  .regex(
    /^3520-[A-Z]{2}-\d{8}-\d{4}$/,
    "Format No. Akta tidak valid (Contoh: 3520-XX-31072002-0001)"
  );

export const createSchema = z.object({
  noAkta: noAktaSchema,
  // nama: z.string().nonempty('Nama wajib diisi').trim(),
  noFisik: z
    .string()
    .trim()
    .nonempty("Nomor Fisik wajib diisi")
    .transform((val) => val.toUpperCase()),
});

export const updateSchema = z.object({
  noAkta: noAktaSchema,
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

export const findAllAktaSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  sortBy: z.enum([
    'id',
    'noAkta',
    // 'nama',
    'noFisik',
    'createdAt',
  ]).optional().default('id'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const aktaKelahiranSchema = z.object({
  id: z.number(),
  noAkta: z.string(),
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
export type FindAllAktaDto = z.infer<typeof findAllAktaSchema>;
export type AktaKelahiran = z.infer<typeof aktaKelahiranSchema>;
export type AktaKelahiranSortableKeys = z.infer<typeof findAllAktaSchema>['sortBy'];