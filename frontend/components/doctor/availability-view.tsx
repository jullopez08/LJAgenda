"use client"

import { useState } from "react"
import { CalendarDays } from "lucide-react"
import {
  type DaySchedule,
  INITIAL_SCHEDULE,
  TIME_OPTIONS,
} from "@/lib/doctor-mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function TimeSelect({
  value,
  onChange,
  disabled,
  label,
}: {
  value: string
  onChange: (value: string) => void
  disabled: boolean
  label: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as string)} disabled={disabled}>
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function AvailabilityView() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE)

  function update(day: string, patch: Partial<DaySchedule>) {
    setSchedule((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...patch } : d)),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Horarios de atención
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configura tu jornada laboral para cada día de la semana.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4 text-primary" />
            Disponibilidad semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {schedule.map((day) => (
              <li
                key={day.day}
                className={cn(
                  "flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                  !day.enabled && "bg-muted/30",
                )}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={(checked) => update(day.day, { enabled: checked })}
                    aria-label={`Activar ${day.day}`}
                  />
                  <span
                    className={cn(
                      "w-24 text-sm font-medium",
                      day.enabled ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {day.day}
                  </span>
                </div>

                {day.enabled ? (
                  <div className="flex items-center gap-2">
                    <div className="w-28">
                      <TimeSelect
                        value={day.start}
                        disabled={!day.enabled}
                        label={`Inicio ${day.day}`}
                        onChange={(v) => update(day.day, { start: v })}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">a</span>
                    <div className="w-28">
                      <TimeSelect
                        value={day.end}
                        disabled={!day.enabled}
                        label={`Fin ${day.day}`}
                        onChange={(v) => update(day.day, { end: v })}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No disponible</span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
