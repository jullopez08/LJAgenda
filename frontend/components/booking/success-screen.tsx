"use client"

import { addMinutes, format, parseISO } from "date-fns"
import { CalendarPlusIcon, CheckIcon, PlusIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BookingSummary } from "@/components/booking/booking-summary"
import { tenant } from "@/lib/ljagenda/config"
import type { BookingDraft } from "@/lib/ljagenda/types"

function buildDates(draft: BookingDraft) {
  if (!draft.date || !draft.time) return null
  const [h, m] = draft.time.split(":").map(Number)
  const start = parseISO(draft.date)
  start.setHours(h, m, 0, 0)
  const end = addMinutes(start, draft.service?.durationMin ?? 30)
  const fmt = (d: Date) => format(d, "yyyyMMdd'T'HHmmss")
  return { start, end, gStart: fmt(start), gEnd: fmt(end) }
}

export function SuccessScreen({
  draft,
  onManage,
  onNewBooking,
  onHome,
}: {
  draft: BookingDraft
  onManage: () => void
  onNewBooking: () => void
  onHome: () => void
}) {
  const dates = buildDates(draft)
  const title = `${draft.service?.name ?? "Cita"} · ${tenant.clinicName}`
  const details = draft.provider
    ? `Con ${draft.provider.name} (${draft.provider.specialty})`
    : ""

  const googleUrl = dates
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title,
      )}&dates=${dates.gStart}/${dates.gEnd}&details=${encodeURIComponent(details)}`
    : "#"

  const icsUrl = dates
    ? `data:text/calendar;charset=utf-8,${encodeURIComponent(
        [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "BEGIN:VEVENT",
          `DTSTART:${dates.gStart}`,
          `DTEND:${dates.gEnd}`,
          `SUMMARY:${title}`,
          `DESCRIPTION:${details}`,
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\n"),
      )}`
    : "#"

  return (
    <div className="flex flex-1 flex-col gap-7 pt-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative grid place-items-center">
          <span className="absolute size-24 animate-ping rounded-full bg-success/10" />
          <span className="grid size-16 place-items-center rounded-full bg-success text-success-foreground shadow-sm">
            <CheckIcon className="size-8" />
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            ¡Tu cita está reservada!
          </h1>
          <p className="text-balance text-sm leading-relaxed text-muted-foreground">
            Te enviamos la confirmación por WhatsApp. Puedes gestionarla cuando quieras.
          </p>
        </div>
      </div>

      <BookingSummary draft={draft} />

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-11"
            render={<a href={googleUrl} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
          >
            <CalendarPlusIcon data-icon="inline-start" />
            Google
          </Button>
          <Button
            variant="outline"
            className="h-11"
            render={<a href={icsUrl} download="cita-ljagenda.ics" />}
            nativeButton={false}
          >
            <CalendarPlusIcon data-icon="inline-start" />
            Apple
          </Button>
        </div>

        <Button size="lg" className="h-12 w-full text-base" onClick={onManage}>
          Gestionar mi cita
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" className="h-10 text-muted-foreground" onClick={onNewBooking}>
            <PlusIcon data-icon="inline-start" />
            Otra cita
          </Button>
          <Button variant="ghost" className="h-10 text-muted-foreground" onClick={onHome}>
            <RotateCcwIcon data-icon="inline-start" />
            Inicio
          </Button>
        </div>
      </div>
    </div>
  )
}
