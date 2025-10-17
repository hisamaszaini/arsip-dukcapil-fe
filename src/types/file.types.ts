import z from "zod";

export const createFileSchema = (label: string, required = true) => {
  const base = z
    .instanceof(File, { message: `${label} wajib diunggah` })
    .refine((file) => file.size > 0, { message: `${label} wajib diunggah` });

  return required ? base : base.optional().nullable();
};