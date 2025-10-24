import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    createSchema,
    updateSchema,
    type CreateDto,
    type UpdateDto,
    type SuratKehilangan,
} from "../../types/suratKehilangan.types";
import TextInput from "../ui/TextInput";
import { Button } from "../ui/Button";
import { ImageUpload } from "../ui/ImageUpload";

interface SuratKehilanganFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: CreateDto | UpdateDto, id: number | null) => Promise<void>;
    editingData: SuratKehilangan | null;
}

const fileFields = [
    "file",
];

const SuratKehilanganFormModal: React.FC<SuratKehilanganFormModalProps> = ({
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
        defaultValues: { nik: "", nama: "" },
    });

    const [files, setFiles] = useState<Record<string, File | null>>(
        Object.fromEntries(fileFields.map((f) => [f, null]))
    );

    // Reset form & files saat modal dibuka/ditutup
    useEffect(() => {
        if (isOpen) {
            if (isEditing && editingData) {
                reset({ nik: editingData.nik, nama: editingData.nama });
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
        // Pastikan semua file wajib sudah ada
        for (const f of fileFields.slice(0, 5)) {
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
            // toast.success(isEditing ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!");
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
                        {isEditing ? "Edit Data Surat Kehilangan" : "Tambah Surat Kehilangan"}
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

                    <TextInput
                        id="nama"
                        label="Nama Lengkap"
                        placeholder="Masukkan Nama Lengkap..."
                        required={true}
                        error={errors.nama?.message}
                        className="uppercase"
                        {...register("nama")}
                    />

                    {/* Upload Files */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {fileFields.map((key) => {
                            const labelMap: Record<string, string> = {
                                file: "Surat Kehilangan",
                            };
                            const label = labelMap[key] || key;

                            return (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <ImageUpload
                                        file={files[key]}
                                        filePath={
                                            (editingData as any)?.[key]
                                                ? (editingData as any)[key]
                                                : undefined
                                        }
                                        onChange={(file) => {
                                            setFiles((prev) => ({ ...prev, [key]: file }));
                                            setValue(key as keyof CreateDto, file);
                                        }}
                                    />
                                    {errors[key as keyof CreateDto] && (
                                        <p className="text-red-600 text-sm mt-1">{errors[key as keyof CreateDto]?.message}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

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

export default SuratKehilanganFormModal;
