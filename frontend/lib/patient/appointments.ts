import { api } from "../api";
import type { TimeSlotDTO } from "@/lib/ljagenda/types";
import type { AppointmentSearchResult, AppointmentStatus, BookingDraft } from "@/lib/ljagenda/types";


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

export async function searchAppointmentsByIdentification(
  identification: string,
): Promise<AppointmentSearchResult[]> {
  return api<AppointmentSearchResult[]>(
    `/appointment/patient-search?identification=${identification}`,
  );
}

export function mapBackendStatusToFrontend(status: string): AppointmentStatus {
  switch (status) {
    case "CONFIRMED":
      return "confirmed"
    case "CANCELLED":
      return "cancelled"
    default:
      // SCHEDULED, COMPLETED, NO_SHOW -> se muestran como "pendiente" por ahora
      return "scheduled"
  }
}

export function buildDraftFromAppointment(appointment: AppointmentSearchResult): BookingDraft {
  return {
    patient: appointment.patient,
    service: {
      id: appointment.service.id,
      name: appointment.service.name,
      description: appointment.service.description ?? "",
      basePrice: appointment.service.basePrice ?? 0,
    },
    provider: {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      specialty: "",           // no lo tenemos del backend (mismo criterio del módulo de doctor)
      nextAvailability: "",
      availableToday: false,
    },
    date: appointment.appointmentDate,
    time: appointment.appointmentTime,
  }
}