import React from 'react';
import type { User, FindAllUserDto, UserSortableKeys } from '../../types/user.types';
import { SortableHeader } from '../ui/SortableHeader';
import { formatTanggal } from '../../utils/date';
import { FileEdit, Trash2 } from 'lucide-react';

interface UserTableProps {
    userList: User[];
    isLoading: boolean;
    onSort: (sortKey: UserSortableKeys) => void;
    queryParams: Partial<FindAllUserDto>;
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const roleBadge: Record<string, string> = {
    ADMIN: 'bg-green-100 text-green-800',
    OPERATOR: 'bg-yellow-100 text-yellow-800',
};

const UserTable: React.FC<UserTableProps> = ({ userList, isLoading, onSort, queryParams, onEdit, onDelete }) => {
    const renderState = (message: string, colSpan: number) => {
        // For mobile view
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            return <div className="text-center p-8 text-gray-500">{message}</div>;
        }
        // For desktop table view
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
            {/* Desktop Table View (hidden on small screens) */}
            <div className="hidden md:block overflow-x-auto border-y border-gray-200 rounded-lg shadow-md">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            <th scope="col" className="px-2 py-5 text-center">No.</th>
                            <SortableHeader columnKey="name" onSort={onSort} queryParams={queryParams}>Nama</SortableHeader>
                            <SortableHeader columnKey="username" onSort={onSort} queryParams={queryParams}>Username</SortableHeader>
                            <SortableHeader columnKey="role" onSort={onSort} queryParams={queryParams}>Role</SortableHeader>
                            <SortableHeader columnKey="createdAt" onSort={onSort} queryParams={queryParams}>Tanggal Dibuat</SortableHeader>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading
                            ? renderState('Memuat data...', 6)
                            : userList.length === 0
                                ? renderState('Tidak ada data pengguna.', 6)
                                : userList.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="px-2 py-5 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user?.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleBadge[user.role] || 'bg-gray-100 text-gray-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatTanggal(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => onEdit(user)} title="Edit Pengguna" className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors cursor-pointer">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </button>
                                                <button onClick={() => onDelete(user.id)} title="Hapus Pengguna" className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {isLoading
                    ? renderState('Memuat data...', 6)
                    : userList.length === 0
                        ? renderState('Tidak ada data pengguna.', 6)
                        : (
                            <div className="space-y-4">
                                {userList.map((user, index) => (
                                    <div key={user.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                        {/* Card Header */}
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {user?.username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button onClick={() => onEdit(user)} title="Edit Pengguna" className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors">
                                                        <FileEdit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => onDelete(user.id)} title="Hapus Pengguna" className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 space-y-3 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Role</span>
                                                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${roleBadge[user.role] || 'bg-gray-100 text-gray-800'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Tanggal Dibuat</span>
                                                <span className="font-medium text-gray-700">{formatTanggal(user.createdAt)}</span>
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

export default UserTable;