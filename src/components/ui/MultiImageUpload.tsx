import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, Trash2, X } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import { Button } from "./Button";

interface FileField {
  key: string;
  label: string;
}

interface InitialFile {
  url: string;
  id: number;
}

interface MultiImageUploadProps<T extends Record<string, any> = any> {
  label?: string;
  fileFields: FileField[];
  mode?: "create" | "edit";
  initialFiles?: Record<string, InitialFile | null>;
  onChange?: (
    mappedFiles: Record<string, File | null>,
    replacedFiles?: Record<string, number>
  ) => void;
  errors?: FieldErrors<T>;
  onDeleteRequest?: (id: number) => void;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const MultiImageUpload = <T extends Record<string, any> = any>({
  label = "Unggah Berkas",
  fileFields,
  mode = "create",
  initialFiles = {},
  onChange,
  errors,
  onDeleteRequest,
}: MultiImageUploadProps<T>) => {
  const [previews, setPreviews] = useState<Record<string, string | null>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>(
    {}
  );
  const [replaced, setReplaced] = useState<Record<string, number>>({});
  const userModifiedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (mode === "edit" && initialFiles) {
      const updated: Record<string, string | null> = {};
      fileFields.forEach(({ key }) => {
        // Hanya update jika user belum memodifikasi key ini
        if (!userModifiedKeys.current.has(key)) {
          const fileData = initialFiles[key];
          updated[key] = fileData ? `${API_URL}/uploads/${fileData.url}` : null;
        }
      });

      if (Object.keys(updated).length > 0) {
        setPreviews(prev => ({ ...prev, ...updated }));
      }
    }
  }, [initialFiles, mode, fileFields]);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  // === MODE CREATE: unggah beberapa sekaligus ===
  const handleMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mapped: Record<string, File | null> = {};
    const newPreviews: Record<string, string | null> = {};

    // Revoke blob lama jika ada, sebelum membuat yang baru
    Object.values(previews).forEach((url) => {
      if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    fileFields.forEach((field, index) => {
      const file = files[index] || null;
      mapped[field.key] = file;
      newPreviews[field.key] = file ? URL.createObjectURL(file) : null;
    });

    setSelectedFiles(mapped);
    setPreviews(newPreviews);
    onChange?.(mapped); // Mode create tidak perlu kirim 'replaced'
  };

  // === MODE CREATE: ganti satu file per slot ===
  const handleSingleChangeCreate = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    e.target.value = ""; // Reset input

    // Revoke blob lama (jika ada) dan buat yang baru
    setPreviews((prev) => {
      const oldUrl = prev[key];
      if (oldUrl && oldUrl.startsWith("blob:")) {
        URL.revokeObjectURL(oldUrl);
      }
      const newUrl = URL.createObjectURL(file);
      return { ...prev, [key]: newUrl };
    });

    // Update file terpilih
    setSelectedFiles((prevSelected) => {
      const updated = { ...prevSelected, [key]: file };
      onChange?.(updated); // Mode create tidak perlu kirim 'replaced'
      return updated;
    });
  };

  // === MODE CREATE: Unselect File ===
  const handleUnselectCreate = (key: string) => {
    // Revoke blob lama
    const oldUrl = previews[key];
    if (oldUrl && oldUrl.startsWith("blob:")) {
      URL.revokeObjectURL(oldUrl);
    }

    // Update preview
    setPreviews((prev) => ({ ...prev, [key]: null }));

    // Update file terpilih
    setSelectedFiles((prevSelected) => {
      const updated = { ...prevSelected, [key]: null };
      onChange?.(updated);
      return updated;
    });
  };

  // === MODE EDIT: ganti satu file per slot ===
  const handleSingleChangeEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {

    const file = e.target.files?.[0] || null;
    if (!file) {
      return;
    }

    e.target.value = ""; // Reset input

    // Tandai bahwa user sudah memodifikasi key ini
    userModifiedKeys.current.add(key);

    // Revoke blob URL lama jika ada
    const oldUrl = previews[key];

    if (oldUrl && oldUrl.startsWith("blob:")) {
      URL.revokeObjectURL(oldUrl);
    }

    // Buat blob URL baru
    const newUrl = URL.createObjectURL(file);

    // Update semua state sekaligus untuk menghindari race condition
    const newSelected = { ...selectedFiles, [key]: file };
    const fileId = initialFiles[key]?.id;
    const newReplaced = {
      ...replaced,
      ...(fileId ? { [key]: fileId } : {}),
    };

    // Update state
    setPreviews((prev) => {
      const updated = { ...prev, [key]: newUrl };
      return updated;
    });

    setSelectedFiles(newSelected);
    setReplaced(newReplaced);

    onChange?.(newSelected, newReplaced);
  };

  // === MODE EDIT: Unselect File ===
  const handleUnselectEdit = (key: string) => {
    // Tandai bahwa user sudah memodifikasi
    userModifiedKeys.current.add(key);

    // Revoke blob URL lama jika ada (file yang baru dipilih)
    const oldUrl = previews[key];
    if (oldUrl && oldUrl.startsWith("blob:")) {
      URL.revokeObjectURL(oldUrl);
    }

    // Kembalikan ke URL original jika ada
    const initialFile = initialFiles[key];
    const originalUrl = initialFile
      ? `${API_URL}/uploads/${initialFile.url}`
      : null;

    // Update semua state
    const newSelected = { ...selectedFiles, [key]: null };
    const newReplaced = { ...replaced };
    delete newReplaced[key]; // Hapus dari 'replaced' karena dibatalkan

    setPreviews((prev) => ({ ...prev, [key]: originalUrl }));
    setSelectedFiles(newSelected);
    setReplaced(newReplaced);

    onChange?.(newSelected, newReplaced);
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-base font-medium text-gray-700 mb-1">
        {label} <span className="text-red-600">*</span>
      </label>

      {/* === MODE CREATE === */}
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
              <p className="text-xs text-gray-500">HANYA JPG (maks. 1MB)</p>
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
            {fileFields.map(({ key, label }, index) => {
              const errorMessage = (errors as any)?.[key]?.message as
                | string
                | undefined;
              return (
                <div key={key} className="flex flex-col">
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    {index + 1}. {label}
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-md ${errorMessage ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    {previews[key] ? (
                      <>
                        <img
                          src={previews[key]!}
                          alt={label}
                          className="w-full min-h-44 max-h-[300px] object-contain bg-gray-100 rounded-md cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`create-upload-${key}`)
                              ?.click()
                          }
                        />
                        {/* === TOMBOL UNSELECT (CREATE) === */}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/75 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnselectCreate(key);
                          }}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </>
                    ) : (
                      <div
                        className="w-full min-h-44 flex items-center justify-center text-gray-400 text-sm italic bg-gray-100 rounded-md cursor-pointer"
                        onClick={() =>
                          document
                            .getElementById(`create-upload-${key}`)
                            ?.click()
                        }
                      >
                        Belum ada file
                      </div>
                    )}
                  </div>

                  {/* Input tersembunyi untuk ganti satu per satu di mode CREATE */}
                  <input
                    id={`create-upload-${key}`}
                    type="file"
                    accept="image/jpeg"
                    className="hidden"
                    onChange={(e) => handleSingleChangeCreate(e, key)}
                  />

                  {errorMessage && (
                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* === MODE EDIT === */}
      {mode === "edit" && (
        <div className="w-full space-y-4">
          {fileFields.map(({ key, label }) => {
            const errorMessage = (errors as any)?.[key]?.message as
              | string
              | undefined;

            const fileId = initialFiles[key]?.id;
            const isBlob = previews[key]?.startsWith("blob:") ?? false;

            return (
              <div key={key} className="flex flex-col">
                <label className="block text-base font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div
                  className={`relative group border-2 border-dashed rounded-lg ${errorMessage ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  {previews[key] ? (
                    <img
                      src={previews[key]!}
                      alt={label}
                      className="w-full max-h-[300px] object-contain bg-gray-50 rounded-lg cursor-pointer hover:opacity-90"
                      onClick={() => {
                        document.getElementById(`edit-upload-${key}`)?.click();
                      }}
                    />
                  ) : (
                    <div
                      className="w-full min-h-44 flex items-center justify-center bg-gray-50 text-gray-400 italic text-sm cursor-pointer"
                      onClick={() =>
                        document.getElementById(`edit-upload-${key}`)?.click()
                      }
                    >
                      Belum ada file
                    </div>
                  )}

                  {/* Input tersembunyi untuk ganti satu per satu di mode EDIT */}
                  <input
                    id={`edit-upload-${key}`}
                    type="file"
                    accept="image/jpeg"
                    className="hidden"
                    onChange={(e) => handleSingleChangeEdit(e, key)}
                  />

                  {/* === TOMBOL UNSELECT (EDIT) === */}
                  {isBlob && (
                    <Button
                      variant="outline"
                      type="button"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/75 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselectEdit(key);
                      }}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}

                  {/* === TOMBOL DELETE BARU === */}
                  {previews[key] && fileId && !isBlob && (
                    <Button
                      variant="danger"
                      type="button"
                      className="absolute bottom-2 left-2 text-sm px-2 py-1 flex items-center space-x-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRequest?.(fileId);
                      }}>
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus</span>
                    </Button>
                  )}

                  {/* Tombol 'Buka' */}
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

                {errorMessage && (
                  <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;