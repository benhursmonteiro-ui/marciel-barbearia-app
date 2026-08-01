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

