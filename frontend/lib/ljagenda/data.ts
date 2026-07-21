import type {
  DocumentType,
  ProviderDTO,
  ServiceDTO,
  TimeSlotDTO,
} from "./types"

export const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PP", label: "Pasaporte" },
]

export const providers: ProviderDTO[] = [
  {
    id: "pro-1",
    name: "Dra. Laura Gómez",
    specialty: "Medicina general",
    nextAvailability: "Hoy",
    availableToday: true,
  },
  {
    id: "pro-2",
    name: "Dr. Andrés Mora",
    specialty: "Medicina interna",
    nextAvailability: "Hoy",
    availableToday: true,
  },
  {
    id: "pro-3",
    name: "Dra. Sofía Herrera",
    specialty: "Nutrición clínica",
    nextAvailability: "Mañana",
    availableToday: false,
  },
  {
    id: "pro-4",
    name: "Dr. Julián Peña",
    specialty: "Fisioterapia",
    nextAvailability: "Vie 12",
    availableToday: false,
  },
]

/** Deterministic slot generator so the grid feels alive but stays mockable. */
export function getTimeSlots(dateKey: string): TimeSlotDTO[] {
  const morning = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
  const afternoon = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]

  // Seed pseudo-availability from the date string so each day differs.
  const seed = dateKey.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)

  const build = (times: string[], period: TimeSlotDTO["period"], offset: number) =>
    times.map((time, index): TimeSlotDTO => ({
      time,
      period,
      disabled: (seed + index + offset) % 3 === 0,
    }))

  return [...build(morning, "morning", 0), ...build(afternoon, "afternoon", 5)]
}

/** Avatar initials from a full name. */
export function initialsOf(name: string): string {
  return name
    .replace(/^(Dra?\.?)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}
