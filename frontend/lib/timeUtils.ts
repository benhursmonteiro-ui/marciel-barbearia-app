/**
 * Converts a time string (HH:mm) to total minutes from the start of the day.
 */
export function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
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
 * Parses a duration string (e.g., "30 min", "1h 30min", "90 min") into total minutes.
 */
export function getDurationMinutes(durationStr: string): number {
    if (!durationStr) return 30; // Default to 30 mins if not specified
    
    // Support formats like "90 min", "90", "1h 30m"
    durationStr = durationStr.toLowerCase();
    
    if (durationStr.includes('h')) {
        const parts = durationStr.split('h');
        const hours = parseInt(parts[0]) || 0;
        const minutesMatch = parts[1].match(/\d+/);
        const minutes = minutesMatch ? parseInt(minutesMatch[0]) : 0;
        return (hours * 60) + minutes;
    }
    
    const minutesMatch = durationStr.match(/\d+/);
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
