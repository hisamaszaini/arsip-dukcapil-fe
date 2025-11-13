import { useState, useEffect, useCallback } from 'react';
import type { PaginationMeta } from '../types/api.types';
import type { SuratPermohonanPindah, FindAllSuratPermohonanPindahDto, SuratPermohonanPindahSortableKeys } from '../types/suratPermohonanPindah.types';
import suratPermohonanPindahService from '../services/suratPermohonanPindahService';

export const useSuratPermohonanPindahData = () => {
    const [suratPermohonanPindahList, setSuratPermohonanPindahList] = useState<SuratPermohonanPindah[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [queryParams, setQueryParams] = useState<Partial<FindAllSuratPermohonanPindahDto>>({
        page: 1,
        limit: 20,
        sortBy: 'id',
        sortOrder: 'desc',
        search: '',
    });

    const fetchSuratPermohonanPindah = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await suratPermohonanPindahService.findAllSuratPermohonanPindah(queryParams);
            setSuratPermohonanPindahList(response.data);
            setPaginationMeta(response.meta || null);
        } catch (error) {
            console.error("Gagal memuat data akta kelahiran:", error);
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

    const saveSuratPermohonanPindah = useCallback(async (formData: FormData, id: number | null) => {
        if (id) {
            await suratPermohonanPindahService.update(id, formData);
            setQueryParams(prev => ({ ...prev }));
        } else {
            await suratPermohonanPindahService.create(formData);
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