import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import kategoriService from '../services/kategoriService';
import type { Kategori, CreateKategoriDto, UpdateKategoriDto, FindAllKategoriDto } from '../types/kategori.types';
import { handleApiError } from '../lib/handleApiError';

export const useKategoriData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paginationMeta, setPaginationMeta] = useState<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null>(null);

    const queryClient = useQueryClient();

    // Initial state from URL params
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [queryParams, setQueryParams] = useState<Partial<FindAllKategoriDto>>({
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 20,
        search: searchParams.get('search') || '',
        sortBy: (searchParams.get('sortBy') as any) || 'id',
        sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    });

    const fetchKategori = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await kategoriService.findAll(queryParams);
            if (response.success && response.data) {
                setKategoriList(response.data);
                setPaginationMeta(response.meta as any);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchKategori();
    }, [fetchKategori]);

    // Update URL when queryParams change
    useEffect(() => {
        const params: any = { ...queryParams };
        if (!params.search) delete params.search;
        setSearchParams(params);
    }, [queryParams, setSearchParams]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setQueryParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSort = (key: string) => {
        setQueryParams(prev => ({
            ...prev,
            sortBy: key as any,
            sortOrder: prev.sortBy === key && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({ ...prev, page: newPage }));
    };

    const findOneKategori = async (id: number) => {
        return await kategoriService.findOne(id);
    };

    const saveKategori = async (data: CreateKategoriDto | UpdateKategoriDto, id: number | null) => {
        try {
            if (id) {
                await kategoriService.update(id, data);
            } else {
                await kategoriService.create(data as CreateKategoriDto);
            }
            fetchKategori();
            // Invalidate sidebar query to refresh menu
            queryClient.invalidateQueries({ queryKey: ['kategori-sidebar'] });
        } catch (error) {
            throw error;
        }
    };

    const deleteKategori = async (id: number, password?: string) => {
        try {
            await kategoriService.remove(id, password);
            fetchKategori();
            // Invalidate sidebar query to refresh menu
            queryClient.invalidateQueries({ queryKey: ['kategori-sidebar'] });
        } catch (error) {
            throw error;
        }
    };

    return {
        kategoriList,
        isLoading,
        paginationMeta,
        queryParams,
        searchTerm,
        setSearchTerm,
        handleSort,
        handlePageChange,
        findOneKategori,
        saveKategori,
        deleteKategori,
        refresh: fetchKategori
    };
};
