import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import type { PaginationMeta } from '../types/api.types';
import type { CreateDto, FindAllUserDto, UpdateDto, User, UserSortableKeys } from '../types/user.types';

export const useUserData = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [queryParams, setQueryParams] = useState<Partial<FindAllUserDto>>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'asc',
        search: '',
    });

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await userService.findAllUsers(queryParams);
            setUserList(response.data);
            setPaginationMeta(response.meta || null);
        } catch (error) {
            console.error("Gagal memuat data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setQueryParams(prev => {
                if (prev.search !== searchTerm) {
                    return { ...prev, page: 1, search: searchTerm };
                }
                return prev;
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSort = useCallback((sortKey: UserSortableKeys) => {
        setQueryParams(prev => ({
            ...prev,
            page: 1,
            sortBy: sortKey,
            sortOrder: prev.sortBy === sortKey && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setQueryParams(prev => ({ ...prev, page: newPage }));
    }, []);

    const handleFilterChange = useCallback((name: keyof Partial<FindAllUserDto>, value: string | undefined) => {
        setQueryParams(prev => ({ ...prev, page: 1, [name]: value }));
    }, []);

    const findOneUser = useCallback(async (id: number) => {
        return await userService.findOne(id);
    }, []);

    const saveUser = useCallback(async (formData: CreateDto | UpdateDto, id: number | null) => {
        const { ...payload } = formData;

        if (id) {
            const updatePayload: UpdateDto = { ...payload };

            if (!updatePayload.password) {
                delete updatePayload.password;
            }

            await userService.update(id, updatePayload);
            setQueryParams(prev => ({ ...prev }));
        } else {
            await userService.create(payload as CreateDto);
            setQueryParams(prev => ({ ...prev, page: 1 }));
        }
    }, []);

    const deleteUser = useCallback(async (id: number) => {
        await userService.remove(id);
        setQueryParams(prev => ({ ...prev, page: 1 }));
    }, []);

    return {
        userList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm, findOneUser, saveUser, deleteUser,
        handleSort, handlePageChange, handleFilterChange
    };
};