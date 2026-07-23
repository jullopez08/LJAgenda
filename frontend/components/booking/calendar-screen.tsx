
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { addDays, endOfMonth, format, isSameDay, parseISO, startOfMonth, startOfToday } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowRightIcon, SunIcon, SunsetIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"
import type { TimeSlotDTO } from "@/lib/ljagenda/types"
import { getAvailabilitySummary, getAvailableSlots } from "@/lib/appointments"

const toKey = (d: Date) => format(d, "yyyy-MM-dd")
const toMonthKey = (d: Date) => format(d, "yyyy-MM")

export function CalendarScreen({
  date,
  time,
  doctorId,
  serviceId,
  onSelectDate,
  onSelectTime,
  onContinue,
}: {
  date: string | null
  time: string | null
  doctorId: string
  serviceId: string
  onSelectDate: (dateKey: string) => void
  onSelectTime: (time: string) => void
  onContinue: () => void
}) {
  const today = startOfToday()
  const selectedDate = date ? parseISO(date) : undefined

  const runnerDays = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(today, i)),
    [today],
  )

  
  const [dayAvailability, setDayAvailability] = useState<Record<string, boolean>>({})
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set())

   const loadMonth = useCallback(
    (monthDate: Date) => {
      const monthKey = toMonthKey(monthDate)

      setLoadedMonths((prev) => {
        if (prev.has(monthKey)) return prev

        const start = toKey(startOfMonth(monthDate))
        const end = toKey(endOfMonth(monthDate))

        getAvailabilitySummary(doctorId, serviceId, start, end)
          .then((result) => {
            setDayAvailability((current) => ({ ...current, ...result }))
          })
          .catch(() => {
            // Si falla la carga, no bloqueamos nada visualmente; se queda seleccionable
            // y el error real (si aplica) saldrá al intentar agendar.
          })

        const next = new Set(prev)
        next.add(monthKey)
        return next
      })
    },
    [doctorId, serviceId],
  )

 // Al montar o cambiar doctor/servicio: recarga desde cero y trae el/los mes(es)
  // que cubre el runner de 14 días.
  useEffect(() => {
    setDayAvailability({})
    setLoadedMonths(new Set())

    const monthsToLoad = new Set(runnerDays.map((d) => toMonthKey(d)))
    monthsToLoad.forEach((key) => {
       const [y, m] = key.split("-").map(Number)
       loadMonth(new Date(y, m - 1, 1))
    })
  }, [doctorId, serviceId])

  const isDayAvailable =(d: Date) => {
    const key = toKey(d)
    // Mientras el mes no ha cargado, no lo grisamos (evita parpadeo/falsos bloqueados).
    return dayAvailability[key] ?? true
  }
 // --- Horarios del día seleccionado (ya existente)
  const [slots, setSlots] = useState<TimeSlotDTO[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    if (!date) {
      setSlots([])
      return
    }

    let cancelled = false
    setLoadingSlots(true)

    getAvailableSlots(doctorId, serviceId, date)
      .then((result) => {
        if (!cancelled) setSlots(result)
      })
      .catch(() => {
        if (!cancelled) setSlots([])
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })

    return () => {
      cancelled = true
    }
  }, [date, doctorId, serviceId])

  const morning = slots.filter((s) => s.period === "morning")
  const afternoon = slots.filter((s) => s.period === "afternoon")

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Escoge fecha y hora
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Selecciona el día y una franja disponible.
        </p>
      </div>

      {/* Mobile: horizontal date runner */}
      <div className="md:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {runnerDays.map((d) => {
            const active = selectedDate && isSameDay(d, selectedDate)
            const isToday = isSameDay(d, today)
            const available = isDayAvailable(d)
            return (
              <button
                key={toKey(d)}
                type="button"
                disabled={!available}
                onClick={() => onSelectDate(toKey(d))}
               className={cn(
                  "flex min-w-14 shrink-0 flex-col items-center gap-1 rounded-[12px] border px-2 py-2.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  !available &&
                    "cursor-not-allowed border-transparent bg-muted/50 text-muted-foreground/40",
                  available &&
                    (active
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-card text-card-foreground hover:border-brand/40"),
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase",
                    active ? "text-brand-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {format(d, "EEE", { locale: es })}
                </span>
                <span className="text-base font-semibold leading-none">
                  {format(d, "d")}
                </span>
                <span
                  className={cn(
                    "text-[10px]",
                    active ? "text-brand-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {isToday ? "Hoy" : format(d, "MMM", { locale: es })}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop: full calendar matrix */}
      <div className="hidden justify-center md:flex">
         <Calendar
          mode="single"
          locale={es}
          selected={selectedDate}
          onSelect={(d) => d && onSelectDate(toKey(d))}
          onMonthChange={(month) => loadMonth(month)}
          disabled={(d) => d < today || !isDayAvailable(d)}
          className="rounded-card border border-border [--cell-size:--spacing(9)]"
        />
      </div>

      {date ? (
        loadingSlots ? (
          <div className="flex items-center justify-center gap-2 rounded-card border border-dashed border-border bg-muted/30 px-4 py-8 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            Cargando horarios…
          </div>
        ) : (
          <div className="flex flex-col gap-5 animate-in fade-in-0 duration-300">
            <SlotSection
              icon={<SunIcon className="size-3.5" />}
              title="Mañana"
              slots={morning}
              selectedTime={time}
              onSelectTime={onSelectTime}
            />
            <SlotSection
              icon={<SunsetIcon className="size-3.5" />}
              title="Tarde"
              slots={afternoon}
              selectedTime={time}
              onSelectTime={onSelectTime}
            />
          </div>
        )
      ) : (
        <p className="rounded-card border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Selecciona una fecha para ver las horas disponibles.
        </p>
      )}

      <div className="sticky bottom-4 mt-auto pt-2">
        <Button
          size="lg"
          className="h-12 w-full text-base shadow-md"
          disabled={!date || !time}
          onClick={onContinue}
        >
          Continuar
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}

function SlotSection({
  icon,
  title,
  slots,
  selectedTime,
  onSelectTime,
}: {
  icon: React.ReactNode
  title: string
  slots: TimeSlotDTO[]
  selectedTime: string | null
  onSelectTime: (time: string) => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="grid size-5 place-items-center rounded-[6px] bg-muted text-foreground">
          {icon}
        </span>
        {title}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => {
          const active = slot.time === selectedTime
          return (
            <button
              key={slot.time}
              type="button"
              disabled={slot.disabled}
              onClick={() => onSelectTime(slot.time)}
              className={cn(
                "rounded-input border py-2 text-sm font-medium tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                slot.disabled &&
                  "cursor-not-allowed border-transparent bg-muted/50 text-muted-foreground/40 line-through",
                !slot.disabled &&
                  !active &&
                  "border-border bg-card text-card-foreground hover:border-brand/50 hover:bg-brand-muted",
                active && "border-brand bg-brand text-brand-foreground",
              )}
            >
              {slot.time}
            </button>
          )
        })}
      </div>
    </div>
  )
}
