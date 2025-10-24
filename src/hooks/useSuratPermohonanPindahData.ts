import { useState, useEffect, useCallback } from 'react';
import type { PaginationMeta } from '../types/api.types';
import type { SuratPermohonanPindah, CreateDto, FindAllSuratPermohonanPindahDto, UpdateDto, SuratPermohonanPindahSortableKeys } from '../types/suratPermohonanPindah.types';
import suratPermohonanPindahService from '../services/suratPermohonanPindahService';

export const useSuratPermohonanPindahData = () => {
    const [suratPermohonanPindahList, setSuratPermohonanPindahList] = useState<SuratPermohonanPindah[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [queryParams, setQueryParams] = useState<Partial<FindAllSuratPermohonanPindahDto>>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'asc',
        search: '',
    });

    const fetchSuratPermohonanPindah = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await suratPermohonanPindahService.findAllSuratPermohonanPindah(queryParams);
            setSuratPermohonanPindahList(response.data);
            setPaginationMeta(response.meta || null);
        } catch (error) {
            console.error("Gagal memuat data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchSuratPermohonanPindah();
    }, [fetchSuratPermohonanPindah]);

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

    const handleSort = useCallback((sortKey: SuratPermohonanPindahSortableKeys) => {
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

    const findOneSuratPermohonanPindah = useCallback(async (id: number) => {
        return await suratPermohonanPindahService.findOne(id);
    }, []);

    const saveSuratPermohonanPindah = useCallback(async (formData: CreateDto | UpdateDto, id: number | null) => {
        const { ...payload } = formData;

        if (id) {
            const updatePayload: UpdateDto = { ...payload };
            await suratPermohonanPindahService.update(id, updatePayload);
            setQueryParams(prev => ({ ...prev }));
        } else {
            await suratPermohonanPindahService.create(payload as CreateDto);
            setQueryParams(prev => ({ ...prev, page: 1 }));
        }
    }, []);

    const deleteSuratPermohonanPindah = useCallback(async (id: number) => {
        await suratPermohonanPindahService.remove(id);
        setQueryParams(prev => ({ ...prev, page: 1 }));
    }, []);

    return {
        suratPermohonanPindahList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm, findOneSuratPermohonanPindah, saveSuratPermohonanPindah, deleteSuratPermohonanPindah,
        handleSort, handlePageChange
    };
}