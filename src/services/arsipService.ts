import { findAllArsipSchema, type Arsip, type FindAllArsipDto } from "../types/arsip.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const arsipService = {
    async create(formData: FormData): Promise<ApiResponse<Arsip>> {
        const response = await api.post('/arsip', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async findAll(params: Partial<FindAllArsipDto> = {}): Promise<ApiResponse<Arsip[]>> {
        const validatedParams = findAllArsipSchema.parse(params);
        const response = await api.get('/arsip', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<Arsip>> {
        const response = await api.get(`/arsip/${id}`);
        return response.data;
    },

    async update(id: number, formData: FormData): Promise<ApiResponse<Arsip>> {
        const response = await api.patch(`/arsip/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async removeFile(id: number): Promise<ApiResponse<any>> {
        const response = await api.delete(`/arsip/file/${id}`);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<Arsip>> {
        const response = await api.delete(`/arsip/${id}`);
        return response.data;
    }
}

export default arsipService;
