import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createSchema, updateSchema, type CreateDto, type UpdateDto, type User } from "../../types/user.types";
import TextInput from "../ui/TextInput";
import SelectInput from "../ui/SelectInput";
import { Button } from "../ui/Button";
import { userRoleOptions, userStatusOptions } from "../../constant/userOptions";

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: CreateDto | UpdateDto, id: number | null) => Promise<void>;
    editingUser: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingUser,
}) => {
    const [globalError, setGlobalError] = React.useState<string | null>(null);

    const isEditing = !!editingUser;

    const schema = isEditing ? updateSchema : createSchema;

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateDto | UpdateDto>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            role: "ADMIN",
            statusUser: "ACTIVE",
        },
    });

    // Reset form saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            if (isEditing && editingUser) {
                reset({
                    name: editingUser.name,
                    email: editingUser.email,
                    username: editingUser.username,
                    role: editingUser.role,
                    statusUser: editingUser.statusUser,
                    password: "",
                    confirmPassword: "",
                });
            } else {
                reset();
            }
        }
    }, [isOpen, isEditing, editingUser, reset]);

    const onSubmit = async (data: CreateDto | UpdateDto) => {
        try {
            await onSave(data, isEditing ? editingUser?.id ?? null : null);
            toast.success(isEditing ? "Pengguna berhasil diperbarui!" : "Pengguna berhasil ditambahkan!");
            onClose();
        } catch (err: any) {
            const apiError = err?.response?.data;

            if (!apiError) {
                toast.error("Terjadi kesalahan koneksi server.");
                return;
            }

            Object.entries(apiError.errors as Record<string, string>).forEach(([field, message]) => {
                setError(field as keyof CreateDto, { type: "manual", message });
            });

            if (apiError.success === false && apiError.errors === null) {
                setGlobalError(apiError.message);
                toast.error(apiError.message || "Terjadi kesalahan tidak terduga.");
                return;
            }

            toast.error("Terjadi kesalahan tidak diketahui.");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-y-auto scrollbar-hide-y"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="py-5 px-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-4 font-bold"><span className="text-red-500">*</span> Wajib diisi</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                        <TextInput
                            id="name"
                            label="Nama"
                            placeholder="Masukan Nama..."
                            required={true}
                            error={errors.name?.message}
                            {...register("name")}
                        />
                        <TextInput
                            id="username"
                            label="Username"
                            placeholder="Masukan Username..."
                            required={true}
                            error={errors.username?.message}
                            {...register("username")}
                        />
                        <TextInput
                            id="email"
                            type="email"
                            label="Email"
                            required={true}
                            placeholder="Masukan Email..."
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <SelectInput
                            id="role"
                            label="Role"
                            required={true}
                            error={errors.role?.message}
                            {...register("role")}
                        >
                            <option value="">-- Pilih Role --</option>
                            {userRoleOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </SelectInput>
                        <TextInput
                            id="password"
                            type="password"
                            label="Password"
                            placeholder={isEditing ? "(Kosongkan jika tidak diubah)" : "Masukan Password..."}
                            required={isEditing ? false : true}
                            error={errors.password?.message}
                            {...register("password")}
                        />
                        <TextInput
                            id="confirmPassword"
                            type="password"
                            label="Konfirmasi Password"
                            placeholder="Masukan Konfirmasi Password..."
                            required={isEditing ? false : true}
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />
                        <SelectInput
                            id="statusUser"
                            label="Status User"
                            required={true}
                            error={errors.statusUser?.message}
                            {...register("statusUser")}
                        >
                            <option value="">-- Pilih Status User --</option>
                            {userStatusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </SelectInput>
                    </div>

                    {globalError && (
                        <div
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-md"
                            role="alert"
                        >
                            {globalError}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end mt-6 p-6">
                        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onClose}>
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
    );
};

export default UserFormModal;