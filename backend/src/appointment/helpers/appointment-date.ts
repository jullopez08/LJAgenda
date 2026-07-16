import { WeekDay } from "@prisma/client";

export function getWeekDay(date: string): WeekDay {

    const [year, month, day] = date.split('-').map(Number);

    const jsDate = new Date(year, month - 1, day);

    const weekDays: WeekDay[] = [
        WeekDay.SUNDAY,
        WeekDay.MONDAY,
        WeekDay.TUESDAY,
        WeekDay.WEDNESDAY,
        WeekDay.THURSDAY,
        WeekDay.FRIDAY,
        WeekDay.SATURDAY,
    ];

    return weekDays[jsDate.getDay()];
}

export function startOfDay(date: Date): Date {
    const result = new Date(date);

    result.setUTCHours(0, 0, 0, 0);

    return result;
}

export function endOfDay(date: Date): Date {

    const result = new Date(date)

    result.setUTCHours(23, 59, 59, 999);

    return result;
}