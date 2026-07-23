import { addMinutes, hasTimeConflict, minutesToTime, timeToMinutes } from './appointment-time';

export function generateSlots(
  startTime: string,
  endTime: string,
  appointmentDuration: number,
): string[] {

  const slots: string[] = [];

  let currentTime = minutesToTime(timeToMinutes(startTime))

  while (
    timeToMinutes(addMinutes(currentTime, appointmentDuration)) <=
    timeToMinutes(endTime)
  ) {
    slots.push(currentTime);

    currentTime = addMinutes(currentTime, appointmentDuration);
  }

  return slots;
}
export function getAppointmentDuration(
  serviceDuration: number,
  slotGap: number,
): number {
  return serviceDuration + slotGap;
}
export function hasSlotConflict(
  slotStart: string,
  slotDuration: number,
  rangeStart: string,
  rangeEnd: string,
): boolean {

  const slotEnd = addMinutes(
    slotStart,
    slotDuration,
  );

  return hasTimeConflict(
    slotStart,
    slotEnd,
    rangeStart,
    rangeEnd,
  );
}

export function getCurrentTime(): string {

    const now = new Date();

    const hours = now.getHours().toString().padStart(2, '0');

    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}