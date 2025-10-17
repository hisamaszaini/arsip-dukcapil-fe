import { findAllSuratKehilanganSchema, type CreateDto, type FindAllSuratKehilanganDto, type SuratKehilangan, type UpdateDto } from "../types/suratKehilangan.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const aktaKehilanganService = {
    async create(data: CreateDto): Promise<ApiResponse<SuratKehilangan>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.post('/surat-kehilangan', formData);
        return response.data;
    },

    async findAllSuratKehilangan(params: Partial<FindAllSuratKehilanganDto> = {}): Promise<ApiResponse<SuratKehilangan[]>> {
        const validatedParams = findAllSuratKehilanganSchema.parse(params);

        const response = await api.get('/surat-kehilangan', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<SuratKehilangan>> {
        const response = await api.get(`/surat-kehilangan/${id}`);
        return response.data;
    },

    async update(id: number, data: UpdateDto): Promise<ApiResponse<SuratKehilangan>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.patch(`/surat-kehilangan/${id}`, formData);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/surat-kehilangan/${id}`);
        return response.data;
    }
}

export default aktaKehilanganService;