/**
 * Format tanggal ke bentuk string (contoh: 14 September 2025)
 */
export function formatTanggal(date?: Date | string, locale = "id-ID"): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Format tanggal singkat (contoh: 14/09/2025)
 */
export function formatTanggalSingkat(date?: Date | string, locale = "id-ID"): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatTanggalSingkatTanpaTahun(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    });
};

export const formatDateForInput = (isoDate: string | Date | undefined): string => {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

export const formatDateForPayload = (dateStr: string | undefined): string | null => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return d.toISOString();
};

export function hitungUmur(tanggalLahir?: Date | string): number | null {
  if (!tanggalLahir) return null;

  const lahir = typeof tanggalLahir === "string" ? new Date(tanggalLahir) : tanggalLahir;
  if (isNaN(lahir.getTime())) return null;

  const today = new Date();
  let umur = today.getFullYear() - lahir.getFullYear();

  const bulanBelum = today.getMonth() < lahir.getMonth();
  const hariBelum = today.getMonth() === lahir.getMonth() && today.getDate() < lahir.getDate();
  if (bulanBelum || hariBelum) umur--;

  return umur;
}
