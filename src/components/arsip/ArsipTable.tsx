import React, { useState } from 'react';
import { SortableHeader } from '../ui/SortableHeader';
import { formatTanggal } from '../../utils/date';
import { ChevronDown } from 'lucide-react';
import type { Arsip, FindAllArsipDto, ArsipSortableKeys } from '../../types/arsip.types';
import type { Kategori } from '../../types/kategori.types';
import { useAuth } from '../../contexts/AuthContext';

interface ArsipTableProps {
    data: Arsip[];
    isLoading: boolean;
    onSort: (key: ArsipSortableKeys) => void;
    queryParams: Partial<FindAllArsipDto>;
    onEdit: (arsip: Arsip) => void;
    onDelete: (id: number) => void;
    onView: (arsip: Arsip) => void;
    kategori: Kategori;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ArsipTable: React.FC<ArsipTableProps> = ({
    data,
    isLoading,
    onSort,
    queryParams,
    onEdit,
    onDelete,
    onView,
    kategori
}) => {
    const { user } = useAuth();
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

    const renderFileLink = (file: { id: number; path: string; originalName: string }) => {
        const savedFileName = file.path.split(/[/\\]/).pop();
        return (
            <a
                href={`${API_URL}/arsip/file/${file.id}/content/${savedFileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                title={file.originalName || 'Lihat File'}
            >
                <i className="fas fa-file-image mr-1 sm:mr-1.5"></i> JPG
            </a>
        );
    };

    // Calculate dynamic colspan based on visible columns
    const getColSpan = () => {
        let span = 4; // No, No Fisik, Lampiran, Aksi
        if (kategori.rulesFormNama) span++;
        if (kategori.rulesFormTanggal) span++;
        // The first column "No" is actually the index, but we also have the dynamic "No" (e.g. NIK) column
        // Wait, let's check the columns below.
        // 1. No (Index)
        // 2. {kategori.formNo} (Dynamic Label) -> This corresponds to 'no' field
        // 3. Nama (Optional)
        // 4. Tanggal (Optional)
        // 5. No. Fisik
        // 6. Lampiran
        // 7. Aksi
        // So base is 5 (Index, FormNo, NoFisik, Lampiran, Aksi)
        let total = 5;
        if (kategori.rulesFormNama) total++;
        if (kategori.rulesFormTanggal) total++;
        return total;
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border-y border-gray-200 rounded-lg">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            <th className="px-2 py-5 text-center">No.</th>
                            <SortableHeader columnKey="no" onSort={onSort} queryParams={queryParams}>
                                {kategori.formNo}
                            </SortableHeader>
                            {kategori.rulesFormNama && (
                                <SortableHeader columnKey="nama" onSort={onSort} queryParams={queryParams}>
                                    Nama
                                </SortableHeader>
                            )}
                            {kategori.rulesFormTanggal && (
                                <SortableHeader columnKey="createdAt" onSort={onSort} queryParams={queryParams}>
                                    Tanggal
                                </SortableHeader>
                            )}
                            <SortableHeader columnKey="noFisik" onSort={onSort} queryParams={queryParams}>
                                No. Fisik
                            </SortableHeader>
                            <th className="px-6 py-3 text-center">Lampiran</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading
                            ? renderState('Memuat data...', getColSpan())
                            : data.length === 0
                                ? renderState('Belum ada data arsip.', getColSpan())
                                : data.map((item, index) => {
                                    const files = item.arsipFiles || [];
                                    const isExpanded = !!expandedAccordions[item.id];
                                    const hasFiles = files.length > 0;

                                    return (
                                        <React.Fragment key={item.id}>
                                            <tr
                                                onClick={() => hasFiles && toggleAccordion(item.id)}
                                                className={`transition-colors duration-150 ${isExpanded ? 'bg-indigo-50' : 'bg-white'
                                                    } ${hasFiles ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                            >
                                                <td className="px-2 py-4 text-medium text-gray-500 text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-4 py-4 font-medium text-gray-900">{item.no}</td>
                                                {kategori.rulesFormNama && (
                                                    <td className="px-4 py-4 text-gray-700">{item.nama || '-'}</td>
                                                )}
                                                {kategori.rulesFormTanggal && (
                                                    <td className="px-4 py-4 text-gray-700">
                                                        {item.tanggal ? formatTanggal(item.tanggal) : '-'}
                                                    </td>
                                                )}
                                                <td className="px-4 py-4 text-gray-700">{item.noFisik}</td>
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
                                                            onClick={() => onView(item)}
                                                            title="Lihat Detail"
                                                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        {(user?.role === 'ADMIN' || (user?.role === 'OPERATOR' && item.createdById === user.id)) && (
                                                            <>
                                                                <button
                                                                    onClick={() => onEdit(item)}
                                                                    title="Edit Data"
                                                                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors cursor-pointer"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => onDelete(item.id)}
                                                                    title="Hapus Data"
                                                                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                        {hasFiles && (
                                                            <button
                                                                onClick={() => toggleAccordion(item.id)}
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
                                                    <td colSpan={getColSpan()}>
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
                                                                        {renderFileLink(file)}
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
                    ? renderState('Memuat data...', 1)
                    : data.length === 0
                        ? renderState('Belum ada data arsip.', 1)
                        : (
                            <div className="space-y-4">
                                {data.map((item, index) => {
                                    const files = item.arsipFiles || [];
                                    const isExpanded = !!expandedAccordions[item.id];

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300"
                                        >
                                            <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                <div>
                                                    <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                                                        {startIndex + index + 1}
                                                    </div>
                                                    <p className="font-semibold text-gray-800 text-sm mt-1">
                                                        {item.no}
                                                    </p>
                                                    {kategori.rulesFormTanggal && item.tanggal && (
                                                        <p className="text-xs text-gray-500">
                                                            {formatTanggal(item.tanggal)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => onView(item)}
                                                        title="Lihat Detail"
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    {(user?.role === 'ADMIN' || (user?.role === 'OPERATOR' && item.createdById === user.id)) && (
                                                        <>
                                                            <button
                                                                onClick={() => onEdit(item)}
                                                                title="Edit"
                                                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => onDelete(item.id)}
                                                                title="Hapus"
                                                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">{kategori.formNo}:</span>
                                                    <span className="font-medium text-gray-800">{item.no}</span>
                                                </div>
                                                {kategori.rulesFormNama && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Nama:</span>
                                                        <span className="font-medium text-gray-800">{item.nama || '-'}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">No Fisik:</span>
                                                    <span className="font-medium text-gray-800">{item.noFisik}</span>
                                                </div>

                                                {files.length > 0 && (
                                                    <div className="border-t border-gray-200 pt-3">
                                                        <button
                                                            onClick={() => toggleAccordion(item.id)}
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
                                                                        {renderFileLink(file)}
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

export default ArsipTable;
