"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { CalendarOff, Clock, Plus, Trash2 } from "lucide-react"
import {
  type DateRangeBlock,
  type TimeBlock,
  INITIAL_DATE_BLOCKS,
  INITIAL_TIME_BLOCKS,
  TIME_OPTIONS,
} from "@/lib/doctor-mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function fmt(date?: Date): string {
  if (!date) return "—"
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function BlocksView() {
  const [dateBlocks, setDateBlocks] = useState<DateRangeBlock[]>(INITIAL_DATE_BLOCKS)
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(INITIAL_TIME_BLOCKS)

  const [range, setRange] = useState<DateRange | undefined>()
  const [rangeLabel, setRangeLabel] = useState("")

  const [tbDate, setTbDate] = useState("")
  const [tbFrom, setTbFrom] = useState("10:00")
  const [tbTo, setTbTo] = useState("11:00")
  const [tbReason, setTbReason] = useState("")

  function addDateBlock() {
    if (!range?.from) return
    const to = range.to ?? range.from
    setDateBlocks((prev) => [
      ...prev,
      {
        id: `b${Date.now()}`,
        label: rangeLabel.trim() || "Bloqueo",
        from: toISO(range.from!),
        to: toISO(to),
      },
    ])
    setRange(undefined)
    setRangeLabel("")
  }

  function addTimeBlock() {
    if (!tbDate) return
    setTimeBlocks((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        date: tbDate,
        from: tbFrom,
        to: tbTo,
        reason: tbReason.trim() || "Bloqueo horario",
      },
    ])
    setTbDate("")
    setTbReason("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Bloqueos de agenda
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inhabilita rangos de fechas o tramos horarios específicos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rango de fechas */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarOff className="size-4 text-primary" />
              Bloqueo por rango de fechas
            </CardTitle>
            <CardDescription>Vacaciones, eventos o ausencias prolongadas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-5">
            <div className="flex justify-center rounded-lg border border-border p-2">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
              />
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="range-label">Motivo</FieldLabel>
                <Input
                  id="range-label"
                  placeholder="Ej: Vacaciones"
                  value={rangeLabel}
                  onChange={(e) => setRangeLabel(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <span>Desde {fmt(range?.from)}</span>
              <span>Hasta {fmt(range?.to)}</span>
            </div>
            <Button onClick={addDateBlock} disabled={!range?.from}>
              <Plus data-icon="inline-start" />
              Agregar bloqueo
            </Button>

            <ul className="flex flex-col gap-2">
              {dateBlocks.map((block) => (
                <li
                  key={block.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{block.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {fmt(new Date(`${block.from}T00:00:00`))} — {fmt(new Date(`${block.to}T00:00:00`))}
                    </span>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Eliminar bloqueo"
                    onClick={() => setDateBlocks((prev) => prev.filter((b) => b.id !== block.id))}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Tramo horario */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-primary" />
              Bloqueo de tramo horario
            </CardTitle>
            <CardDescription>Inhabilita horas puntuales de un día específico.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tb-date">Fecha</FieldLabel>
                <Input
                  id="tb-date"
                  type="date"
                  value={tbDate}
                  onChange={(e) => setTbDate(e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Desde</FieldLabel>
                  <Select value={tbFrom} onValueChange={(v) => setTbFrom(v as string)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Hasta</FieldLabel>
                  <Select value={tbTo} onValueChange={(v) => setTbTo(v as string)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="tb-reason">Motivo</FieldLabel>
                <Input
                  id="tb-reason"
                  placeholder="Ej: Reunión de equipo"
                  value={tbReason}
                  onChange={(e) => setTbReason(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <Button onClick={addTimeBlock} disabled={!tbDate}>
              <Plus data-icon="inline-start" />
              Agregar tramo
            </Button>

            <ul className="flex flex-col gap-2">
              {timeBlocks.map((block) => (
                <li
                  key={block.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{block.reason}</span>
                    <span className="text-xs text-muted-foreground">
                      {fmt(new Date(`${block.date}T00:00:00`))} · {block.from}–{block.to}
                    </span>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Eliminar tramo"
                    onClick={() => setTimeBlocks((prev) => prev.filter((b) => b.id !== block.id))}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
