import React from 'react';
import type { FindAllUserDto } from '../../types/user.types';
import { userRoleOptions } from '../../constant/userOptions';

interface UserFilterProps {
    filters: Partial<FindAllUserDto>;
    onFilterChange: (name: keyof Partial<FindAllUserDto>, value: string | undefined) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ filters, onFilterChange, searchTerm, setSearchTerm }) => {

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange('role', e.target.value || undefined);
    };

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end gap-4 bg-gray-50/50 border-b border-gray-200">
            {/* Input Pencarian */}
            <div>
                <label htmlFor="search-user" className="block text-sm font-medium text-gray-600 mb-1">
                    Cari Username / Nama
                </label>
                <input
                    id="search-user"
                    type="text"
                    placeholder="Ketik untuk mencari..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1 w-full md:w-80 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {/* Filter Role */}
            <div>
                <label htmlFor="filter-role" className="block text-sm font-medium text-gray-600 mb-1">
                    Filter Role
                </label>
                <select
                    id="filter-role"
                    name="role"
                    value={filters.role || ''}
                    onChange={handleRoleChange}
                    className="mt-1 w-full md:w-64 px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="">Semua Role</option>
                    {userRoleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default UserFilter;