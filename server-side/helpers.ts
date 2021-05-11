/**
 * Sleep for ms milliseconds
 * @param ms number of milliseconds to sleep
 * @returns A promise that will be resolved at least after ms milliseconds have passed
 */
 export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}
/**
 * Check if a date falls between two dates
 * @param date the date to check
 * @param before the date before
 * @param after the date after
 * @returns true if before <= date <= after
 */
export function between(date: Date, before: Date, after: Date) {
    return date >= before && date <= after;
}

export function valueOrZero(val: number | undefined) {
    return val || 0;
}