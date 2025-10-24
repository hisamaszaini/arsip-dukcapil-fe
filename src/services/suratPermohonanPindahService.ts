import { findAllSuratPermohonanPindahSchema, type CreateDto, type FindAllSuratPermohonanPindahDto, type SuratPermohonanPindah, type UpdateDto } from "../types/suratPermohonanPindah.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const suratPermohonanPindahService = {
    async create(data: CreateDto): Promise<ApiResponse<SuratPermohonanPindah>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.post('/surat-permohonan-pindah', formData);
        return response.data;
    },

    async findAllSuratPermohonanPindah(params: Partial<FindAllSuratPermohonanPindahDto> = {}): Promise<ApiResponse<SuratPermohonanPindah[]>> {
        const validatedParams = findAllSuratPermohonanPindahSchema.parse(params);

        const response = await api.get('/surat-permohonan-pindah', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<SuratPermohonanPindah>> {
        const response = await api.get(`/surat-permohonan-pindah/${id}`);
        return response.data;
    },

    async update(id: number, data: UpdateDto): Promise<ApiResponse<SuratPermohonanPindah>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.patch(`/surat-permohonan-pindah/${id}`, formData);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/surat-permohonan-pindah/${id}`);
        return response.data;
    }
}

export default suratPermohonanPindahService;