import React, { useState } from 'react';
import { SortableHeader } from '../ui/SortableHeader';
import { formatTanggal } from '../../utils/date';
import { ChevronDown } from 'lucide-react';
import type {
    AktaKelahiran,
    AktaKelahiranSortableKeys,
    FindAllAktaDto,
} from '../../types/aktaKelahiran.types';

interface AktaKelahiranTableProps {
    userList: AktaKelahiran[];
    isLoading: boolean;
    onSort: (sortKey: AktaKelahiranSortableKeys) => void;
    queryParams: Partial<FindAllAktaDto>;
    onEdit: (akta: AktaKelahiran) => void;
    onDelete: (id: number) => void;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const AktaKelahiranTable: React.FC<AktaKelahiranTableProps> = ({
    userList,
    isLoading,
    onSort,
    queryParams,
    onEdit,
    onDelete,
}) => {
    const [expandedAccordions, setExpandedAccordions] = useState<Record<number, boolean>>({});
    const startIndex = ((queryParams.page || 1) - 1) * (queryParams.limit || 10);

    const toggleAccordion = (id: number) => {
        setExpandedAccordions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const renderState = (message: string, colSpan: number) => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            return <div className="text-center p-8 text-gray-500">{message}</div>;
        }
        return (
            <tr>
                <td colSpan={colSpan} className="text-center p-8 text-gray-500">
                    {message}
                </td>
            </tr>
        );
    };

    const renderFileLink = (filePath: string, fileName?: string) => (
        <a
            href={`${API_URL}/uploads/${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            title={fileName || 'Lihat File'}
        >
            <i className="fas fa-file-image mr-1 sm:mr-1.5"></i> JPG
        </a>
    );

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border-y border-gray-200 rounded-lg shadow-md">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            <th className="px-2 py-5 text-center">No.</th>
                            <SortableHeader columnKey="noAkta" onSort={onSort} queryParams={queryParams}>
                                No. Akta
                            </SortableHeader>
                            <SortableHeader columnKey="noFisik" onSort={onSort} queryParams={queryParams}>
                                No. Fisik
                            </SortableHeader>
                            <SortableHeader columnKey="createdAt" onSort={onSort} queryParams={queryParams}>
                                Tanggal Dibuat
                            </SortableHeader>
                            <th className="px-6 py-3 text-center">Lampiran</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading
                            ? renderState('Memuat data...', 6)
                            : userList.length === 0
                                ? renderState('Tidak ada data akta kelahiran.', 6)
                                : userList.map((akta, index) => {
                                    const files = akta.arsipFiles || [];
                                    const isExpanded = !!expandedAccordions[akta.id];
                                    const hasFiles = files.length > 0;

                                    return (
                                        <React.Fragment key={akta.id}>
                                            <tr
                                                onClick={() => hasFiles && toggleAccordion(akta.id)}
                                                className={`transition-colors duration-150 ${isExpanded ? 'bg-indigo-50' : 'bg-white'
                                                    } ${hasFiles ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                            >
                                                <td className="px-2 py-4 text-medium text-gray-500 text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-4 py-4 font-medium text-gray-900">{akta.noAkta}</td>
                                                <td className="px-4 py-4 text-gray-700">{akta.noFisik}</td>
                                                <td className="px-4 py-4 text-gray-700">{formatTanggal(akta.createdAt)}</td>
                                                <td className="px-4 py-4 text-center">
                                                    {hasFiles ? (
                                                        <span className="text-sm text-gray-600">
                                                            {files.length} file{files.length > 1 ? 's' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">-</span>
                                                    )}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-center"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button
                                                            onClick={() => onEdit(akta)}
                                                            title="Edit Data"
                                                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors cursor-pointer"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(akta.id)}
                                                            title="Hapus Data"
                                                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                        {hasFiles && (
                                                            <button
                                                                onClick={() => toggleAccordion(akta.id)}
                                                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
                                                                aria-label={isExpanded ? 'Tutup detail' : 'Buka detail'}
                                                                title={isExpanded ? 'Tutup detail' : 'Buka detail'}
                                                            >
                                                                <ChevronDown
                                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                                                        }`}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Accordion File List */}
                                            {isExpanded && hasFiles && (
                                                <tr className="bg-white">
                                                    <td colSpan={6}>
                                                        <div className="p-4 bg-slate-50/70">
                                                            <h4 className="text-sm font-semibold mb-3 text-slate-800">
                                                                Lampiran:
                                                            </h4>
                                                            <div className="pl-4 space-y-3 border-l-2 border-indigo-200 max-w-md">
                                                                {files.map((file) => (
                                                                    <div
                                                                        key={file.id}
                                                                        className="flex justify-between items-center pr-1"
                                                                    >
                                                                        <span className="text-sm text-gray-700 truncate max-w-[180px]">
                                                                            {file.originalName}
                                                                        </span>
                                                                        {renderFileLink(file.path, file.originalName)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {isLoading
                    ? renderState('Memuat data...', 6)
                    : userList.length === 0
                        ? renderState('Tidak ada data akta kelahiran.', 6)
                        : (
                            <div className="space-y-4">
                                {userList.map((akta, index) => {
                                    const files = akta.arsipFiles || [];
                                    const isExpanded = !!expandedAccordions[akta.id];

                                    return (
                                        <div
                                            key={akta.id}
                                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300"
                                        >
                                            <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                <div>
                                                    <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                                                        {startIndex + index + 1}
                                                    </div>
                                                    <p className="font-semibold text-gray-800 text-sm">
                                                        {akta.noAkta}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatTanggal(akta.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => onEdit(akta)}
                                                        title="Edit"
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(akta.id)}
                                                        title="Hapus"
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">No Fisik:</span>
                                                    <span className="font-medium text-gray-800">{akta.noFisik}</span>
                                                </div>

                                                {files.length > 0 && (
                                                    <div className="border-t border-gray-200 pt-3">
                                                        <button
                                                            onClick={() => toggleAccordion(akta.id)}
                                                            className="w-full flex justify-between items-center text-left"
                                                        >
                                                            <span className="font-medium text-gray-600">
                                                                Lampiran ({files.length})
                                                            </span>
                                                            <ChevronDown
                                                                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                                    }`}
                                                            />
                                                        </button>

                                                        <div
                                                            className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-3' : 'max-h-0'
                                                                }`}
                                                        >
                                                            <div className="pl-2 space-y-2 border-l-2 border-blue-200">
                                                                {files.map((file) => (
                                                                    <div
                                                                        key={file.id}
                                                                        className="flex justify-between items-center pr-1"
                                                                    >
                                                                        <span className="text-gray-700 text-sm truncate max-w-[150px]">
                                                                            {file.originalName}
                                                                        </span>
                                                                        {renderFileLink(file.path, file.originalName)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
            </div>
        </>
    );
};

export default AktaKelahiranTable;
