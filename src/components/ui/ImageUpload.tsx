import { useRef, useState, useEffect } from 'react';
import { X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
    file?: File | null;
    filePath?: string;
    onChange?: (file: File | null) => void;
    readOnly?: boolean;
    accept?: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function ImageUpload({
    file,
    filePath,
    onChange = () => {},
    readOnly = false,
    accept = 'image/jpeg, image/jpg',
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Preview URL effect
    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    const handleSelect = () => {
        if (readOnly) return;
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        validateAndSetFile(selectedFile);
    };

    const handleRemove = () => {
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
        setError(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const validateAndSetFile = (selectedFile: File | null) => {
        if (!selectedFile) {
            onChange(null);
            return;
        }
        const allowedTypes = accept.split(',').map((t) => t.trim());
        if (!allowedTypes.includes(selectedFile.type)) {
            setError(`File must be an image (${allowedTypes.join(', ')})`);
            onChange(null);
            return;
        }
        const maxSizeInMB = 1;
        if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
            setError(`Image size cannot exceed ${maxSizeInMB}MB.`);
            onChange(null);
            return;
        }
        setError(null);
        onChange(selectedFile);
    };

    const fullFileUrl = filePath ? `${API_URL}/uploads/${filePath}` : null;
    const imageSource = previewUrl || fullFileUrl;

    const renderContent = () => {
        if (imageSource) {
            return (
                <div className="relative w-full h-full">
                    <img
                        src={imageSource}
                        alt="Image Preview"
                        className="w-full h-full object-contain rounded-lg"
                    />

                    {/* Tombol hapus */}
                    {!readOnly && previewUrl && (
                        <Button
                            variant="primary"
                            size="icon"
                            type="button"
                            className="absolute top-2 right-2 rounded-full shadow-md cursor-pointer hover:bg-red-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}

                    {/* Tombol buka */}
                    {imageSource && (
                        <Button
                            variant="secondary"
                            type="button"
                            className="absolute bottom-2 right-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm text-sm px-2 py-1 flex items-center space-x-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(imageSource, '_blank');
                            }}
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Buka</span>
                        </Button>
                    )}
                </div>
            );
        }

        if (readOnly) return <p className="text-sm text-gray-500">Tidak ada gambar.</p>;

        return (
            <div className="flex flex-col items-center space-y-2 text-gray-500">
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm font-semibold text-gray-600">
                    Klik atau seret gambar disini
                </span>
                <span className="text-xs text-gray-500">JPG (Max 1MB)</span>
                {filePath && !file && (
                    <a
                        href={`${API_URL}/uploads/${filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:underline mt-2"
                    >
                        📎 Lihat file saat ini
                    </a>
                )}
            </div>
        );
    };

    return (
        <div
            className={cn(
                'relative group border-2 border-dashed rounded-xl p-4 text-center transition-colors duration-200 aspect-square w-full flex items-center justify-center',
                !readOnly && 'cursor-pointer',
                isDragging && 'border-indigo-500 bg-indigo-50',
                !isDragging && 'border-gray-300 hover:bg-gray-50',
                error && 'border-red-500 bg-red-50',
                readOnly && 'bg-gray-100 border-gray-200 cursor-default',
                imageSource && 'p-0 border-solid'
            )}
            onClick={!readOnly ? handleSelect : undefined}
            onDragOver={
                !readOnly
                    ? (e) => {
                          e.preventDefault();
                          setIsDragging(true);
                      }
                    : undefined
            }
            onDragLeave={
                !readOnly
                    ? (e) => {
                          e.preventDefault();
                          setIsDragging(false);
                      }
                    : undefined
            }
            onDrop={!readOnly ? handleDrop : undefined}
            role={!readOnly ? 'button' : 'region'}
            aria-label="Image upload area"
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />
            {renderContent()}
        </div>
    );
}
