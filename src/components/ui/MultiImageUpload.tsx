import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { ExternalLink } from "lucide-react";

interface FileField {
    key: string;
    label: string;
}

interface MultiImageUploadProps {
    label?: string;
    fileFields: FileField[];
    mode?: "create" | "edit";
    initialFiles?: Record<string, string | null>;
    onChange?: (mappedFiles: Record<string, File | null>) => void;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    label = "Unggah Berkas",
    fileFields,
    mode = "create",
    initialFiles = {},
    onChange,
}) => {
    const [previews, setPreviews] = useState<Record<string, string | null>>({});
    const [_selectedFiles, setSelectedFiles] = useState<
        Record<string, File | null>
    >({});

    // --- Handle initial files (mode edit) ---
    useEffect(() => {
        if (mode === "edit" && initialFiles) {
            setPreviews((prev) => {
                if (Object.keys(prev).length > 0) return prev;
                const updated: Record<string, string | null> = {};
                fileFields.forEach(({ key }) => {
                    updated[key] = initialFiles[key]
                        ? `${API_URL}/uploads/${initialFiles[key]}`
                        : null;
                });
                return updated;
            });
        }
    }, [initialFiles, mode, fileFields]);

    // --- Bersihkan blob URL saat unmount ---
    useEffect(() => {
        return () => {
            Object.values(previews).forEach((url) => {
                if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    // === MODE CREATE ===
    const handleMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const mapped: Record<string, File | null> = {};
        const newPreviews: Record<string, string | null> = {};

        fileFields.forEach((field, index) => {
            const file = files[index] || null;
            mapped[field.key] = file;
            newPreviews[field.key] = file ? URL.createObjectURL(file) : null;
        });

        setSelectedFiles(mapped);
        setPreviews(newPreviews);
        onChange?.(mapped);
    };

    // --- Ganti satu file setelah multi select ---
    const handleSingleChangeCreate = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: string
    ) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        const newUrl = URL.createObjectURL(file);

        setPreviews((prev) => ({ ...prev, [key]: newUrl }));
        setSelectedFiles((prev) => {
            const updated = { ...prev, [key]: file };
            onChange?.(updated);
            return updated;
        });
    };

    // --- Ganti satu file di mode edit ---
    const handleSingleChangeEdit = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: string
    ) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;

        setPreviews((prev) => {
            const oldUrl = prev[key];
            if (oldUrl && oldUrl.startsWith("blob:")) URL.revokeObjectURL(oldUrl);
            const newUrl = URL.createObjectURL(file);
            return { ...prev, [key]: newUrl };
        });

        setSelectedFiles((prev) => {
            const updated = { ...prev, [key]: file };
            onChange?.(updated);
            return updated;
        });
    };

    return (
        <div className="w-full mb-4">
            <label className="block text-base font-medium text-gray-700 mb-1">
                {label} <span className="text-red-600">*</span>
            </label>

            {/* ======== MODE CREATE ======== */}
            {mode === "create" && (
                <>
                    <label
                        htmlFor="multiUpload"
                        className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="absolute flex flex-col items-center justify-center text-center p-2">
                            <i className="fas fa-cloud-upload-alt text-gray-500 text-3xl"></i>
                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                    Klik untuk unggah beberapa gambar
                                </span>
                            </p>
                            <p className="text-xs text-gray-500">JPG (maks. 1MB per file)</p>
                        </div>

                        <input
                            id="multiUpload"
                            type="file"
                            accept="image/jpeg"
                            multiple
                            className="hidden"
                            onChange={handleMultipleChange}
                        />
                    </label>

                    <div className="mt-5 space-y-4">
                        {fileFields.map(({ key, label }, index) => (
                            <div key={key} className="flex flex-col">
                                <label className="block text-base font-medium text-gray-700 mb-1">
                                    {index + 1}. {label}
                                </label>
                                <div className="relative group">
                                    {previews[key] ? (
                                        <img
                                            src={previews[key]!}
                                            alt={label}
                                            className="w-full min-h-44 max-h-[300px] object-contain border-2 border-dashed border-gray-300 rounded-md bg-gray-100 cursor-pointer hover:opacity-90 transition"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const input = document.getElementById(
                                                    `create-upload-${key}`
                                                ) as HTMLInputElement;
                                                input?.click();
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="w-full min-h-44 max-h-[300px] border-2 border-dashed border-gray-300 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-sm italic cursor-pointer"
                                            onClick={() => {
                                                const input = document.getElementById(
                                                    `create-upload-${key}`
                                                ) as HTMLInputElement;
                                                input?.click();
                                            }}
                                        >
                                            Belum ada file
                                        </div>
                                    )}

                                    <input
                                        id={`create-upload-${key}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleSingleChangeCreate(e, key)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ======== MODE EDIT ======== */}
            {mode === "edit" && (
                <div className="w-full">
                    {fileFields.map(({ key, label }) => (
                        <div key={key} className="flex flex-col">
                            <label className="block text-base font-medium text-gray-700 mb-1">
                                {label}
                            </label>

                            <div className="relative group">
                                {previews[key] ? (
                                    <img
                                        src={previews[key]!}
                                        alt={label}
                                        className="w-full max-h-[300px] object-contain border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:opacity-90 transition"
                                        onClick={() => {
                                            const input = document.getElementById(
                                                `edit-upload-${key}`
                                            ) as HTMLInputElement;
                                            input?.click();
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="w-full min-h-44 max-h-[300px] object-contain flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 text-gray-400 italic text-sm mb-2 cursor-pointer"
                                        onClick={() => {
                                            const input = document.getElementById(
                                                `edit-upload-${key}`
                                            ) as HTMLInputElement;
                                            input?.click();
                                        }}
                                    >
                                        Belum ada file
                                    </div>
                                )}

                                <input
                                    id={`edit-upload-${key}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleSingleChangeEdit(e, key)}
                                />

                                {/* Optional tombol buka di tab baru */}
                                {previews[key] && (
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className="absolute bottom-2 right-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm text-sm px-2 py-1 flex items-center space-x-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(previews[key]!, "_blank");
                                        }}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Buka</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiImageUpload;
