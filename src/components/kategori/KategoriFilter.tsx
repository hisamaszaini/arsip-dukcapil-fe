import React from 'react';

interface KategoriFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const KategoriFilter: React.FC<KategoriFilterProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Cari kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};

export default KategoriFilter;
