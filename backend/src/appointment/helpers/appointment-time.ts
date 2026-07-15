export function timeToMinutes(time: string): number{
    const [hours, minutes] = time.split(':').map(Number)

    return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string{
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export function addMinutes(time: string, minutes: number): string{
    const total = timeToMinutes(time)

    return minutesToTime(total + minutes)
}

export function dateToTime(date: Date): string{
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export function isTimeBetween(
    time: string, start: string, end: string): boolean{
        const current =timeToMinutes(time);
        const from = timeToMinutes(start);
        const to = timeToMinutes(end);
        return current >= from && current < to;
}

export function hasTimeConflict(start1: string,end1: string, start2: string, end2: string): boolean {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    return s1 < e2 && s2 < e1;
}
