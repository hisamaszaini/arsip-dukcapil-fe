import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { updateSchema, type UpdateDto } from '../types/user.types';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import TextInput from '../components/ui/TextInput';

const Icon = ({ className }: { className: string }) => <i className={`${className} text-indigo-500`}></i>;

export default function ProfilePage() {
    const { user, setUser, isLoading: isUserLoading } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateDto>({
        resolver: zodResolver(updateSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user?.name || '',
                email: user?.email || '',
                username: user?.username || '',
            });
        }
    }, [user, reset]);

    const { mutate: updateUser, isPending } = useUpdateProfile(setUser);

    const onSubmit: SubmitHandler<UpdateDto> = (data) => {
        updateUser(data);
    };

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Icon className="fas fa-spinner animate-spin text-4xl" />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar Pengguna */}
                            <div className="relative mb-4">
                                <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                                    {(user?.name || user?.username)?.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute bottom-1 right-1 block h-5 w-5 rounded-full bg-green-400 border-2 border-white"></span>
                            </div>

                            {/* Nama dan Role */}
                            <h2 className="text-2xl font-bold text-gray-800 capitalize">{user?.name || user?.username}</h2>
                            <p className="font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full text-sm mt-1">
                                {user?.role}
                            </p>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        {/* Detail Informasi Statis */}
                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-center space-x-3">
                                <Icon className="fas fa-user w-5 text-center" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Username</p>
                                    <p className="font-mono">{user?.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Icon className="fas fa-envelope w-5 text-center" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: FORMULIR PEMBARUAN */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Pengaturan Akun</h3>

                            {/* Pengelompokan field */}
                            <div className="space-y-5">
                                <TextInput
                                    id="name"
                                    label="Nama"
                                    type="text"
                                    {...register('name')}
                                    error={errors.name?.message}
                                />
                                <TextInput
                                    id="email"
                                    label="Alamat Email"
                                    type="email"
                                    {...register('email')}
                                    error={errors.email?.message}
                                />
                                <TextInput
                                    id="username"
                                    label="Username"
                                    type="text"
                                    {...register('username')}
                                    error={errors.username?.message}
                                />
                            </div>

                            <hr className="my-2 border-gray-200" />

                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-4">Ubah Password</h4>
                                <div className="space-y-5">
                                    <TextInput
                                        id="password"
                                        label="Password Baru (Opsional)"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        error={errors.password?.message}
                                        helpText="Kosongkan jika tidak ingin mengubah."
                                    />

                                    <TextInput
                                        id="confirmPassword"
                                        label="Konfirmasi Password Baru"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('confirmPassword')}
                                        error={errors.confirmPassword?.message}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="mid"
                                    isLoading={isPending}
                                    icon="fas fa-save"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}