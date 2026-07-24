"use client"

import { CalendarIcon, ChevronRightIcon, ClockIcon, StethoscopeIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { formatLongDate } from "@/components/booking/booking-summary"
import { STATUS_META } from "@/components/booking/manage-screen"
import { mapBackendStatusToFrontend } from "@/lib/patient/appointments"
import type { AppointmentSearchResult } from "@/lib/ljagenda/types"

export function AppointmentListScreen({
  appointments,
  onSelect,
}: {
  appointments: AppointmentSearchResult[]
  onSelect: (appointment: AppointmentSearchResult) => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Tus citas
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Encontramos más de una cita. Elige cuál quieres gestionar.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {appointments.map((appointment) => {
          const meta = STATUS_META[mapBackendStatusToFrontend(appointment.status)]

          return (
            <Card
              key={appointment.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(appointment)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(appointment)
                }
              }}
              className="flex cursor-pointer flex-row items-center gap-3.5 rounded-card border-border p-3.5 transition-all duration-200 outline-none hover:border-brand/40 hover:shadow-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-card-foreground">
                    {appointment.service.name}
                  </span>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      meta.className,
                    )}
                  >
                    {meta.label}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <StethoscopeIcon className="size-3.5" />
                  {appointment.doctor.name}
                </span>

                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="size-3.5" />
                    {formatLongDate(appointment.appointmentDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="size-3.5" />
                    {appointment.appointmentTime}
                  </span>
                </span>
              </div>

              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            </Card>
          )
        })}
      </div>
    </div>
  )
}