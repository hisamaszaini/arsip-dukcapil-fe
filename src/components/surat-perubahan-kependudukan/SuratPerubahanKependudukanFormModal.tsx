import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    createSchema,
    updateSchema,
    type CreateDto,
    type UpdateDto,
    type SuratPerubahanKependudukan,
} from "../../types/suratPerubahanKependudukan.types";
import TextInput from "../ui/TextInput";
import { Button } from "../ui/Button";
import MultiImageUpload from "../ui/MultiImageUpload";

interface SuratPerubahanKependudukanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: CreateDto | UpdateDto, id: number | null) => Promise<void>;
    editingData: SuratPerubahanKependudukan | null;
}

const fileFields = [
    "filePerubahan",
    "fileKk",
    "fileLampiran",
];

const SuratPerubahanKependudukanFormModal: React.FC<SuratPerubahanKependudukanFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingData,
}) => {
    const isEditing = !!editingData;
    const schema = isEditing ? updateSchema : createSchema;

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateDto | UpdateDto>({
        resolver: zodResolver(schema),
        defaultValues: {
            nik: "",
            // nama: ""
        },
    });

    const [files, setFiles] = useState<Record<string, File | null>>(
        Object.fromEntries(fileFields.map((f) => [f, null]))
    );

    // Reset form & files saat modal dibuka/ditutup
    useEffect(() => {
        if (isOpen) {
            if (isEditing && editingData) {
                reset({
                    nik: editingData.nik,
                    // nama: editingData.nama
                });
                const initialFiles: Record<string, File | null> = {};
                fileFields.forEach((f) => {
                    initialFiles[f] = null; // file baru null
                    setValue(f as keyof CreateDto, null); // reset RHF
                });
                setFiles(initialFiles);
            } else {
                reset();
                const initialFiles: Record<string, File | null> = {};
                fileFields.forEach((f) => {
                    initialFiles[f] = null;
                    setValue(f as keyof CreateDto, null);
                });
                setFiles(initialFiles);
            }
        }
    }, [isOpen, isEditing, editingData, reset, setValue]);

    const onSubmit = async (data: CreateDto | UpdateDto) => {
        for (const f of fileFields.slice(0, 2)) {
            const hasFile = files[f] || (editingData && (editingData as any)[f]);
            if (!hasFile) {
                setError(f as keyof CreateDto, { type: "custom", message: `${f} wajib diunggah` });
                return;
            }
        }

        try {
            const formData = new FormData();

            // Append text fields
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            // Append file fields
            Object.entries(files).forEach(([key, file]) => {
                if (file) formData.append(key, file);
            });

            await onSave(data, isEditing ? editingData?.id ?? null : null);
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
            }

            if (apiError.success === false && !apiError.errors) {
                toast.error(apiError.message || "Terjadi kesalahan tidak terduga.");
                return;
            }

            toast.error("Terjadi kesalahan tidak diketahui.");
        }
    };


    console.log(errors);

    if (!isOpen) return null;

    return (
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
                        {isEditing ? "Edit Data Surat Perubahan Kependudukan" : "Tambah Surat Perubahan Kependudukan"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-4 font-bold"><span className="text-red-500">*</span> Wajib diisi</p>
                </div>

                {/* Form scrollable */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
                    <TextInput
                        id="nik"
                        label="NIK"
                        placeholder="Masukkan 16 digit NIK..."
                        required={true}
                        error={errors.nik?.message}
                        {...register("nik")}
                    />
{/* 
                    <TextInput
                        id="nama"
                        label="Nama Lengkap"
                        placeholder="Masukkan Nama Lengkap..."
                        required={true}
                        error={errors.nama?.message}
                        className="uppercase"
                        {...register("nama")}
                    /> */}

                    <MultiImageUpload
                        mode={isEditing ? "edit" : "create"}
                        label="Unggah Berkas Pendukung"
                        fileFields={[
                            { key: "filePerubahan", label: "Surat Perubahan Kependudukan" },
                            { key: "fileKk", label: "Kartu Keluarga (KK)" },
                            { key: "fileLampiran", label: "Lampiran (Opsional)" },
                        ]}
                        initialFiles={
                            isEditing && editingData
                                ? {
                                    filePerubahan: editingData.filePerubahan || null,
                                    fileKk: editingData.fileKk || null,
                                    fileLampiran: editingData.fileLampiran || null,
                                }
                                : undefined
                        }
                        onChange={(mapped) => {
                            setFiles(mapped);
                            Object.entries(mapped).forEach(([key, file]) =>
                                setValue(key as keyof CreateDto, file)
                            );
                        }}
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" icon="fas fa-save"
                            disabled={isSubmitting}>
                            {isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuratPerubahanKependudukanFormModal;
