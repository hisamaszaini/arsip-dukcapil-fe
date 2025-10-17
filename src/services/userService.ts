import type { ApiResponse } from "../types/api.types";
import { findAllUserSchema, type CreateDto, type FindAllUserDto, type UpdateDto, type User } from "../types/user.types";
import api from "./api";

export const userService = {
    async create(data: CreateDto): Promise<ApiResponse<User>> {
        const response = await api.post('/user', data);
        return response.data;
    },

    async findAllUsers(params: Partial<FindAllUserDto> = {}): Promise<ApiResponse<User[]>> {
        const validatedParams = findAllUserSchema.parse(params);

        const response = await api.get('/user', { params: validatedParams });
        return response.data;
    },

    async findOne(id: number): Promise<ApiResponse<User>> {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },

    async update(id: number, data: Partial<UpdateDto>): Promise<ApiResponse<User>> {
        const response = await api.patch(`/user/${id}`, data);
        return response.data;
    },

    async updateProfile(data: UpdateDto) {
        const response = await api.patch('/user/profile', data);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    }
}

export default userService;