import React, { useState } from 'react';
import { useKategoriData } from '../hooks/useKategoriData';
import type { Kategori } from '../types/kategori.types';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import KategoriFilter from '../components/kategori/KategoriFilter';
import KategoriTable from '../components/kategori/KategoriTable';
import Pagination from '../components/ui/Pagination';
import KategoriFormModal from '../components/kategori/KategoriFormModal';
import { PasswordConfirmationModal } from '../components/ui/PasswordConfirmationModal';
import { handleApiError } from '../lib/handleApiError';

const KategoriPage: React.FC = () => {
    const {
        kategoriList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm,
        handleSort, handlePageChange,
        saveKategori, deleteKategori
    } = useKategoriData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);

    const handleOpenModal = (kategoriToEdit: Kategori | null = null) => {
        setEditingKategori(kategoriToEdit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingKategori(null);
    };

    const handleSave = async (data: any, id: number | null) => {
        try {
            await saveKategori(data, id);
            toast.success(`Berhasil ${editingKategori ? 'memperbarui' : 'menambahkan'} kategori`);
            handleCloseModal();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleOpenDeleteModal = (id: number) => {
        setSelectedKategoriId(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedKategoriId(null);
    };

    const handleConfirmDelete = async (password: string) => {
        if (!selectedKategoriId) return;
        try {
            await deleteKategori(selectedKategoriId, password);
            toast.success("Kategori berhasil dihapus");
            handleCloseDeleteModal();
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <header className="p-4 md:p-6 border-b border-gray-200 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base md:text-xl font-bold text-gray-800">Manajemen Kategori</h2>
                <Button variant="primary" size="mid" icon="fas fa-plus" onClick={() => handleOpenModal(null)}>
                    Tambah Kategori
                </Button>
            </header>

            <KategoriFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="flex-grow overflow-y-auto">
                <KategoriTable
                    data={kategoriList}
                    isLoading={isLoading}
                    onSort={handleSort}
                    queryParams={queryParams}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                />
            </div>

            {paginationMeta && (
                <Pagination
                    currentItemCount={kategoriList.length}
                    meta={paginationMeta}
                    onPageChange={handlePageChange}
                />
            )}

            {isModalOpen && (
                <KategoriFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    editingData={editingKategori}
                />
            )}

            <PasswordConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Kategori"
                message="Masukkan password Anda untuk mengonfirmasi penghapusan kategori ini. Semua arsip dan file terkait akan ikut terhapus permanen."
                confirmButtonText="Hapus Permanen"
                variant="danger"
            />
        </div>
    );
};

export default KategoriPage;
