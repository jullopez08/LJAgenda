"use client"

import { useMemo, useState } from "react"
import {
  CalendarClock,
  Check,
  CheckCheck,
  Clock,
  UserPlus,
  Users,
  X,
  RotateCcw,
  CircleSlash,
} from "lucide-react"
import {
  type Appointment,
  type AppointmentStatus,
  INITIAL_APPOINTMENTS,
  STATUS_META,
} from "@/lib/doctor-mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const ACTIONS: {
  status: AppointmentStatus
  label: string
  icon: typeof Check
  variant: "outline" | "secondary" | "destructive" | "default"
}[] = [
  { status: "confirmed", label: "Confirmar", icon: Check, variant: "outline" },
  { status: "completed", label: "Completar", icon: CheckCheck, variant: "outline" },
  { status: "pending", label: "Reprogramar", icon: RotateCcw, variant: "outline" },
  { status: "no-show", label: "No asistió", icon: CircleSlash, variant: "outline" },
  { status: "cancelled", label: "Cancelar", icon: X, variant: "outline" },
]

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users
  label: string
  value: string | number
  hint: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </span>
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardHome() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)

  function updateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt)),
    )
  }

  const stats = useMemo(() => {
    const total = appointments.length
    const confirmed = appointments.filter((a) => a.status === "confirmed").length
    const completed = appointments.filter((a) => a.status === "completed").length
    const pending = appointments.filter((a) => a.status === "pending").length
    return { total, confirmed, completed, pending }
  }, [appointments])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Buenos días, Dra. Laura Gómez
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Martes 21 de julio · resumen de tu jornada.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={CalendarClock}
          label="Citas de hoy"
          value={stats.total}
          hint={`${stats.confirmed} confirmadas`}
        />
        <StatCard
          icon={UserPlus}
          label="Pacientes nuevos"
          value={2}
          hint="Esta semana"
        />
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={stats.pending}
          hint="Por confirmar"
        />
        <StatCard
          icon={CheckCheck}
          label="Completadas"
          value={stats.completed}
          hint="Atendidas hoy"
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-4 text-primary" />
            Agenda de hoy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {appointments.map((appt) => {
              const meta = STATUS_META[appt.status]
              return (
                <li
                  key={appt.id}
                  className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-lg border border-border bg-muted/40 py-2">
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {appt.time}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {appt.durationMin}m
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {appt.patientName}
                        </span>
                        <Badge variant={meta.badge}>{meta.label}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {appt.serviceName} · {appt.document}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                    {ACTIONS.map((action) => {
                      const isActive = appt.status === action.status
                      return (
                        <Button
                          key={action.status}
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          onClick={() => updateStatus(appt.id, action.status)}
                          className="h-7 px-2 text-xs"
                        >
                          <action.icon data-icon="inline-start" />
                          {action.label}
                        </Button>
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
          <Separator />
          <p className="p-4 text-center text-xs text-muted-foreground">
            Los cambios de estado se guardan en memoria durante esta sesión.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
