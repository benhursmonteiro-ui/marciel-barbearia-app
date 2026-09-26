/**
 * Converts a time string (HH:mm) to total minutes from the start of the day.
 */
export function timeToMinutes(time: string): number {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts total minutes from the start of the day to a time string (HH:mm).
 */
export function minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Gets local YYYY-MM-DD date string without timezone shifts.
 */
export function getTodayLocalDateStr(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/**
 * Parses a duration string into total minutes.
 * Handles formats like: "30 min", "1h", "1 hora", "1h 30min", "1h30", "1.5h", "1,5h", "60", "90", "01:00"
 */
export function getDurationMinutes(durationStr: string): number {
    if (!durationStr) return 30; // Default to 30 mins if not specified
    
    const normalized = durationStr.toString().toLowerCase().trim().replace(',', '.');
    
    // Handle "01:00" or "01:30" format
    if (normalized.includes(':')) {
        const [h, m] = normalized.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
    }
    
    if (normalized.includes('h') || normalized.includes('hora')) {
        const hIndex = normalized.indexOf('h');
        const horaIndex = normalized.indexOf('hora');
        const splitIdx = hIndex !== -1 ? hIndex : horaIndex;
        
        const hoursPart = normalized.substring(0, splitIdx).trim();
        const minsPart = normalized.substring(splitIdx + (hIndex !== -1 ? 1 : 4)).trim();
        
        const hours = parseFloat(hoursPart) || 0;
        const minutesMatch = minsPart.match(/\d+/);
        const minutes = minutesMatch ? parseInt(minutesMatch[0]) : 0;
        
        return Math.round(hours * 60) + minutes;
    }
    
    const minutesMatch = normalized.match(/\d+/);
    return minutesMatch ? parseInt(minutesMatch[0]) : 30;
}

/**
 * Checks if a slot (at slotMinutes) is occupied by an appointment.
 * An appointment occupies slots from its start time to (start time + duration).
 */
export function isSlotOccupied(
    slotTime: string,
    appointmentTime: string,
    serviceDuration: string
): boolean {
    const slotMin = timeToMinutes(slotTime);
    const appMin = timeToMinutes(appointmentTime);
    const durMin = getDurationMinutes(serviceDuration);
    
    return slotMin >= appMin && slotMin < (appMin + durMin);
}

/**
 * Normalizes day name: lowercase and without diacritics/accents.
 * e.g. "Terça" -> "terca", "Sábado" -> "sabado"
 */
export function normalizeDay(dayName: string): string {
    if (!dayName) return '';
    return dayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

/**
 * Checks if a stored blocked slot string matches the given day, hour, and optional specific date.
 * Supports:
 * - "Terça-12:00", "terca-12:00", "Terça_12:00"
 * - "2026-09-29-12:00", "2026-09-29_12:00"
 */
export function isSlotMatch(
    blockedSlotStr: string,
    day: string,
    hour: string,
    targetDate?: string
): boolean {
    if (!blockedSlotStr) return false;
    const clean = blockedSlotStr.trim();
    const cleanHour = hour.trim();

    // 1. Check matching with targetDate if provided: "YYYY-MM-DD-HH:mm" or "YYYY-MM-DD_HH:mm"
    if (targetDate) {
        if (clean === `${targetDate}-${cleanHour}` || clean === `${targetDate}_${cleanHour}`) {
            return true;
        }
        if (clean.startsWith(`${targetDate}-`) || clean.startsWith(`${targetDate}_`)) {
            if (clean.endsWith(`-${cleanHour}`) || clean.endsWith(`_${cleanHour}`)) {
                return true;
            }
        }
    }

    // 2. Check matching with Day Name: "Dia-HH:mm" or "Dia_HH:mm"
    const separatorMatch = clean.match(/^([^-_\s]+)[-_](.+)$/);
    if (separatorMatch) {
        const slotDay = separatorMatch[1];
        const slotHour = separatorMatch[2];
        if (normalizeDay(slotDay) === normalizeDay(day) && slotHour === cleanHour) {
            return true;
        }
    }

    // 3. Fallback suffix matching
    if (clean.endsWith(`-${cleanHour}`) || clean.endsWith(`_${cleanHour}`)) {
        const prefix = clean.slice(0, -(cleanHour.length + 1));
        if (normalizeDay(prefix) === normalizeDay(day)) return true;
        if (targetDate && prefix === targetDate) return true;
    }

    return false;
}

/**
 * Checks if a specific day/hour is blocked in the given list of blocked slots.
 */
export function isAnySlotBlocked(
    list: string[] | undefined,
    day: string,
    hour: string,
    targetDate?: string
): boolean {
    if (!list || !Array.isArray(list) || list.length === 0) return false;
    return list.some(s => isSlotMatch(s, day, hour, targetDate));
}

/**
 * Removes any representation of the given day/hour or targetDate/hour from the list.
 */
export function removeSlotFromList(
    list: string[] | undefined,
    day: string,
    hour: string,
    targetDate?: string
): string[] {
    if (!list || !Array.isArray(list)) return [];
    return list.filter(s => !isSlotMatch(s, day, hour, targetDate));
}

/**
 * Adds a canonical slot string "Dia-HH:mm" to the list, preventing duplicates.
 */
export function addSlotToList(
    list: string[] | undefined,
    day: string,
    hour: string
): string[] {
    const cleaned = removeSlotFromList(list, day, hour);
    return [...cleaned, `${day}-${hour}`];
}

/**
 * Converts a timestamp (number) or date string (YYYY-MM-DD) safely to a local-noon timestamp.
 * Avoids UTC timezone day-shift bugs.
 */
export function getDateTimestamp(val: number | string): number {
    if (typeof val === 'number') {
        const d = new Date(val);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0).getTime();
    }
    const [y, m, d] = val.split(/[-T/]/).map(Number);
    return new Date(y, m - 1, d, 12, 0, 0).getTime();
}

/**
 * Checks if two dates (numbers or strings) represent the same day.
 */
export function isSameDay(a: number | string, b: number | string): boolean {
    const da = new Date(getDateTimestamp(a));
    const db = new Date(getDateTimestamp(b));
    return da.getFullYear() === db.getFullYear() &&
           da.getMonth() === db.getMonth() &&
           da.getDate() === db.getDate();
}

/**
 * Formats a date or timestamp to DD/MM/YYYY without timezone shift.
 */
export function formatDateBR(val: number | string): string {
    const d = new Date(getDateTimestamp(val));
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

