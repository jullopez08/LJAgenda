/** Strict DTOs for the patient-facing booking flow. */

export type DocumentType = "CC" | "CE" | "PP"

export interface PatientDTO {
  documentType: DocumentType
  documentNumber: string
  fullName: string
  phone: string
  /** Optional — never required to complete a booking. */
  email?: string
}

export interface ServiceDTO {
  id: string
  name: string
  description: string
  basePrice?: number;
}

export interface ProviderDTO {
  id: string
  name: string
  specialty: string
  /** Human label e.g. "Hoy", "Mañana", "Vie 12". */
  nextAvailability: string
  /** Marks the soonest-available professional for a subtle highlight. */
  availableToday: boolean
}

export interface TimeSlotDTO {
  /** 24h label, e.g. "09:30". */
  time: string
  period: "morning" | "afternoon"
  disabled: boolean
}

export interface BookingDraft {
  patient: PatientDTO | null
  service: ServiceDTO | null
  provider: ProviderDTO | null
  /** ISO date string (yyyy-mm-dd). */
  date: string | null
  time: string | null
}

export type BookingStep =
  | "welcome"
  | "identify"
  | "register"
  | "service"
  | "provider"
  | "calendar"
  | "confirm"
  | "success"
  | "searchAppointment"
  | "manage"

export type AppointmentStatus = "pending" | "confirmed" | "cancelled"
