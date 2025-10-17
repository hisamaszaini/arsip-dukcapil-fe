import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNoHpToWa(noHp?: string) {
    if (!noHp) return "";

    let cleaned = noHp.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+62')) {
        return cleaned.slice(1);
    } else if (cleaned.startsWith('0')) {
        return '62' + cleaned.slice(1);
    } else if (cleaned.startsWith('62')) {
        return cleaned;
    }

    return cleaned;
}
