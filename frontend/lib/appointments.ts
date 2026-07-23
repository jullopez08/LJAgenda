import { api } from "./api";
import type { TimeSlotDTO } from "@/lib/ljagenda/types";

interface AvailableSlotResponse {
  time: string;
  disabled: boolean;
}

export async function getAvailableSlots(
  doctorId: string,
  serviceId: string,
  date: string,
): Promise<TimeSlotDTO[]> {
  const slots = await api<AvailableSlotResponse[]>(
    `/appointment/available-slots?doctorId=${doctorId}&serviceId=${serviceId}&date=${date}`,
  );

  return slots.map((slot) => ({
    time: slot.time,
    period: slot.time < "12:00" ? "morning" : "afternoon",
    disabled: slot.disabled,
  }));
}
interface AvailabilitySummaryResponse {
  date: string;
  available: boolean;
}

export async function getAvailabilitySummary(
  doctorId: string,
  serviceId: string,
  startDate: string,
  endDate: string,
): Promise<Record<string, boolean>> {
  const summary = await api<AvailabilitySummaryResponse[]>(
    `/appointment/availability-summary?doctorId=${doctorId}&serviceId=${serviceId}&startDate=${startDate}&endDate=${endDate}`,
  );

  return Object.fromEntries(summary.map((s) => [s.date, s.available]));
}