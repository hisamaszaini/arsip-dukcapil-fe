import React, { useState } from 'react';
import { useSuratKehilanganData } from '../hooks/useSuratKehilanganData';
import type { SuratKehilangan, CreateDto, UpdateDto } from '../types/suratKehilangan.types';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import SuratKehilanganFilter from '../components/surat-kehilangan/SuratKehilanganFilter';
import SuratKehilanganTable from '../components/surat-kehilangan/SuratKehilanganTable';
import Pagination from '../components/ui/Pagination';
import SuratKehilanganFormModal from '../components/surat-kehilangan/SuratKehilanganFormModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

const SuratKehilanganPage: React.FC = () => {
    const {
        suratKehilanganList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm,
        handleSort, handlePageChange,
        findOneSuratKehilangan, saveSuratKehilangan, deleteSuratKehilangan
    } = useSuratKehilanganData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSuratKehilangan, setEditingSuratKehilangan] = useState<SuratKehilangan | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSuratKehilanganId, setSelectedSuratKehilanganId] = useState<number | null>(null);

    const handleOpenModal = async (userToEdit: SuratKehilangan | null = null) => {
        if (userToEdit) {
            try {
                const response = await findOneSuratKehilangan(userToEdit.id);
                setEditingSuratKehilangan(response.data);
            } catch (error) {
                console.error("Gagal mengambil detail Surat Kehilangan:", error);
                return;
            }
        } else {
            setEditingSuratKehilangan(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSuratKehilangan(null);
    };

    const handleSave = async (formData: CreateDto | UpdateDto, id: number | null) => {
        try {
            await saveSuratKehilangan(formData, id);
            toast.success(`Berhasil ${editingSuratKehilangan ? 'memperbarui' : 'menambahkan'} surat kehilangan`)
            handleCloseModal();
        } catch (error) {
            console.error("Gagal menyimpan data SuratKehilangan:", error);
            toast.error(`Gagal ${editingSuratKehilangan ? 'memperbarui' : 'menambahkan'} surat kehilangan`)
            throw error;
        }
    };

    const handleOpenDeleteModal = (userId: number) => {
        setSelectedSuratKehilanganId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSuratKehilanganId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSuratKehilanganId) return;
        try {
            await deleteSuratKehilangan(selectedSuratKehilanganId);
            toast.success("Surat Kehilangan berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus pengguna");
        } finally {
            handleCloseDeleteModal();
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <header className="p-4 md:p-6 border-b border-gray-200 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base md:text-xl font-bold text-gray-800">Manajemen Surat Kehilangan</h2>
                <Button variant="primary" size="mid" icon="fas fa-plus" onClick={() => setIsModalOpen(true)}
                >Tambah Surat Kehilangan</Button>
            </header>

            <SuratKehilanganFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="flex-grow overflow-y-auto">
                <SuratKehilanganTable
                    userList={suratKehilanganList}
                    isLoading={isLoading}
                    onSort={handleSort}
                    queryParams={queryParams}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                />
            </div>

            {paginationMeta && <Pagination currentItemCount={suratKehilanganList.length} meta={paginationMeta} onPageChange={handlePageChange} />}

            {isModalOpen &&
                <SuratKehilanganFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    editingData={editingSuratKehilangan}
                />
            }

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Surat Kehilangan"
                message="Apakah Anda yakin ingin menghapus surat ini? Tindakan ini tidak dapat dibatalkan."
                confirmButtonText="Ya, Hapus"
                variant="danger"
            />

        </div>
    );
};

export default SuratKehilanganPage;