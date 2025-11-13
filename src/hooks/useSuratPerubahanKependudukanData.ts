import { useState, useEffect, useCallback } from 'react';
import type { PaginationMeta } from '../types/api.types';
import type { SuratPerubahanKependudukan, FindAllSuratPerubahanKependudukanDto, SuratPerubahanKependudukanSortableKeys } from '../types/suratPerubahanKependudukan.types';
import suratPerubahanKependudukanService from '../services/suratPerubahanKependudukanService';

export const useSuratPerubahanKependudukanData = () => {
    const [suratPerubahanKependudukanList, setSuratPerubahanKependudukanList] = useState<SuratPerubahanKependudukan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [queryParams, setQueryParams] = useState<Partial<FindAllSuratPerubahanKependudukanDto>>({
        page: 1,
        limit: 20,
        sortBy: 'id',
        sortOrder: 'desc',
        search: '',
    });

    const fetchSuratPerubahanKependudukan = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await suratPerubahanKependudukanService.findAllSuratPerubahanKependudukan(queryParams);
            setSuratPerubahanKependudukanList(response.data);
            setPaginationMeta(response.meta || null);
        } catch (error) {
            console.error("Gagal memuat data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchSuratPerubahanKependudukan();
    }, [fetchSuratPerubahanKependudukan]);

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

    const handleSort = useCallback((sortKey: SuratPerubahanKependudukanSortableKeys) => {
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

    const findOneSuratPerubahanKependudukan = useCallback(async (id: number) => {
        return await suratPerubahanKependudukanService.findOne(id);
    }, []);

    const saveSuratPerubahanKependudukan = useCallback(async (formData: FormData, id: number | null) => {
        if (id) {
            await suratPerubahanKependudukanService.update(id, formData);
            setQueryParams(prev => ({ ...prev }));
        } else {
            await suratPerubahanKependudukanService.create(formData);
            setQueryParams(prev => ({ ...prev, page: 1 }));
        }
    }, []);

    const deleteSuratPerubahanKependudukan = useCallback(async (id: number) => {
        await suratPerubahanKependudukanService.remove(id);
        setQueryParams(prev => ({ ...prev, page: 1 }));
    }, []);

    return {
        suratPerubahanKependudukanList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm, findOneSuratPerubahanKependudukan, saveSuratPerubahanKependudukan, deleteSuratPerubahanKependudukan,
        handleSort, handlePageChange
    };
}