import { findAllAktaSchema, type AktaKematian, type CreateDto, type FindAllAktaDto, type UpdateDto } from "../types/aktaKematian.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const aktaKematianService = {
    async create(data: CreateDto): Promise<ApiResponse<AktaKematian>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.post('/akta-kematian', formData);
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

    async update(id: number, data: UpdateDto): Promise<ApiResponse<AktaKematian>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const response = await api.patch(`/akta-kematian/${id}`, formData);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/akta-kematian/${id}`);
        return response.data;
    }
}

export default aktaKematianService;