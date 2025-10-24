import { findAllSuratPerubahanKependudukanSchema, type CreateDto, type FindAllSuratPerubahanKependudukanDto, type SuratPerubahanKependudukan, type UpdateDto } from "../types/suratPerubahanKependudukan.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const suratPerubahanKependudukanService = {
    async create(data: CreateDto): Promise<ApiResponse<SuratPerubahanKependudukan>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.post('/surat-perubahan-kependudukan', formData);
        return response.data;
    },

    async findAllSuratPerubahanKependudukan(params: Partial<FindAllSuratPerubahanKependudukanDto> = {}): Promise<ApiResponse<SuratPerubahanKependudukan[]>> {
        const validatedParams = findAllSuratPerubahanKependudukanSchema.parse(params);

        const response = await api.get('/surat-perubahan-kependudukan', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<SuratPerubahanKependudukan>> {
        const response = await api.get(`/surat-perubahan-kependudukan/${id}`);
        return response.data;
    },

    async update(id: number, data: UpdateDto): Promise<ApiResponse<SuratPerubahanKependudukan>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.patch(`/surat-perubahan-kependudukan/${id}`, formData);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/surat-perubahan-kependudukan/${id}`);
        return response.data;
    }
}

export default suratPerubahanKependudukanService;