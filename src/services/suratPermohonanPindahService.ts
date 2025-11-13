import { findAllSuratPermohonanPindahSchema, type SuratPermohonanPindah, type FindAllSuratPermohonanPindahDto } from "../types/suratPermohonanPindah.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const suratPermohonanPindahService = {
    async create(formData: FormData): Promise<ApiResponse<SuratPermohonanPindah>> {
        const response = await api.post('/surat-permohonan-pindah', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
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

    async update(id: number, formData: FormData): Promise<ApiResponse<SuratPermohonanPindah>> {
        const response = await api.patch(`/surat-permohonan-pindah/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async removeFile(id: number): Promise<ApiResponse>{
        const response = await api.delete(`/surat-permohonan-pindah/file/${id}`);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/surat-permohonan-pindah/${id}`);
        return response.data;
    }
}

export default suratPermohonanPindahService;