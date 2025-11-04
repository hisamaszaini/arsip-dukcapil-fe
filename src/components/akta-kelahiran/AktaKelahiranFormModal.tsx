import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createSchema,
  updateSchema,
  type CreateDto,
  type UpdateDto,
  type AktaKelahiran,
} from "../../types/aktaKelahiran.types";
import TextInput from "../ui/TextInput";
import { Button } from "../ui/Button";
import MultiImageUpload from "../ui/MultiImageUpload";

const formatAktaNumber = (value: string) => {
  const prefix = "3520-LU-";
  if (!value) return prefix;

  if (!value.startsWith(prefix)) {
    return prefix;
  }
  const userInput = value.substring(prefix.length).replace(/\D/g, "");

  let formatted = prefix;
  const datePart = userInput.substring(0, 8);
  formatted += datePart;

  if (userInput.length > 8) {
    const sequencePart = userInput.substring(8, 12);
    formatted += "-" + sequencePart;
  }
  return formatted.substring(0, 22);
};

interface AktaKelahiranFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateDto | UpdateDto, id: number | null) => Promise<void>;
  editingData: AktaKelahiran | null;
}

const fileFields = [
  "fileSuratKelahiran",
  "fileKk",
  "fileSuratNikah",
  "fileSPTJMKelahiran",
  "fileSPTJMPernikahan",
  "fileLampiran",
];

const AktaKelahiranFormModal: React.FC<AktaKelahiranFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingData,
}) => {
  const isEditing = !!editingData;
  const schema = isEditing ? updateSchema : createSchema;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateDto | UpdateDto>({
    resolver: zodResolver(schema),
    defaultValues: { noAkta: "3520-LU-", nama: "" },
  });

  const [files, setFiles] = useState<Record<string, File | null>>(
    Object.fromEntries(fileFields.map((f) => [f, null]))
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        noAkta: editingData?.noAkta || "3520-LU-",
        nama: editingData?.nama || "",
      });

      const initialFiles: Record<string, File | null> = {};
      fileFields.forEach((f) => {
        initialFiles[f] = null;
        setValue(f as keyof CreateDto, null);
      });
      setFiles(initialFiles);
    }
  }, [isOpen, editingData, reset, setValue]);

  const onSubmit = async (data: CreateDto | UpdateDto) => {
    for (const f of fileFields.slice(0, 5)) {
      const hasFile = files[f] || (editingData && (editingData as any)[f]);
      if (!hasFile) {
        setError(f as keyof CreateDto, {
          type: "custom",
          message: `${f} wajib diunggah`,
        });
        return;
      }
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

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
        Object.entries(apiError.errors as Record<string, string>).forEach(
          ([field, message]) => {
            setError(field as keyof CreateDto, {
              type: "manual",
              message,
            });
          }
        );
      }
      toast.error(apiError.message || "Terjadi kesalahan tidak diketahui.");
    }
  };

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
        <div className="py-5 px-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isEditing ? "Edit Data Akta Kelahiran" : "Tambah Akta Kelahiran"}
          </h3>
          <p className="text-sm text-gray-600 mt-4 font-bold">
            <span className="text-red-500">*</span> Wajib diisi
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <Controller
            name="noAkta"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                id="noAkta"
                label="No. Akta"
                placeholder="3520-LU-DDMMYYYY-XXXX"
                required
                error={error?.message}
                value={value}
                onChange={(e) => onChange(formatAktaNumber(e.target.value))}
              />
            )}
          />

          <TextInput
            id="nama"
            label="Nama Lengkap"
            placeholder="Masukkan Nama Lengkap..."
            required
            error={errors.nama?.message}
            className="uppercase"
            {...register("nama")}
          />

          <MultiImageUpload
            mode={isEditing ? "edit" : "create"}
            label="Unggah Berkas Pendukung"
            fileFields={[
              { key: "fileSuratKelahiran", label: "Surat Kelahiran" },
              { key: "fileKk", label: "Kartu Keluarga (KK)" },
              { key: "fileSuratNikah", label: "Surat Nikah" },
              { key: "fileSPTJMKelahiran", label: "SPTJM Kelahiran" },
              { key: "fileSPTJMPernikahan", label: "SPTJM Pernikahan" },
              { key: "fileLampiran", label: "Lampiran (Opsional)" },
            ]}
            initialFiles={
              isEditing && editingData
                ? {
                  fileSuratKelahiran: editingData.fileSuratKelahiran || null,
                  fileKk: editingData.fileKk || null,
                  fileSuratNikah: editingData.fileSuratNikah || null,
                  fileSPTJMKelahiran: editingData.fileSPTJMKelahiran || null,
                  fileSPTJMPernikahan: editingData.fileSPTJMPernikahan || null,
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
              {isSubmitting
                ? "Menyimpan..."
                : isEditing
                  ? "Perbarui"
                  : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AktaKelahiranFormModal;
