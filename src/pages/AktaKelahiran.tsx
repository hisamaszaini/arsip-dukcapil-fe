import React, { useState } from 'react';
import { useAktaKelahiranData } from '../hooks/useAktaKelahiranData';
import type { AktaKelahiran, CreateDto, UpdateDto } from '../types/aktaKelahiran.types';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import AktaKelahiranFilter from '../components/akta-kelahiran/AktaKelahiranFilter';
import AktaKelahiranTable from '../components/akta-kelahiran/AktaKelahiranTable';
import Pagination from '../components/ui/Pagination';
import AktaKelahiranFormModal from '../components/akta-kelahiran/AktaKelahiranFormModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';

const AktaKelahiranPage: React.FC = () => {
    const {
        aktaKelahiranList, isLoading, paginationMeta, queryParams,
        searchTerm, setSearchTerm,
        handleSort, handlePageChange,
        findOneAktaKelahiran, saveAktaKelahiran, deleteAktaKelahiran
    } = useAktaKelahiranData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAktaKelahiran, setEditingAktaKelahiran] = useState<AktaKelahiran | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAktaKelahiranId, setSelectedAktaKelahiranId] = useState<number | null>(null);

    const handleOpenModal = async (userToEdit: AktaKelahiran | null = null) => {
        if (userToEdit) {
            try {
                const response = await findOneAktaKelahiran(userToEdit.id);
                setEditingAktaKelahiran(response.data);
            } catch (error) {
                console.error("Gagal mengambil detail AktaKelahiran:", error);
                return;
            }
        } else {
            setEditingAktaKelahiran(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAktaKelahiran(null);
    };

    const handleSave = async (formData: CreateDto | UpdateDto, id: number | null) => {
        try {
            await saveAktaKelahiran(formData, id);
            toast.success(`Berhasil ${editingAktaKelahiran ? 'memperbarui' : 'menambahkan'} akta kelahiran`)
            handleCloseModal();
        } catch (error) {
            console.error("Gagal menyimpan data AktaKelahiran:", error);
            toast.error(`Gagal ${editingAktaKelahiran ? 'memperbarui' : 'menambahkan'} akta kelahiran`)
            throw error;
        }
    };

    const handleOpenDeleteModal = (userId: number) => {
        setSelectedAktaKelahiranId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedAktaKelahiranId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedAktaKelahiranId) return;
        try {
            await deleteAktaKelahiran(selectedAktaKelahiranId);
            toast.success("Akta Kelahiran berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus pengguna");
        } finally {
            handleCloseDeleteModal();
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <header className="p-4 md:p-6 border-b border-gray-200 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base md:text-xl font-bold text-gray-800">Manajemen Akta Kelahiran</h2>
                <Button variant="primary" size="mid" icon="fas fa-plus" onClick={() => setIsModalOpen(true)}
                >Tambah Akta Kelahiran</Button>
            </header>

            <AktaKelahiranFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="flex-grow overflow-y-auto">
                <AktaKelahiranTable
                    userList={aktaKelahiranList}
                    isLoading={isLoading}
                    onSort={handleSort}
                    queryParams={queryParams}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                />
            </div>

            {paginationMeta && <Pagination currentItemCount={aktaKelahiranList.length} meta={paginationMeta} onPageChange={handlePageChange} />}

            {isModalOpen &&
                <AktaKelahiranFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    editingData={editingAktaKelahiran}
                />
            }

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Akta Kelahiran"
                message="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
                confirmButtonText="Ya, Hapus"
                variant="danger"
            />

        </div>
    );
};

export default AktaKelahiranPage;