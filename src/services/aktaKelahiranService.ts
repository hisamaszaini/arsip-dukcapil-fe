import { findAllAktaSchema, type AktaKelahiran, type FindAllAktaDto } from "../types/aktaKelahiran.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const aktaKelahiranService = {
    async create(formData: FormData): Promise<ApiResponse<AktaKelahiran>> {
        const response = await api.post('/akta-kelahiran', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async findAllAktaKelahiran(params: Partial<FindAllAktaDto> = {}): Promise<ApiResponse<AktaKelahiran[]>> {
        const validatedParams = findAllAktaSchema.parse(params);

        const response = await api.get('/akta-kelahiran', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<AktaKelahiran>> {
        const response = await api.get(`/akta-kelahiran/${id}`);
        return response.data;
    },

    async update(id: number, formData: FormData): Promise<ApiResponse<AktaKelahiran>> {
        const response = await api.patch(`/akta-kelahiran/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async removeFile(id: number): Promise<ApiResponse>{
        const response = await api.delete(`/akta-kelahiran/file/${id}`);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/akta-kelahiran/${id}`);
        return response.data;
    }
}

export default aktaKelahiranService;