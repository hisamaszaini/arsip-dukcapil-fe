import React from 'react';
import type { Kategori, KategoriSortableKeys } from '../../types/kategori.types';
import { SortableHeader } from '../ui/SortableHeader';
import { formatTanggal } from '../../utils/date';

interface KategoriTableProps {
    data: Kategori[];
    isLoading: boolean;
    onSort: (key: KategoriSortableKeys) => void;
    queryParams: { sortBy?: string; sortOrder?: 'asc' | 'desc' };
    onEdit: (item: Kategori) => void;
    onDelete: (id: number) => void;
}

const KategoriTable: React.FC<KategoriTableProps> = ({
    data,
    isLoading,
    onSort,
    queryParams,
    onEdit,
    onDelete
}) => {
    const startIndex = ((queryParams as any).page || 1) * ((queryParams as any).limit || 10) - ((queryParams as any).limit || 10);

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

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border-y border-gray-200 rounded-lg shadow-md">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            <th className="px-2 py-5 text-center">No.</th>
                            <SortableHeader columnKey="name" onSort={onSort} queryParams={queryParams as any}>
                                Nama Kategori
                            </SortableHeader>
                            <th className="px-4 py-3">Deskripsi</th>
                            <th className="px-4 py-3 text-center">Max File</th>
                            <th className="px-4 py-3">Label No. Form</th>
                            <th className="px-4 py-3">Rules</th>
                            <SortableHeader columnKey="createdAt" onSort={onSort} queryParams={queryParams as any}>
                                Dibuat Pada
                            </SortableHeader>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading
                            ? renderState('Memuat data...', 8)
                            : data.length === 0
                                ? renderState('Belum ada data kategori.', 8)
                                : data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-2 py-5 text-medium text-gray-500 text-center">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-gray-900">{item.name}</td>
                                        <td className="px-4 py-4 text-gray-500 truncate max-w-xs" title={item.description || ''}>
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-4 py-4 text-center">{item.maxFile}</td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                {item.formNo}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                {item.rulesFormNama && (
                                                    <span className="inline-flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                                                        ✓ Nama
                                                    </span>
                                                )}
                                                {item.rulesFormTanggal && (
                                                    <span className="inline-flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                                                        ✓ Tanggal
                                                    </span>
                                                )}
                                                {!item.rulesFormNama && !item.rulesFormTanggal && (
                                                    <span className="text-gray-400 italic">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-gray-500">
                                            {formatTanggal(item.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {isLoading
                    ? renderState('Memuat data...', 1)
                    : data.length === 0
                        ? renderState('Belum ada data kategori.', 1)
                        : (
                            <div className="space-y-4">
                                {data.map((item, index) => (
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
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTanggal(item.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
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
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-2 text-sm">
                                            {item.description && (
                                                <div className="text-gray-600 italic mb-2">
                                                    "{item.description}"
                                                </div>
                                            )}
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500">Max File:</span>
                                                <span className="font-medium text-gray-800">{item.maxFile}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-500">Label No. Form:</span>
                                                <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                                                    {item.formNo}
                                                </span>
                                            </div>
                                            <div className="flex justify-between pt-1">
                                                <span className="text-gray-500">Rules:</span>
                                                <div className="flex flex-col items-end gap-1">
                                                    {item.rulesFormNama && (
                                                        <span className="text-green-600 text-xs font-medium">✓ Nama Wajib</span>
                                                    )}
                                                    {item.rulesFormTanggal && (
                                                        <span className="text-green-600 text-xs font-medium">✓ Tanggal Wajib</span>
                                                    )}
                                                    {!item.rulesFormNama && !item.rulesFormTanggal && (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
            </div>
        </>
    );
};

export default KategoriTable;
