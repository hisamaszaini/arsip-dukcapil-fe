import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Kategori } from '../../types/kategori.types';

interface ArsipFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    kategori: Kategori;
}

const ArsipFilter: React.FC<ArsipFilterProps> = ({ searchTerm, kategori }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearchTerm !== searchParams.get('search')) {
                setSearchParams(prev => {
                    if (localSearchTerm) {
                        prev.set('search', localSearchTerm);
                        prev.set('page', '1'); // Reset to page 1 on search
                    } else {
                        prev.delete('search');
                    }
                    return prev;
                });
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [localSearchTerm, setSearchParams, searchParams]);

    return (
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Cari {kategori.name}</span>
            </div>
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder={`Cari Arsip, Masukan ${kategori.formNo}${kategori.rulesFormNama === true ? 'atau  Nama' : ''}...`}
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};

export default ArsipFilter;
