import { findAllKategoriSchema, type CreateKategoriDto, type FindAllKategoriDto, type Kategori, type UpdateKategoriDto } from "../types/kategori.types";
import type { ApiResponse } from "../types/api.types";
import api from "./api";

export const kategoriService = {
    async create(data: CreateKategoriDto): Promise<ApiResponse<Kategori>> {
        const response = await api.post('/kategori', data);
        return response.data;
    },

    async findAll(params: Partial<FindAllKategoriDto> = {}): Promise<ApiResponse<Kategori[]>> {
        const validatedParams = findAllKategoriSchema.parse(params);
        const response = await api.get('/kategori', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<Kategori>> {
        const response = await api.get(`/kategori/${id}`);
        return response.data;
    },

    async findBySlug(slug: string): Promise<ApiResponse<Kategori>> {
        const response = await api.get(`/kategori/slug/${slug}`);
        return response.data;
    },

    async update(id: number, data: UpdateKategoriDto): Promise<ApiResponse<Kategori>> {
        const response = await api.patch(`/kategori/${id}`, data);
        return response.data;
    },

    async remove(id: number, password?: string): Promise<ApiResponse<Kategori>> {
        const response = await api.delete(`/kategori/${id}`, { data: { password } });
        return response.data;
    }
}

export default kategoriService;
