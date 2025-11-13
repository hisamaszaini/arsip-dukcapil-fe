import { toast } from "sonner";
import axios from "axios";

/**
 * Universal API Error Handler
 * @param err - error object from Axios
 * @param setError - react-hook-form setError
 */
export const handleApiError = (err: any, setError?: (name: string, error: any) => void) => {
  console.error("API Error caught:", err);

  // 1. Tangani kasus tanpa respons (CORS / koneksi / timeout)
  if (axios.isAxiosError(err) && !err.response) {
    if (err.code === "ECONNABORTED") {
      toast.error("Permintaan timeout. Server tidak merespons.");
    } else if (err.message?.includes("Network Error")) {
      toast.error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } else if (err.message?.includes("CORS")) {
      toast.error("Permintaan diblokir oleh CORS. Hubungi admin server.");
    } else {
      toast.error("Terjadi kesalahan koneksi ke server.");
    }
    return;
  }

  const res = err?.response?.data;
  const status = err?.response?.status;

  // 2. Tangani pesan global dari backend terlebih dahulu
  // Backend selalu mengirim HTTP status code dan field message/errors
  // Jadi kita tampilkan pesan utama dari server terlebih dahulu
  if (res?.message) {
    toast.error(res.message);
  } else if (res?.error) {
    toast.error(res.error);
  } else {
    // Jika tidak ada message dari server, gunakan fallback berdasarkan status code
    if (status === 400) {
      toast.error("Permintaan tidak valid.");
    } else if (status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
    } else if (status === 403) {
      toast.error("Anda tidak memiliki izin untuk melakukan tindakan ini.");
    } else if (status === 404) {
      toast.error("Data yang Anda minta tidak ditemukan.");
    } else if (status === 500) {
      toast.error("Terjadi kesalahan di server.");
    } else {
      toast.error("Terjadi kesalahan yang tidak diketahui.");
    }
  }

  // 3. Tangani field errors (bisa berupa object atau array)
  const errors = res?.errors;

  if (errors && typeof errors === "object") {
    // Case: Record<string, string>
    if (!Array.isArray(errors)) {
      Object.entries(errors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`);
        if (setError) {
          setError(field, { type: "manual", message: String(message) });
        }
      });
    }

    // Case: Array of { field, message }
    else if (Array.isArray(errors)) {
      errors.forEach((e: any) => {
        const field = e.field || "unknown";
        const message = e.message || "Terjadi kesalahan.";
        toast.error(`${field}: ${message}`);
        if (setError) {
          setError(field, { type: "manual", message: String(message) });
        }
      });
    }
  }

  // 4. Tangani fallback error tanpa struktur (misal error string atau Error instance)
  else if (typeof res === "string") {
    toast.error(res);
  } else if (err.message && !res?.message) {
    toast.error(err.message);
  }
};