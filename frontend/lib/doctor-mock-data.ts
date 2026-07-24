// -----------------------------------------------------------------------------
// Mock data + tipos para el Panel del Profesional (LJAgenda).
// Estado 100% en memoria. NO hay conexión a servidores ni endpoints reales.
// -----------------------------------------------------------------------------

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "no-show"
  | "cancelled"

export interface Appointment {
  id: string
  time: string
  patientName: string
  document: string
  serviceName: string
  durationMin: number
  status: AppointmentStatus
}

export interface Service {
  id: string
  name: string
  description: string
  durationMin: number
  price: number | null
  active: boolean
}

export interface DaySchedule {
  day: string
  enabled: boolean
  start: string
  end: string
}

export interface DateRangeBlock {
  id: string
  label: string
  from: string
  to: string
}

export interface TimeBlock {
  id: string
  date: string
  from: string
  to: string
  reason: string
}

export interface Patient {
  id: string
  docType: string
  document: string
  name: string
  phone: string
  email: string
}

export const STATUS_META: Record<
  AppointmentStatus,
  { label: string; badge: "default" | "secondary" | "outline" | "destructive" }
> = {
  pending: { label: "Pendiente", badge: "outline" },
  confirmed: { label: "Confirmada", badge: "default" },
  completed: { label: "Completada", badge: "secondary" },
  "no-show": { label: "No asistió", badge: "destructive" },
  cancelled: { label: "Cancelada", badge: "destructive" },
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    time: "08:00",
    patientName: "María Fernanda Ríos",
    document: "CC 1032456789",
    serviceName: "Consulta general",
    durationMin: 30,
    status: "confirmed",
  },
  {
    id: "a2",
    time: "08:30",
    patientName: "Carlos Andrés Peña",
    document: "CC 1015678234",
    serviceName: "Cita de control",
    durationMin: 20,
    status: "pending",
  },
  {
    id: "a3",
    time: "09:00",
    patientName: "Luisa Gómez Marín",
    document: "CC 52987654",
    serviceName: "Consulta especialista",
    durationMin: 45,
    status: "confirmed",
  },
  {
    id: "a4",
    time: "10:00",
    patientName: "Jorge Iván Restrepo",
    document: "CC 71234567",
    serviceName: "Toma de exámenes",
    durationMin: 15,
    status: "completed",
  },
  {
    id: "a5",
    time: "10:30",
    patientName: "Sara Valentina Torres",
    document: "TI 1098765432",
    serviceName: "Consulta general",
    durationMin: 30,
    status: "pending",
  },
  {
    id: "a6",
    time: "11:00",
    patientName: "Ana María Cardona",
    document: "CC 43876512",
    serviceName: "Cita de control",
    durationMin: 20,
    status: "no-show",
  },
]

export const INITIAL_SERVICES: Service[] = [
  {
    id: "s1",
    name: "Consulta general",
    description: "Valoración médica integral y plan de tratamiento.",
    durationMin: 30,
    price: 50000,
    active: true,
  },
  {
    id: "s2",
    name: "Cita de control",
    description: "Seguimiento a tratamiento en curso.",
    durationMin: 20,
    price: 35000,
    active: true,
  },
  {
    id: "s3",
    name: "Consulta especialista",
    description: "Atención especializada con profesional certificado.",
    durationMin: 45,
    price: 90000,
    active: true,
  },
  {
    id: "s4",
    name: "Toma de exámenes",
    description: "Laboratorio clínico y muestras diagnósticas.",
    durationMin: 15,
    price: 28000,
    active: false,
  },
]

export const INITIAL_SCHEDULE: DaySchedule[] = [
  { day: "Lunes", enabled: true, start: "08:00", end: "17:00" },
  { day: "Martes", enabled: true, start: "08:00", end: "17:00" },
  { day: "Miércoles", enabled: true, start: "08:00", end: "17:00" },
  { day: "Jueves", enabled: true, start: "08:00", end: "17:00" },
  { day: "Viernes", enabled: true, start: "08:00", end: "16:00" },
  { day: "Sábado", enabled: true, start: "09:00", end: "12:00" },
  { day: "Domingo", enabled: false, start: "09:00", end: "12:00" },
]

export const INITIAL_DATE_BLOCKS: DateRangeBlock[] = [
  { id: "b1", label: "Vacaciones", from: "2026-07-27", to: "2026-08-07" },
  { id: "b2", label: "Congreso médico", from: "2026-09-10", to: "2026-09-12" },
]

export const INITIAL_TIME_BLOCKS: TimeBlock[] = [
  { id: "t1", date: "2026-07-21", from: "10:00", to: "11:00", reason: "Reunión de equipo" },
  { id: "t2", date: "2026-07-23", from: "15:00", to: "15:30", reason: "Almuerzo extendido" },
]

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "p1",
    docType: "CC",
    document: "1032456789",
    name: "María Fernanda Ríos",
    phone: "+57 300 000 0000",
    email: "maria.rios@correo.com",
  },
  {
    id: "p2",
    docType: "CC",
    document: "1015678234",
    name: "Carlos Andrés Peña",
    phone: "+57 301 234 5678",
    email: "carlos.pena@correo.com",
  },
  {
    id: "p3",
    docType: "CC",
    document: "52987654",
    name: "Luisa Gómez Marín",
    phone: "+57 310 987 6543",
    email: "luisa.gomez@correo.com",
  },
  {
    id: "p4",
    docType: "CC",
    document: "71234567",
    name: "Jorge Iván Restrepo",
    phone: "+57 312 456 7890",
    email: "jorge.restrepo@correo.com",
  },
  {
    id: "p5",
    docType: "TI",
    document: "1098765432",
    name: "Sara Valentina Torres",
    phone: "+57 320 111 2233",
    email: "sara.torres@correo.com",
  },
]

export const TIME_OPTIONS: string[] = (() => {
  const times: string[] = []
  for (let h = 6; h <= 20; h++) {
    for (const m of [0, 30]) {
      times.push(`${`${h}`.padStart(2, "0")}:${`${m}`.padStart(2, "0")}`)
    }
  }
  return times
})()

export function formatCOP(value: number | null): string {
  if (value == null) return "Gratis"
  return `$ ${value.toLocaleString("es-CO")}`
}
