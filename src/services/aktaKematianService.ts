import { findAllAktaSchema, type AktaKematian, type FindAllAktaDto } from "../types/aktaKematian.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const aktaKematianService = {
    async create(formData: FormData): Promise<ApiResponse<AktaKematian>> {
        const response = await api.post('/akta-kematian', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async findAllAktaKematian(params: Partial<FindAllAktaDto> = {}): Promise<ApiResponse<AktaKematian[]>> {
        const validatedParams = findAllAktaSchema.parse(params);

        const response = await api.get('/akta-kematian', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<AktaKematian>> {
        const response = await api.get(`/akta-kematian/${id}`);
        return response.data;
    },

    async update(id: number, formData: FormData): Promise<ApiResponse<AktaKematian>> {
        const response = await api.patch(`/akta-kematian/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async removeFile(id: number): Promise<ApiResponse>{
        const response = await api.delete(`/akta-kematian/file/${id}`);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/akta-kematian/${id}`);
        return response.data;
    }
}

export default aktaKematianService;