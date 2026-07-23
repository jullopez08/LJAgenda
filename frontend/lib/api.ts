import { BookingDraft, CreateAppointmentPayload } from "./ljagenda/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const rawText = await response.text();

    let message = rawText || `Error ${response.status} al consumir ${endpoint}`;

    try {
      const parsed = JSON.parse(rawText);

      if (Array.isArray(parsed?.message)) {
        // NestJS ValidationPipe a veces devuelve un array de errores.
        message = parsed.message.join(", ");
      } else if (typeof parsed?.message === "string") {
        message = parsed.message;
      }
    } catch {
      // No era JSON, se deja el texto crudo como venía.
    }

    throw new Error(message);
  }

  return response.json();
}
export function buildCreateAppointmentPayload(draft: BookingDraft): CreateAppointmentPayload {
  if (!draft.patient || !draft.provider || !draft.service || !draft.date || !draft.time) {
    throw new Error("Faltan datos del draft para crear la cita.");
  }

  return {
    doctorId: draft.provider.id,
    serviceId: draft.service.id,
    identificationType: draft.patient.identificationType,
    identification: draft.patient.identification,
    name: draft.patient.name,
    phone: draft.patient.phone,
    email: draft.patient.email,
    appointmentDate: draft.date,
    appointmentTime: draft.time,
  };
}
export async function createAppointment(payload: CreateAppointmentPayload) {
  return api<{ id: string }>("/appointment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}