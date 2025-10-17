import { useState, useEffect, useCallback } from 'react';
import type { PaginationMeta } from '../types/api.types';
import type { AktaKelahiran, CreateDto, FindAllAktaDto, UpdateDto, AktaKelahiranSortableKeys } from '../types/aktaKelahiran.types';
import aktaKelahiranService from '../services/aktaKelahiranService';

export const useAktaKelahiranData = () => {
    const [aktaKelahiranList, setAktaKelahiranList] = useState<AktaKelahiran[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [queryParams, setQueryParams] = useState<Partial<FindAllAktaDto>>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'asc',
        search: '',
    });

    const fetchAktaKelahiran = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await aktaKelahiranService.findAllAktaKelahiran(queryParams);
            setAktaKelahiranList(response.data);
            setPaginationMeta(response.meta || null);
        } catch (error) {
            console.error("Gagal memuat data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchAktaKelahiran();
    }, [fetchAktaKelahiran]);

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

    const handleSort = useCallback((sortKey: AktaKelahiranSortableKeys) => {
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

    const findOneAktaKelahiran = useCallback(async (id: number) => {
        return await aktaKelahiranService.findOne(id);
    }, []);

    const saveAktaKelahiran = useCallback(async (formData: CreateDto | UpdateDto, id: number | null) => {
        const { ...payload } = formData;

        if (id) {
            const updatePayload: UpdateDto = { ...payload };
            await aktaKelahiranService.update(id, updatePayload);
            setQueryParams(prev => ({ ...prev }));
        } else {
            await aktaKelahiranService.create(payload as CreateDto);
            setQueryParams(prev => ({ ...prev, page: 1 }));
        }
    }, []);

    const deleteAktaKelahiran = useCallback(async (id: number) => {
        await aktaKelahiranService.remove(id);
        setQueryParams(prev => ({ ...prev, page: 1 }));
    }, []);

    return {
        aktaKelahiranList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm, findOneAktaKelahiran, saveAktaKelahiran, deleteAktaKelahiran,
        handleSort, handlePageChange
    };
}