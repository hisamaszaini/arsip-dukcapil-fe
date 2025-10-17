import { findAllAktaSchema, type AktaKelahiran, type CreateDto, type FindAllAktaDto, type UpdateDto } from "../types/aktaKelahiran.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const aktaKelahiranService = {
    async create(data: CreateDto): Promise<ApiResponse<AktaKelahiran>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.post('/akta-kelahiran', formData);
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

    async update(id: number, data: UpdateDto): Promise<ApiResponse<AktaKelahiran>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.patch(`/akta-kelahiran/${id}`, formData);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/akta-kelahiran/${id}`);
        return response.data;
    }
}

export default aktaKelahiranService;