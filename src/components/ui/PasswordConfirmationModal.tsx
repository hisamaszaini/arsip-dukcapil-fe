import React, { useState } from 'react';
import { Button } from './Button';
import TextInput from './TextInput';

interface PasswordConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
    title: string;
    message: React.ReactNode;
    confirmButtonText?: string;
    variant?: 'danger' | 'primary';
    isLoading?: boolean;
}

export const PasswordConfirmationModal: React.FC<PasswordConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Confirm',
    variant = 'primary',
    isLoading,
}) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            setError('Password wajib diisi');
            return;
        }
        onConfirm(password);
    };

    const confirmButtonVariant = variant === 'danger' ? 'danger' : 'primary';

    return (
        <div className="w-screen fixed inset-0 bg-black/75 flex justify-center items-center z-50">
            <div className="absolute top-1/2 left-1/2 bg-white opacity-100 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-start mb-4">
                    <div
                        className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                            } sm:mx-0 sm:h-10 sm:w-10`}
                    >
                        <i
                            className={`fas ${variant === 'danger' ? 'fa-lock text-red-600' : 'fa-lock text-blue-600'
                                }`}
                        ></i>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <TextInput
                            id="confirm-password"
                            type="password"
                            label="Password Konfirmasi"
                            placeholder="Masukkan password Anda"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            error={error}
                            autoFocus
                        />
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <Button
                            type="submit"
                            variant={confirmButtonVariant}
                            className="w-full sm:ml-3 sm:w-auto"
                            isLoading={isLoading}
                        >
                            {confirmButtonText}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setPassword('');
                                setError('');
                                onClose();
                            }}
                            variant="secondary"
                            className="mt-3 w-full sm:mt-0 sm:w-auto"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
