import z from "zod";

export const createSchema = z.object({
  noAkta: z.string().trim().nonempty("Nomor Akta Kematian wajib diisi"),
  noFisik: z
    .string()
    .trim()
    .nonempty("Nomor Fisik wajib diisi")
    .transform((val) => val.toUpperCase()),
});

export const updateSchema = z.object({
  noAkta: z.string().trim().optional(),
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
  sortBy: z
    .enum(["id", "noAkta", "noFisik", "createdAt"])
    .optional()
    .default("id"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const aktaKematianSchema = z.object({
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
export type AktaKematian = z.infer<typeof aktaKematianSchema>;
export type AktaKematianSortableKeys = z.infer<typeof findAllAktaSchema>["sortBy"];
