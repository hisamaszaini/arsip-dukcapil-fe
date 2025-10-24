import React, { useState } from 'react';
import { useSuratPermohonanPindahData } from '../hooks/useSuratPermohonanPindahData';
import type { SuratPermohonanPindah, CreateDto, UpdateDto } from '../types/suratPermohonanPindah.types';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import SuratPermohonanPindahFilter from '../components/surat-permohonan-pindah/SuratPermohonanPindahFilter';
import SuratPermohonanPindahTable from '../components/surat-permohonan-pindah/SuratPermohonanPindahTable';
import Pagination from '../components/ui/Pagination';
import SuratPermohonanPindahFormModal from '../components/surat-permohonan-pindah/SuratPermohonanPindahFormModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

const SuratPermohonanPindahPage: React.FC = () => {
    const {
        suratPermohonanPindahList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm,
        handleSort, handlePageChange,
        findOneSuratPermohonanPindah, saveSuratPermohonanPindah, deleteSuratPermohonanPindah
    } = useSuratPermohonanPindahData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSuratPermohonanPindah, setEditingSuratPermohonanPindah] = useState<SuratPermohonanPindah | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSuratPermohonanPindahId, setSelectedSuratPermohonanPindahId] = useState<number | null>(null);

    const handleOpenModal = async (userToEdit: SuratPermohonanPindah | null = null) => {
        if (userToEdit) {
            try {
                const response = await findOneSuratPermohonanPindah(userToEdit.id);
                setEditingSuratPermohonanPindah(response.data);
            } catch (error) {
                console.error("Gagal mengambil detail Surat Permohonan Pindah:", error);
                return;
            }
        } else {
            setEditingSuratPermohonanPindah(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSuratPermohonanPindah(null);
    };

    const handleSave = async (formData: CreateDto | UpdateDto, id: number | null) => {
        try {
            await saveSuratPermohonanPindah(formData, id);
            toast.success(`Berhasil ${editingSuratPermohonanPindah ? 'memperbarui' : 'menambahkan'} surat permohonan pindah`)
            handleCloseModal();
        } catch (error) {
            console.error("Gagal menyimpan data Surat Permohonan Pindah:", error);
            toast.error(`Gagal ${editingSuratPermohonanPindah ? 'memperbarui' : 'menambahkan'} surat permohonan pindah`)
            throw error;
        }
    };

    const handleOpenDeleteModal = (userId: number) => {
        setSelectedSuratPermohonanPindahId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSuratPermohonanPindahId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSuratPermohonanPindahId) return;
        try {
            await deleteSuratPermohonanPindah(selectedSuratPermohonanPindahId);
            toast.success("Surat Permohonan Pindah berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus surat permohonan pindah");
        } finally {
            handleCloseDeleteModal();
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <header className="p-4 md:p-6 border-b border-gray-200 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base md:text-xl font-bold text-gray-800">Manajemen Surat Permohonan Pindah</h2>
                <Button variant="primary" size="mid" icon="fas fa-plus" onClick={() => setIsModalOpen(true)}
                >Tambah Surat Permohonan Pindah</Button>
            </header>

            <SuratPermohonanPindahFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="flex-grow overflow-y-auto">
                <SuratPermohonanPindahTable
                    userList={suratPermohonanPindahList}
                    isLoading={isLoading}
                    onSort={handleSort}
                    queryParams={queryParams}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                />
            </div>

            {paginationMeta && <Pagination currentItemCount={suratPermohonanPindahList.length} meta={paginationMeta} onPageChange={handlePageChange} />}

            {isModalOpen &&
                <SuratPermohonanPindahFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    editingData={editingSuratPermohonanPindah}
                />
            }

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Surat PermohonanPindah"
                message="Apakah Anda yakin ingin menghapus surat permohonan pindah ini? Tindakan ini tidak dapat dibatalkan."
                confirmButtonText="Ya, Hapus"
                variant="danger"
            />

        </div>
    );
};

export default SuratPermohonanPindahPage;