import type { ApiResponse } from "../types/api.types";
import type { DashboardDataDto } from "../types/dashboard.types";
import api from "./api";

export const dashboardService = {
    async dashboardData(): Promise<ApiResponse<DashboardDataDto>>{
        const response = await api.get(`/dashboard`);
        return response.data;
    }
}