/**
 * LJAgenda — White-Label tenant configuration.
 *
 * Everything that changes per client (copy, brand identity, currency) lives
 * here. Visual tokens (colors, radius) live in `app/globals.css`. Swapping a
 * tenant is a matter of editing this object + the CSS token layer.
 */
export interface TenantConfig {
  /** Short brand mark shown inside the logo chip. */
  logoInitials: string
  /** Full clinic / business name. */
  clinicName: string
  /** Rotating welcome subtitles rendered on the landing screen. */
  welcomeSubtitles: string[]
  currency: string
  locale: string
  /** WhatsApp-style support handle shown in the self-service portal. */
  supportHandle: string
  timezoneLabel: string
}

export const tenant: TenantConfig = {
  logoInitials: "LJ",
  clinicName: "Clínica Lopez & Jiménez",
  welcomeSubtitles: [
    "Reserva tu cita en menos de un minuto.",
    "Atención profesional, agenda sin filas.",
    "Tu salud, en tus manos y a un clic.",
  ],
  currency: "COP",
  locale: "es-CO",
  supportHandle: "+57 300 000 0000",
  timezoneLabel: "GMT-5 · Bogotá",
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(tenant.locale, {
    style: "currency",
    currency: tenant.currency,
    maximumFractionDigits: 0,
  }).format(value)
}
