import React, { useState } from 'react';
import { SortableHeader } from '../ui/SortableHeader';
import { formatTanggal } from '../../utils/date';
import { ChevronDown } from 'lucide-react';
import type { AktaKelahiran, AktaKelahiranSortableKeys, FindAllAktaDto } from '../../types/aktaKelahiran.types';

interface AktaKelahiranTableProps {
    userList: AktaKelahiran[];
    isLoading: boolean;
    onSort: (sortKey: AktaKelahiranSortableKeys) => void;
    queryParams: Partial<FindAllAktaDto>;
    onEdit: (akta: AktaKelahiran) => void;
    onDelete: (id: number) => void;
}

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

    const renderFileCell = (url?: string) => {
        if (!url) return <span className="text-gray-400 italic">-</span>;
        return (
            <a
                href={`${import.meta.env.VITE_API_BASE_URL}/uploads/${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors" title="Lihat Bukti PDF"><i className="fas fa-file-image mr-1 sm:mr-1.5"></i> JPG</a>
        );
    };

    const toggleAccordion = (id: number) => {
        setExpandedAccordions(prev => ({
            [id]: !prev[id],
        }));
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border-y border-gray-200 rounded-lg shadow-md">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            <th className="px-2 py-5 text-center">No.</th>
                            <SortableHeader columnKey="nik" onSort={onSort} queryParams={queryParams}>No. Akta</SortableHeader>
                            {/* <SortableHeader columnKey="nama" onSort={onSort} queryParams={queryParams}>Nama</SortableHeader> */}
                            <th className="px-6 py-3 text-center">Akta Kelahiran</th>
                            <SortableHeader columnKey="createdAt" onSort={onSort} queryParams={queryParams}>
                                Tanggal Dibuat
                            </SortableHeader>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading
                            ? renderState('Memuat data...', 6)
                            : userList.length === 0
                                ? renderState('Tidak ada data akta kelahiran.', 6)
                                : userList.map((akta, index) => {
                                    const { fileSuratKelahiran, ...otherFiles } = akta;
                                    const labelMap: Record<string, string> = {
                                        fileKk: "Kartu Keluarga (KK)",
                                        fileSuratNikah: "Surat Nikah",
                                        fileSPTJMKelahiran: "SPTJM Kelahiran",
                                        fileSPTJMPernikahan: "SPTJM Pernikahan",
                                        fileLampiran: "Lampiran (Opsional)",
                                    };
                                    const otherFileEntries = Object.keys(labelMap)
                                        .map(key => {
                                            const url = otherFiles[key as keyof typeof otherFiles];
                                            if (typeof url === 'string' && url) {
                                                return { label: labelMap[key], url };
                                            }
                                            return null;
                                        })
                                        .filter((e): e is { label: string; url: string } => e !== null);

                                    const isExpanded = !!expandedAccordions[akta.id];
                                    const hasOtherFiles = otherFileEntries.length > 0;

                                    return (
                                        <React.Fragment key={akta.id}>
                                            <tr
                                                onClick={() => hasOtherFiles && toggleAccordion(akta.id)}
                                                className={`
                                                transition-colors duration-150
                                                ${isExpanded ? 'bg-indigo-50' : 'bg-white'}
                                                ${hasOtherFiles ? 'cursor-pointer hover:bg-gray-50' : ''}
                                            `}
                                            >
                                                <td className="px-2 py-4 text-medium text-gray-500 text-center">{startIndex + index + 1}</td>
                                                <td className="px-4 py-4 font-medium text-gray-900">{akta.noAkta}</td>
                                                {/* <td className="px-6 py-4 text-medium text-gray-600">{akta.nama}</td> */}
                                                <td className="px-4 py-4 text-center">
                                                    {renderFileCell(akta.fileSuratKelahiran)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">{formatTanggal(akta.createdAt)}</td>
                                                <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button onClick={() => onEdit(akta)} title="Edit Data" className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors cursor-pointer">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => onDelete(akta.id)} title="Hapus Data" className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg>
                                                        </button>
                                                        {hasOtherFiles && (
                                                            <button
                                                                onClick={() => toggleAccordion(akta.id)}
                                                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
                                                                aria-label={isExpanded ? "Tutup detail" : "Buka detail"}
                                                                title={isExpanded ? "Tutup detail" : "Buka detail"}
                                                            >
                                                                <ChevronDown
                                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr className="bg-white">
                                                    <td colSpan={6}>
                                                        <div className="p-4 bg-slate-50/70">
                                                            <h4 className="text-sm font-semibold mb-3 text-slate-800">Lampiran Lainnya:</h4>
                                                            <div className="pl-4 space-y-3 border-l-2 border-indigo-200 max-w-md">
                                                                {otherFileEntries.map((file) => (
                                                                    <div key={file.label} className="flex justify-between items-center pr-1">
                                                                        <span className="text-sm text-gray-700">{file.label}</span>
                                                                        <div>{renderFileCell(file.url)}</div>
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

            {/* Mobile Card View */}
            <div className="md:hidden">
                {isLoading
                    ? renderState('Memuat data...', 6)
                    : userList.length === 0
                        ? renderState('Tidak ada data akta kelahiran.', 6)
                        : (
                            <div className="space-y-4">
                                {userList.map((akta, index) => {
                                    const labelMap: Record<string, string> = {
                                        fileSuratKelahiran: "Surat Kelahiran",
                                        fileKk: "Kartu Keluarga (KK)",
                                        fileSuratNikah: "Surat Nikah",
                                        fileSPTJMKelahiran: "SPTJM Kelahiran",
                                        fileSPTJMPernikahan: "SPTJM Pernikahan",
                                        fileLampiran: "Lampiran (Opsional)",
                                    };

                                    const fileEntries = Object.keys(labelMap)
                                        .map(key => {
                                            const url = akta[key as keyof typeof akta];
                                            if (typeof url === 'string' && url) {
                                                return {
                                                    label: labelMap[key],
                                                    url: url,
                                                };
                                            }
                                            return null;
                                        })
                                        .filter((entry): entry is { label: string; url: string } => entry !== null);

                                    const isExpanded = !!expandedAccordions[akta.id];

                                    return (
                                        <div key={akta.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300">
                                            {/* Card Header (tidak berubah) */}
                                            <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center space-x-3 min-w-0">
                                                        <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                                                            {startIndex + index + 1}
                                                        </div>
                                                        <div className="min-w-0">
                                                            {/* <p className="text-sm font-semibold text-gray-800 truncate">{akta.nama}</p> */}
                                                            <p className="text-xs text-gray-500">{akta.noAkta}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button onClick={() => onEdit(akta)} title="Edit Data" aria-label="Edit Data Akta Kelahiran" className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors cursor-pointer">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => onDelete(akta.id)} title="Hapus Data" aria-label="Hapus Data Akta Kelahiran" className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-4 text-sm space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500">Tanggal Dibuat</span>
                                                    <span className="font-medium text-gray-700">{formatTanggal(akta.createdAt)}</span>
                                                </div>
                                                {fileEntries.length > 0 && (
                                                    <div className="border-t border-gray-200 pt-3">
                                                        <button
                                                            onClick={() => toggleAccordion(akta.id)}
                                                            className="w-full flex justify-between items-center text-left"
                                                            aria-expanded={isExpanded}
                                                        >
                                                            <span className="font-medium text-gray-600">
                                                                Lampiran ({fileEntries.length} file)
                                                            </span>
                                                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                                                            <div className="pl-2 space-y-3 border-l-2 border-blue-200">
                                                                {fileEntries.map((file) => (
                                                                    <div key={file.label} className="flex justify-between items-center pr-1">
                                                                        <span className="text-sm text-gray-700">{file.label}</span>
                                                                        <div>{renderFileCell(file.url)}</div>
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
