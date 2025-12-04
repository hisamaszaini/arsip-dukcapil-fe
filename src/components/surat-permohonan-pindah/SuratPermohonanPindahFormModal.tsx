import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createSchema,
    updateSchema,
    type CreateDto,
    type UpdateDto,
    type SuratPermohonanPindah,
} from "../../types/suratPermohonanPindah.types";
import TextInput from "../ui/TextInput";
import { Button } from "../ui/Button";
import MultiImageUpload from "../ui/MultiImageUpload";
import suratPermohonanPindahService from "../../services/suratPermohonanPindahService";
import { toast } from "sonner";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import { handleApiError } from "../../lib/handleApiError";

interface SuratPermohonanPindahFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: FormData, id: number | null) => Promise<void>;
    editingData: SuratPermohonanPindah | null;
}

const SuratPermohonanPindahFormModal: React.FC<SuratPermohonanPindahFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingData,
}) => {
    const isEditing = !!editingData;
    const [localData, setLocalData] = useState(editingData);
    const schema = isEditing ? updateSchema : createSchema;

    type FormValues = CreateDto & Partial<UpdateDto>; // Hybrid type

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema as any),
    });

    // state untuk upload file
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [replacedFiles, setReplacedFiles] = useState<Record<string, number>>({}); // key: slot, value: fileId

    // state untuk delete file
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [fileIdToDelete, setFileIdToDelete] = useState<number | null>(null);

    // Reset form saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            if (isEditing && editingData) {
                reset({
                    nik: editingData.nik,
                    noFisik: editingData.noFisik,
                });

                // Buat mapping file awal
                const initial: Record<string, File | null> = {};
                editingData.arsipFiles?.forEach((_file, index) => {
                    initial[`file${index + 1}`] = null;
                });
                setFiles(initial);
            } else {
                reset();
                setFiles({});
            }
        }
    }, [isOpen, isEditing, editingData, reset]);

    const handleDeleteRequest = (id: number) => {
        setFileIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Dipanggil oleh ConfirmationModal saat tombol 'Konfirmasi' diklik
    const handleConfirmDelete = async () => {
        if (!fileIdToDelete) return;

        try {
            // Panggil service yang Anda buat
            await suratPermohonanPindahService.removeFile(fileIdToDelete);
            toast.success("File berhasil dihapus.");

            setLocalData(prevData => {
                if (!prevData) return null; // Safety check
                return {
                    ...prevData,
                    arsipFiles: prevData.arsipFiles?.filter(
                        file => file.id !== fileIdToDelete
                    )
                };
            });
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsDeleteModalOpen(false);
            setFileIdToDelete(null);
        }
    };

    useEffect(() => {
        setLocalData(editingData);
    }, [editingData, isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (isEditing && localData) {
                reset({
                    nik: localData.nik,
                    noFisik: localData.noFisik,
                });
            } else {
                reset();
                setFiles({});
            }
        }
    }, [isOpen, isEditing, localData, reset]);

    // handle submit
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "")
                    formData.append(key, String(value));
            });

            // fileIds
            const fileIds = Object.values(replacedFiles);
            fileIds.forEach((id) => formData.append("fileIds", String(id)));

            Object.entries(files).forEach(([_key, file]) => {
                if (file) formData.append("files", file);
            });

            await onSave(formData, isEditing ? localData?.id ?? null : null);
            onClose();
        } catch (err: any) {
            const apiError = err?.response?.data;
            if (!apiError) {
                toast.error("Terjadi kesalahan koneksi server.");
                return;
            }

            if (apiError.errors) {
                Object.entries(apiError.errors as Record<string, string>).forEach(([field, message]) => {
                    setError(field as keyof CreateDto, { type: "manual", message });
                });
                toast.error(apiError.message || "Validasi gagal, periksa kembali form anda.");
                return;
            }

            if (apiError.success === false) {
                toast.error(apiError.message || "Terjadi kesalahan tidak terduga.");
                return;
            }

            toast.error("Terjadi kesalahan tidak diketahui.");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="py-5 px-6 border-b border-gray-200 flex-shrink-0">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {isEditing ? "Edit Data Surat Permohonan Pindah" : "Tambah Surat Permohonan Pindah"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-4 font-bold">
                            <span className="text-red-500">*</span> Wajib diisi
                        </p>
                    </div>

                    {/* Form scrollable */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
                        <TextInput
                            id="nik"
                            label="Nomor Induk Penduduk"
                            placeholder="Masukkan NIK..."
                            error={errors.nik?.message}
                            {...register("nik")}
                        />

                        <TextInput
                            id="noFisik"
                            label="Nomor Fisik"
                            placeholder="Masukkan nomor fisik..."
                            error={errors.noFisik?.message}
                            {...register("noFisik")}
                        />

                        <MultiImageUpload
                            mode={isEditing ? "edit" : "create"}
                            label="Unggah Berkas Pendukung"
                            fileFields={[
                                { key: "file1", label: "Dokumen 1" },
                                { key: "file2", label: "Dokumen 2" },
                                { key: "file3", label: "Dokumen 3" },
                                { key: "file4", label: "Dokumen 4" },
                                { key: "file5", label: "Dokumen 5" },
                                { key: "file6", label: "Dokumen 6" },
                                { key: "file7", label: "Dokumen 7" },
                                { key: "file8", label: "Dokumen 8" },
                                { key: "file9", label: "Dokumen 9" },
                                { key: "file10", label: "Dokumen 10" },
                            ]}
                            initialFiles={
                                isEditing && localData
                                    ? Object.fromEntries(
                                        localData.arsipFiles?.map((file, i) => [
                                            `file${i + 1}`,
                                            { url: file.path, id: file.id },
                                        ]) ?? []
                                    )
                                    : undefined
                            }
                            errors={errors}
                            onChange={(mapped, replaced) => {
                                setFiles(mapped);
                                setReplacedFiles(replaced ?? {});
                            }}
                            onDeleteRequest={handleDeleteRequest}
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isSubmitting}
                                onClick={onClose}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                icon="fas fa-save"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Konfirmasi Hapus File"
                message="Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak dapat dibatalkan."
            />
        </>
    );
};

export default SuratPermohonanPindahFormModal;