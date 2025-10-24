import React, { useState } from 'react';
import { useSuratPerubahanKependudukanData } from '../hooks/useSuratPerubahanKependudukanData';
import type { SuratPerubahanKependudukan, CreateDto, UpdateDto } from '../types/suratPerubahanKependudukan.types';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import SuratPerubahanKependudukanFilter from '../components/surat-perubahan-kependudukan/SuratPerubahanKependudukanFilter';
import SuratPerubahanKependudukanTable from '../components/surat-perubahan-kependudukan/SuratPerubahanKependudukanTable';
import Pagination from '../components/ui/Pagination';
import SuratPerubahanKependudukanFormModal from '../components/surat-perubahan-kependudukan/SuratPerubahanKependudukanFormModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

const SuratPerubahanKependudukanPage: React.FC = () => {
    const {
        suratPerubahanKependudukanList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm,
        handleSort, handlePageChange,
        findOneSuratPerubahanKependudukan, saveSuratPerubahanKependudukan, deleteSuratPerubahanKependudukan
    } = useSuratPerubahanKependudukanData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSuratPerubahanKependudukan, setEditingSuratPerubahanKependudukan] = useState<SuratPerubahanKependudukan | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSuratPerubahanKependudukanId, setSelectedSuratPerubahanKependudukanId] = useState<number | null>(null);

    const handleOpenModal = async (userToEdit: SuratPerubahanKependudukan | null = null) => {
        if (userToEdit) {
            try {
                const response = await findOneSuratPerubahanKependudukan(userToEdit.id);
                setEditingSuratPerubahanKependudukan(response.data);
            } catch (error) {
                console.error("Gagal mengambil detail Surat Perubahan Kependudukan:", error);
                return;
            }
        } else {
            setEditingSuratPerubahanKependudukan(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSuratPerubahanKependudukan(null);
    };

    const handleSave = async (formData: CreateDto | UpdateDto, id: number | null) => {
        try {
            await saveSuratPerubahanKependudukan(formData, id);
            toast.success(`Berhasil ${editingSuratPerubahanKependudukan ? 'memperbarui' : 'menambahkan'} surat perubahan kependudukan`)
            handleCloseModal();
        } catch (error) {
            console.error("Gagal menyimpan data Surat Perubahan Kependudukan:", error);
            toast.error(`Gagal ${editingSuratPerubahanKependudukan ? 'memperbarui' : 'menambahkan'} surat perubahan kependudukan`)
            throw error;
        }
    };

    const handleOpenDeleteModal = (userId: number) => {
        setSelectedSuratPerubahanKependudukanId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSuratPerubahanKependudukanId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSuratPerubahanKependudukanId) return;
        try {
            await deleteSuratPerubahanKependudukan(selectedSuratPerubahanKependudukanId);
            toast.success("Surat Perubahan Kependudukan berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus surat perubahan kependudukan");
        } finally {
            handleCloseDeleteModal();
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <header className="p-4 md:p-6 border-b border-gray-200 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base md:text-xl font-bold text-gray-800">Manajemen Surat Perubahan Kependudukan</h2>
                <Button variant="primary" size="mid" icon="fas fa-plus" onClick={() => setIsModalOpen(true)}
                >Tambah Surat Perubahan Kependudukan</Button>
            </header>

            <SuratPerubahanKependudukanFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="flex-grow overflow-y-auto">
                <SuratPerubahanKependudukanTable
                    userList={suratPerubahanKependudukanList}
                    isLoading={isLoading}
                    onSort={handleSort}
                    queryParams={queryParams}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                />
            </div>

            {paginationMeta && <Pagination currentItemCount={suratPerubahanKependudukanList.length} meta={paginationMeta} onPageChange={handlePageChange} />}

            {isModalOpen &&
                <SuratPerubahanKependudukanFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    editingData={editingSuratPerubahanKependudukan}
                />
            }

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Surat PerubahanKependudukan"
                message="Apakah Anda yakin ingin menghapus surat perubahan kependudukan ini? Tindakan ini tidak dapat dibatalkan."
                confirmButtonText="Ya, Hapus"
                variant="danger"
            />

        </div>
    );
};

export default SuratPerubahanKependudukanPage;