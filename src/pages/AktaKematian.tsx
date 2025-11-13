import React, { useState } from 'react';
import { useAktaKematianData } from '../hooks/useAktaKematianData';
import type { AktaKematian } from '../types/aktaKematian.types';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import AktaKematianFilter from '../components/akta-kematian/AktaKematianFilter';
import AktaKematianTable from '../components/akta-kematian/AktaKematianTable';
import Pagination from '../components/ui/Pagination';
import AktaKematianFormModal from '../components/akta-kematian/AktaKematianFormModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { handleApiError } from '../lib/handleApiError';

const AktaKematianPage: React.FC = () => {
    const {
        aktaKematianList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm,
        handleSort, handlePageChange,
        findOneAktaKematian, saveAktaKematian, deleteAktaKematian
    } = useAktaKematianData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAktaKematian, setEditingAktaKematian] = useState<AktaKematian | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAktaKematianId, setSelectedAktaKematianId] = useState<number | null>(null);

    const handleOpenModal = async (userToEdit: AktaKematian | null = null) => {
        if (userToEdit) {
            try {
                const response = await findOneAktaKematian(userToEdit.id);
                setEditingAktaKematian(response.data);
            } catch (error) {
                console.error("Gagal mengambil detail AktaKematian:", error);
                return;
            }
        } else {
            setEditingAktaKematian(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAktaKematian(null);
    };

    const handleSave = async (formData: FormData, id: number | null) => {
        try {
            await saveAktaKematian(formData, id);
            toast.success(`Berhasil ${editingAktaKematian ? 'memperbarui' : 'menambahkan'} akta kematian`);
            handleCloseModal();
        } catch (error) {
            handleApiError(error);
        }
    };


    const handleOpenDeleteModal = (userId: number) => {
        setSelectedAktaKematianId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedAktaKematianId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedAktaKematianId) return;
        try {
            await deleteAktaKematian(selectedAktaKematianId);
            toast.success("Akta Kematian berhasil dihapus");
        } catch (error) {
            toast.error("Akta Kematian gagal dihapus");
        } finally {
            handleCloseDeleteModal();
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <header className="p-4 md:p-6 border-b border-gray-200 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base md:text-xl font-bold text-gray-800">Manajemen Akta Kematian</h2>
                <Button variant="primary" size="mid" icon="fas fa-plus" onClick={() => setIsModalOpen(true)}
                >Tambah Akta Kematian</Button>
            </header>

            <AktaKematianFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="flex-grow overflow-y-auto">
                <AktaKematianTable
                    userList={aktaKematianList}
                    isLoading={isLoading}
                    onSort={handleSort}
                    queryParams={queryParams}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                />
            </div>

            {paginationMeta && <Pagination currentItemCount={aktaKematianList.length} meta={paginationMeta} onPageChange={handlePageChange} />}

            {isModalOpen &&
                <AktaKematianFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    editingData={editingAktaKematian}
                />
            }

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Akta Kematian"
                message="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
                confirmButtonText="Ya, Hapus"
                variant="danger"
            />

        </div>
    );
};

export default AktaKematianPage;