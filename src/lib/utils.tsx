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

export function formatInput(value: string, mask: string): string {
    if (!mask) return value;

    // 1. Strip all non-alphanumeric characters to get raw value
    // This allows us to ignore separators the user might have typed or deleted
    const rawValue = value.replace(/[^a-zA-Z0-9]/g, "");
    let formatted = "";
    let rawIndex = 0;

    for (let i = 0; i < mask.length; i++) {
        const maskChar = mask[i];

        // Check if it's a placeholder
        // Added '0' as a numeric placeholder alias for '#'
        if (maskChar === "#" || maskChar === "0" || maskChar === "A" || maskChar === "*") {
            // If we ran out of input, stop
            if (rawIndex >= rawValue.length) break;

            const currentRaw = rawValue[rawIndex];

            if (maskChar === "#" || maskChar === "0") {
                if (/[0-9]/.test(currentRaw)) {
                    formatted += currentRaw;
                    rawIndex++;
                } else {
                    // Invalid char for this placeholder, stop or skip?
                    // Stopping prevents invalid data.
                    break;
                }
            } else if (maskChar === "A") {
                if (/[a-zA-Z]/.test(currentRaw)) {
                    formatted += currentRaw.toUpperCase(); // Force upper for 'A'? Usually good for codes.
                    rawIndex++;
                } else {
                    break;
                }
            } else if (maskChar === "*") {
                if (/[a-zA-Z0-9]/.test(currentRaw)) {
                    formatted += currentRaw;
                    rawIndex++;
                } else {
                    break;
                }
            }
        } else {
            // It's a literal (separator or prefix)

            // Fix for "sticky separator":
            // Only append the literal if we have more input to process,
            // OR if the user has actually typed this literal (matched below).
            // Actually, if we just stop when rawIndex >= rawValue.length, 
            // the literal won't be added unless there's content after it.
            if (rawIndex >= rawValue.length) break;

            formatted += maskChar;

            // If the user actually typed this literal (e.g. part of prefix), consume it
            // so we don't use it for the next placeholder.
            // We check case-insensitive match.
            if (
                rawIndex < rawValue.length &&
                rawValue[rawIndex].toLowerCase() === maskChar.toLowerCase()
            ) {
                rawIndex++;
            }
        }
    }

    return formatted;
}
