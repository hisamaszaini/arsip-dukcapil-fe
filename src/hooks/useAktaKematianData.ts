import { useState, useEffect, useCallback } from 'react';
import type { PaginationMeta } from '../types/api.types';
import type { AktaKematian, CreateDto, FindAllAktaDto, UpdateDto, AktaKematianSortableKeys } from '../types/aktaKematian.types';
import aktaKematianService from '../services/aktaKematianService';

export const useAktaKematianData = () => {
    const [aktaKematianList, setAktaKematianList] = useState<AktaKematian[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [queryParams, setQueryParams] = useState<Partial<FindAllAktaDto>>({
        page: 1,
        limit: 20,
        sortBy: 'id',
        sortOrder: 'desc',
        search: '',
    });

    const fetchAktaKematian = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await aktaKematianService.findAllAktaKematian(queryParams);
            setAktaKematianList(response.data);
            setPaginationMeta(response.meta || null);
        } catch (error) {
            console.error("Gagal memuat data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchAktaKematian();
    }, [fetchAktaKematian]);

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

    const handleSort = useCallback((sortKey: AktaKematianSortableKeys) => {
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

    const findOneAktaKematian = useCallback(async (id: number) => {
        return await aktaKematianService.findOne(id);
    }, []);

    const saveAktaKematian = useCallback(async (formData: CreateDto | UpdateDto, id: number | null) => {
        const { ...payload } = formData;

        if (id) {
            const updatePayload: UpdateDto = { ...payload };
            await aktaKematianService.update(id, updatePayload);
            setQueryParams(prev => ({ ...prev }));
        } else {
            await aktaKematianService.create(payload as CreateDto);
            setQueryParams(prev => ({ ...prev, page: 1 }));
        }
    }, []);

    const deleteAktaKematian = useCallback(async (id: number) => {
        await aktaKematianService.remove(id);
        setQueryParams(prev => ({ ...prev, page: 1 }));
    }, []);

    return {
        aktaKematianList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm, findOneAktaKematian, saveAktaKematian, deleteAktaKematian,
        handleSort, handlePageChange
    };
}