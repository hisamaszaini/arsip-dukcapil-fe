import { findAllSuratPerubahanKependudukanSchema, type SuratPerubahanKependudukan, type FindAllSuratPerubahanKependudukanDto } from "../types/suratPerubahanKependudukan.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const suratPerubahanKependudukanService = {
    async create(formData: FormData): Promise<ApiResponse<SuratPerubahanKependudukan>> {
        const response = await api.post('/surat-perubahan-kependudukan', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
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

    async update(id: number, formData: FormData): Promise<ApiResponse<SuratPerubahanKependudukan>> {
        const response = await api.patch(`/surat-perubahan-kependudukan/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async removeFile(id: number): Promise<ApiResponse>{
        const response = await api.delete(`/surat-perubahan-kependudukan/file/${id}`);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/surat-perubahan-kependudukan/${id}`);
        return response.data;
    }
}

export default suratPerubahanKependudukanService;