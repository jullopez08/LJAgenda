import { BadRequestException } from "@nestjs/common";
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
export function isToday(date: string): boolean {

    const today = new Date();

    const [year, month, day] = date.split('-').map(Number);

    const selectedDate = new Date(
        year,
        month - 1,
        day,
    );

    return (
        today.getFullYear() === selectedDate.getFullYear() &&
        today.getMonth() === selectedDate.getMonth() &&
        today.getDate() === selectedDate.getDate()
    );
}

export function validateAndConvertIsoDates(startDateStr: string, endDateStr: string) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException(
            'Las fechas proporcionadas tienen un formato inválido. Asegúrese de enviar un formato ISO-8601 válido.'
        );
    }

    return { startDate, endDate };
}
export function validateAndConvertUpdateDates(dto: any) {
  const updateData = { ...dto };

  if (dto.startDate) {
    const parsedStart = new Date(dto.startDate);
    if (isNaN(parsedStart.getTime())) {
      throw new BadRequestException('Formato de fecha de inicio (startDate) inválido. Use ISO-8601.');
    }
    updateData.startDate = parsedStart;
  }

  if (dto.endDate) {
    const parsedEnd = new Date(dto.endDate);
    if (isNaN(parsedEnd.getTime())) {
      throw new BadRequestException('Formato de fecha de fin (endDate) inválido. Use ISO-8601.');
    }
    updateData.endDate = parsedEnd;
  }

  return updateData;
}