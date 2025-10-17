import { useState, useEffect, useCallback } from 'react';
import type { PaginationMeta } from '../types/api.types';
import type { SuratKehilangan, CreateDto, FindAllSuratKehilanganDto, UpdateDto, SuratKehilanganSortableKeys } from '../types/suratKehilangan.types';
import suratKehilanganService from '../services/suratKehilanganService';

export const useSuratKehilanganData = () => {
    const [suratKehilanganList, setSuratKehilanganList] = useState<SuratKehilangan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [queryParams, setQueryParams] = useState<Partial<FindAllSuratKehilanganDto>>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'asc',
        search: '',
    });

    const fetchSuratKehilangan = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await suratKehilanganService.findAllSuratKehilangan(queryParams);
            setSuratKehilanganList(response.data);
            setPaginationMeta(response.meta || null);
        } catch (error) {
            console.error("Gagal memuat data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchSuratKehilangan();
    }, [fetchSuratKehilangan]);

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

    const handleSort = useCallback((sortKey: SuratKehilanganSortableKeys) => {
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

    const findOneSuratKehilangan = useCallback(async (id: number) => {
        return await suratKehilanganService.findOne(id);
    }, []);

    const saveSuratKehilangan = useCallback(async (formData: CreateDto | UpdateDto, id: number | null) => {
        const { ...payload } = formData;

        if (id) {
            const updatePayload: UpdateDto = { ...payload };
            await suratKehilanganService.update(id, updatePayload);
            setQueryParams(prev => ({ ...prev }));
        } else {
            await suratKehilanganService.create(payload as CreateDto);
            setQueryParams(prev => ({ ...prev, page: 1 }));
        }
    }, []);

    const deleteSuratKehilangan = useCallback(async (id: number) => {
        await suratKehilanganService.remove(id);
        setQueryParams(prev => ({ ...prev, page: 1 }));
    }, []);

    return {
        suratKehilanganList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm, findOneSuratKehilangan, saveSuratKehilangan, deleteSuratKehilangan,
        handleSort, handlePageChange
    };
}