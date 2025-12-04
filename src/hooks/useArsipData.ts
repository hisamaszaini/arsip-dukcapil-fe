import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import arsipService from '../services/arsipService';
import type { Arsip, FindAllArsipDto, ArsipSortableKeys } from '../types/arsip.types';
import { handleApiError } from '../lib/handleApiError';

export const useArsipData = (kategoriId?: number) => {
    const [arsipList, setArsipList] = useState<Arsip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationMeta, setPaginationMeta] = useState<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const queryParams: Partial<FindAllArsipDto> = {
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 20,
        search: searchParams.get('search') || undefined,
        sortBy: (searchParams.get('sortBy') as ArsipSortableKeys) || 'id',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        kategoriId: kategoriId,
    };

    const fetchArsip = useCallback(async () => {
        if (!kategoriId) return;
        setIsLoading(true);
        try {
            const response = await arsipService.findAll(queryParams);
            if (response.success && response.data) {
                setArsipList(response.data);
                setPaginationMeta(response.meta || null);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    }, [JSON.stringify(queryParams), kategoriId]);

    useEffect(() => {
        fetchArsip();
    }, [fetchArsip]);

    const handleSort = (key: ArsipSortableKeys) => {
        const currentSortOrder = queryParams.sortOrder;
        const newSortOrder = queryParams.sortBy === key && currentSortOrder === 'asc' ? 'desc' : 'asc';

        setSearchParams(prev => {
            prev.set('sortBy', key);
            prev.set('sortOrder', newSortOrder);
            return prev;
        });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            prev.set('page', String(newPage));
            return prev;
        });
    };

    const saveArsip = async (formData: FormData, id: number | null) => {
        try {
            if (id) {
                await arsipService.update(id, formData);
            } else {
                await arsipService.create(formData);
            }
            fetchArsip();
            return true;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    };

    const deleteArsip = async (id: number) => {
        try {
            await arsipService.remove(id);
            fetchArsip();
            return true;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    };

    const toggleSync = async (id: number) => {
        try {
            await arsipService.toggleSync(id);
            fetchArsip();
            return true;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    };

    return {
        arsipList,
        isLoading,
        paginationMeta,
        queryParams,
        searchTerm,
        setSearchTerm,
        handleSort,
        handlePageChange,
        saveArsip,
        deleteArsip,
        toggleSync,
        refresh: fetchArsip
    };
};
