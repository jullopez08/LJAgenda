import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  ClockIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/ljagenda/config"
import type { BookingDraft } from "@/lib/ljagenda/types"

export function formatLongDate(dateKey: string): string {
  const d = parseISO(dateKey)
  const label = format(d, "EEEE d 'de' MMMM", { locale: es })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function BookingSummary({
  draft,
  className,
}: {
  draft: BookingDraft
  className?: string
}) {
  const rows = [
    {
      icon: UserIcon,
      label: "Paciente",
      value: draft.patient?.name ?? "—",
      hint: draft.patient
        ? `${draft.patient.identificationType} ${draft.patient.identification}`
        : undefined,
    },
    {
      icon: StethoscopeIcon,
      label: "Profesional",
      value: draft.provider?.name ?? "—",
      hint: draft.provider?.specialty,
    },
    {
      icon: CalendarIcon,
      label: "Fecha",
      value: draft.date ? formatLongDate(draft.date) : "—",
      hint: draft.time ? undefined : "Sin fecha",
    },
    {
      icon: ClockIcon,
      label: "Hora",
      value: draft.time ?? "—",
    },
  ]

  return (
    <div className={cn("rounded-card border border-border bg-card", className)}>
      {draft.service ? (
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-muted-foreground">
              Servicio
            </span>
            <span className="text-sm font-semibold text-card-foreground">
              {draft.service.name}
            </span>
            {/* <span className="text-xs text-muted-foreground">
              {draft.service.durationMin} min
            </span> */}
          </div>
           <span className="text-base font-semibold text-foreground">
            {formatPrice(draft.service.basePrice ?? 0)}
          </span> 
        </div>
      ) : null}

      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 px-4 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-muted text-muted-foreground">
              <row.icon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="flex min-w-0 flex-col items-end text-right">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {row.value}
                </span>
                {row.hint ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {row.hint}
                  </span>
                ) : null}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
