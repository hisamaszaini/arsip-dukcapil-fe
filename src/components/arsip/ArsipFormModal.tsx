import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import TextInput from '../ui/TextInput';
import MultiImageUpload from '../ui/MultiImageUpload';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { createArsipSchema, type CreateArsipDto, type Arsip } from '../../types/arsip.types';
import type { Kategori } from '../../types/kategori.types';
import { toast } from 'sonner';
import arsipService from '../../services/arsipService';
import { handleApiError } from '../../lib/handleApiError';
import { formatInput } from '../../lib/utils';

interface ArsipFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FormData, id: number | null) => Promise<boolean>;
    kategori: Kategori;
    editingData: Arsip | null;
    isViewOnly?: boolean;
}

const ArsipFormModal: React.FC<ArsipFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    kategori,
    editingData,
    isViewOnly = false
}) => {
    const isEditing = !!editingData;
    const [localData, setLocalData] = useState(editingData);

    // Dynamic Schema Creation
    const schema = React.useMemo(() => {
        return createArsipSchema.superRefine((data, ctx) => {
            if (data.no) {
                // 1. Prefix Validation
                if (kategori.noPrefix && !data.no.startsWith(kategori.noPrefix)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `${kategori.formNo} harus diawali dengan prefix: ${kategori.noPrefix}`,
                        path: ['no'],
                    });
                }

                // 2. Length Validation
                if (kategori.noMinLength && data.no.length < kategori.noMinLength) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `${kategori.formNo} minimal ${kategori.noMinLength} karakter`,
                        path: ['no'],
                    });
                }
                if (kategori.noMaxLength && data.no.length > kategori.noMaxLength) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `${kategori.formNo} maksimal ${kategori.noMaxLength} karakter`,
                        path: ['no'],
                    });
                }

                // 3. Type Validation
                if (kategori.noType === 'NUMERIC') {
                    if (!/^[0-9\-\.\/]+$/.test(data.no)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Nomor harus berupa angka`,
                            path: ['no'],
                        });
                    }
                } else if (kategori.noType === 'ALPHANUMERIC') {
                    if (!/^[a-zA-Z0-9\-\.\/]+$/.test(data.no)) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Nomor harus berupa huruf dan angka`,
                            path: ['no'],
                        });
                    }
                }

                // 4. Regex Validation
                if (kategori.noRegex) {
                    try {
                        const regex = new RegExp(kategori.noRegex);
                        if (!regex.test(data.no)) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: `Format ${kategori.formNo} tidak sesuai. ${kategori.noFormat ? `Contoh: ${kategori.noFormat}` : ''}`,
                                path: ['no'],
                            });
                        }
                    } catch (e) {
                        console.error("Invalid regex:", kategori.noRegex);
                    }
                }
            }
        });
    }, [kategori]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<CreateArsipDto>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            idKategori: kategori.id,
            no: kategori.noPrefix || '',
            nama: '',
            tanggal: '',
            noFisik: '',
        }
    });

    // state untuk upload file
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [replacedFiles, setReplacedFiles] = useState<Record<string, number>>({}); // key: slot, value: fileId

    // state untuk delete file
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [fileIdToDelete, setFileIdToDelete] = useState<number | null>(null);

    useEffect(() => {
        setLocalData(editingData);
    }, [editingData, isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (isEditing && localData) {
                reset({
                    idKategori: kategori.id,
                    no: localData.no,
                    nama: localData.nama || '',
                    tanggal: localData.tanggal ? new Date(localData.tanggal).toISOString().split('T')[0] : '',
                    noFisik: localData.noFisik,
                });

                // Buat mapping file awal
                const initial: Record<string, File | null> = {};
                localData.arsipFiles?.forEach((_file, index) => {
                    initial[`file${index + 1}`] = null;
                });
                setFiles(initial);
            } else {
                reset({
                    idKategori: kategori.id,
                    no: kategori.noPrefix || '',
                    nama: '',
                    tanggal: '',
                    noFisik: '',
                });
                setFiles({});
            }
        }
    }, [isOpen, isEditing, localData, kategori.id, kategori.noPrefix, reset]);

    const handleDeleteRequest = (id: number) => {
        setFileIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!fileIdToDelete) return;

        try {
            await arsipService.removeFile(fileIdToDelete);
            toast.success("File berhasil dihapus.");

            setLocalData(prevData => {
                if (!prevData) return null;
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

    const onSubmit = async (data: CreateArsipDto) => {
        const formData = new FormData();
        formData.append('idKategori', String(kategori.id));
        if (data.no) formData.append('no', data.no);
        if (data.nama) formData.append('nama', data.nama);
        if (data.tanggal) formData.append('tanggal', new Date(data.tanggal).toISOString());
        formData.append('noFisik', data.noFisik);

        // fileIds
        const fileIds = Object.values(replacedFiles);
        fileIds.forEach((id) => formData.append("fileIds", String(id)));

        Object.entries(files).forEach(([_key, file]) => {
            if (file) formData.append("files", file);
        });

        const success = await onSave(formData, isEditing ? localData?.id ?? null : null);
        if (success) {
            onClose();
        }
    };

    if (!isOpen) return null;

    // Generate file fields based on kategori.maxFile
    const fileFields = Array.from({ length: kategori.maxFile }, (_, i) => ({
        key: `file${i + 1}`,
        label: `Dokumen ${i + 1}`
    }));

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <div className="py-5 px-6 border-b border-gray-200 flex-shrink-0 bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {isViewOnly ? 'Detail Arsip' : (isEditing ? 'Edit Arsip' : 'Tambah Arsip Baru')} {kategori.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-4 font-bold">
                            <span className="text-red-500">*</span> Wajib diisi
                        </p>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Dynamic Form No Label */}
                            <Controller
                                name="no"
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <TextInput
                                        id="no"
                                        label={kategori.formNo}
                                        placeholder={kategori.noFormat || `Masukkan ${kategori.formNo}`}
                                        required
                                        error={error?.message}
                                        value={value}
                                        onChange={(e) => {
                                            let rawValue = e.target.value;

                                            // 1. Handle Type Restriction
                                            if (kategori.noType === 'NUMERIC') {
                                                rawValue = rawValue.replace(/[^0-9\-\.\/]/g, '');
                                            } else if (kategori.noType === 'ALPHANUMERIC') {
                                                rawValue = rawValue.replace(/[^a-zA-Z0-9\-\.\/]/g, '');
                                            }

                                            // 2. Handle Masking
                                            if (kategori.noMask) {
                                                onChange(formatInput(rawValue, kategori.noMask));
                                            } else {
                                                onChange(rawValue);
                                            }
                                        }}
                                        disabled={isViewOnly}
                                    />
                                )}
                            />

                            {/* Conditional Nama Field */}
                            {kategori.rulesFormNama && (
                                <Controller
                                    name="nama"
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextInput
                                            id="nama"
                                            label="Nama"
                                            placeholder="Masukkan Nama"
                                            required
                                            error={error?.message}
                                            value={value}
                                            onChange={onChange}
                                            disabled={isViewOnly}
                                        />
                                    )}
                                />
                            )}

                            {/* Conditional Tanggal Field */}
                            {kategori.rulesFormTanggal && (
                                <div className="flex flex-col">
                                    <label className="block text-base font-medium text-gray-700 mb-1">
                                        Tanggal <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        {...register('tanggal')}
                                        disabled={isViewOnly}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.tanggal ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${isViewOnly ? 'bg-gray-100 text-gray-500' : ''}`}
                                    />
                                    {errors.tanggal && <p className="mt-1 text-xs text-red-500">{errors.tanggal.message}</p>}
                                </div>
                            )}

                            {/* No Fisik (Always Required) */}
                            <Controller
                                name="noFisik"
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <TextInput
                                        id="noFisik"
                                        label="Nomor Fisik"
                                        placeholder="Masukkan Nomor Fisik / Rak"
                                        required
                                        error={error?.message}
                                        value={value}
                                        onChange={onChange}
                                        disabled={isViewOnly}
                                    />
                                )}
                            />

                            {/* File Upload */}
                            <MultiImageUpload
                                mode={isViewOnly ? "view" : (isEditing ? "edit" : "create")}
                                label={`Unggah Berkas (Maksimal ${kategori.maxFile} file)`}
                                fileFields={fileFields}
                                initialFiles={
                                    (isEditing || isViewOnly) && localData
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
                                disabled={isViewOnly}
                            />

                            {/* Global Validation Error Summary */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Terdapat kesalahan pada form:
                                            </h3>
                                            <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                                                {Object.entries(errors).map(([key, error]) => (
                                                    <li key={key}>
                                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {error?.message as string}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                                    {isViewOnly ? 'Tutup' : 'Batal'}
                                </Button>
                                {!isViewOnly && (
                                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                                        {isEditing ? 'Simpan Perubahan' : 'Simpan Arsip'}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
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

export default ArsipFormModal;
