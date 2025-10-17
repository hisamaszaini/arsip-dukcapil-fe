import type { ApiResponse } from "../types/api.types";
import type { LoginDto } from "../types/auth.types";
import type { User } from "../types/user.types";
import api from "./api";

export const authService = {
    // Login
    async login(loginData: LoginDto): Promise<ApiResponse> {
        const response = await api.post('/auth/login', loginData);
        return response.data;
    },

    // Get user profile
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    // Refresh token
    async refreshToken(): Promise<ApiResponse> {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    // Logout
    async logout(): Promise<ApiResponse> {
        const response = await api.post('/auth/logout');
        return response.data;
    },
}