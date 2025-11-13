import React from 'react';

interface UserFilterProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const AktaKelahiranFilter: React.FC<UserFilterProps> = ({ searchTerm, setSearchTerm }) => {

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end gap-4 bg-gray-50/50 border-b border-gray-200">
            {/* Input Pencarian */}
            <div>
                <label htmlFor="search-user" className="block text-sm font-medium text-gray-600 mb-1">
                    Cari menggunakan Nomor Akta
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
        </div>
    );
};

export default AktaKelahiranFilter;