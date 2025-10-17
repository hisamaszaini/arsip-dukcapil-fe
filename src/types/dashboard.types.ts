import { z } from "zod";

const recentActivitySchema = z.object({
    id: z.number(),
    nama: z.string(),
    createdAt: z.string(),
    jenisLayanan: z.string(),
});

const monthlyStatSchema = z.object({
    month: z.string(),
    aktaKelahiran: z.number(),
    aktaKematian: z.number(),
    suratKehilangan: z.number(),
});

export const dashboardDataSchema = z.object({
    stats: z.object({
        totalUser: z.number(),
        totalAktaKelahiran: z.number(),
        totalAktaKematian: z.number(),
        totalSuratKehilangan: z.number(),
    }),
    recentActivities: z.array(recentActivitySchema),
    monthlyStats: z.array(monthlyStatSchema),
});

export type DashboardDataDto = z.infer<typeof dashboardDataSchema>;