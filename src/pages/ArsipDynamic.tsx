import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import ArsipFilter from '../components/arsip/ArsipFilter';
import ArsipTable from '../components/arsip/ArsipTable';
import ArsipFormModal from '../components/arsip/ArsipFormModal';
import { useArsipData } from '../hooks/useArsipData';
import kategoriService from '../services/kategoriService';
import type { Kategori } from '../types/kategori.types';
import type { Arsip } from '../types/arsip.types';
import { handleApiError } from '../lib/handleApiError';
import { useAuth } from '../contexts/AuthContext';

const ArsipDynamicPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [kategori, setKategori] = useState<Kategori | null>(null);
    const [isKategoriLoading, setIsKategoriLoading] = useState(true);

    const {
        arsipList,
        isLoading: isArsipLoading,
        paginationMeta,
        queryParams,
        searchTerm,
        setSearchTerm,
        handleSort,
        handlePageChange,
        saveArsip,
        deleteArsip
    } = useArsipData(kategori?.id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArsip, setEditingArsip] = useState<Arsip | null>(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedArsipId, setSelectedArsipId] = useState<number | null>(null);

    const { user } = useAuth();
    const prefixRoles = user?.role.toLowerCase();

    useEffect(() => {
        const fetchKategori = async () => {
            if (!slug) return;
            setIsKategoriLoading(true);
            try {
                const response = await kategoriService.findBySlug(slug);
                if (response.success && response.data) {
                    setKategori(response.data);
                }
            } catch (error) {
                handleApiError(error);
                navigate(`/${prefixRoles}/dashboard`);
            } finally {
                setIsKategoriLoading(false);
            }
        };

        fetchKategori();
    }, [slug, navigate]);

    const handleOpenModal = (arsipToEdit: Arsip | null = null) => {
        setEditingArsip(arsipToEdit);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleView = (arsip: Arsip) => {
        setEditingArsip(arsip);
        setIsViewOnly(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalOpen(false);
        setEditingArsip(null);
        setIsViewOnly(false);
    };

    const handleSave = async (data: FormData, id: number | null) => {
        try {
            await saveArsip(data, id);
            toast.success(`Berhasil ${editingArsip ? 'memperbarui' : 'menambahkan'} arsip`);
            return true;
        } catch (error) {
            handleApiError(error);
            return false;
        }
    };

    const handleOpenDeleteModal = (id: number) => {
        setSelectedArsipId(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedArsipId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedArsipId) return;
        try {
            await deleteArsip(selectedArsipId);
            toast.success("Arsip berhasil dihapus");
        } catch (error) {
            handleApiError(error);
        } finally {
            handleCloseDeleteModal();
        }
    };

    if (isKategoriLoading) {
        return <div className="p-8 text-center text-gray-500">Memuat kategori...</div>;
    }

    if (!kategori) {
        return <div className="p-8 text-center text-red-500">Kategori tidak ditemukan.</div>;
    }

    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden h-full">
            <header className="p-4 md:p-6 border-b border-gray-200 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between bg-gray-50">
                <div>
                    <h2 className="text-base md:text-xl font-bold text-gray-800">Manajemen {kategori.name}</h2>
                    <p className="text-sm text-gray-500">{kategori.description}</p>
                </div>
                <Button variant="primary" size="mid" icon="fas fa-plus" onClick={() => handleOpenModal(null)}>
                    Tambah Arsip
                </Button>
            </header>

            <ArsipFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                kategori={kategori}
            />

            <div className="flex-grow overflow-y-auto">
                <ArsipTable
                    data={arsipList}
                    isLoading={isArsipLoading}
                    onSort={handleSort}
                    queryParams={queryParams}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                    onView={handleView}
                    kategori={kategori}
                />
            </div>

            {paginationMeta && (
                <Pagination
                    currentItemCount={arsipList.length}
                    meta={paginationMeta}
                    onPageChange={handlePageChange}
                />
            )}

            {isModalOpen && (
                <ArsipFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    kategori={kategori}
                    editingData={editingArsip}
                    isViewOnly={isViewOnly}
                />
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Arsip"
                message="Apakah Anda yakin ingin menghapus arsip ini? Tindakan ini tidak dapat dibatalkan."
                confirmButtonText="Ya, Hapus"
                variant="danger"
            />
        </div>
    );
};

export default ArsipDynamicPage;
