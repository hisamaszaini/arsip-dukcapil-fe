import { z } from "zod";

const recentActivitySchema = z.object({
    id: z.number(),
    nama: z.string().nullable().optional(),
    createdAt: z.string(),
    jenisLayanan: z.string(),
});

const statItemSchema = z.object({
    label: z.string(),
    count: z.number(),
    icon: z.string(),
    gradient: z.string().optional(),
});

const monthlyStatSchema = z.object({
    month: z.string(),
}).passthrough(); // Allow dynamic keys

export const dashboardDataSchema = z.object({
    stats: z.array(statItemSchema),
    recentActivities: z.array(recentActivitySchema),
    monthlyStats: z.array(monthlyStatSchema),
});

export type DashboardDataDto = z.infer<typeof dashboardDataSchema>;