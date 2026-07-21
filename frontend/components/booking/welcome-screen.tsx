"use client"

import { useEffect, useState } from "react"
import { ArrowRightIcon, CalendarCheckIcon, ClockIcon, ShieldCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/booking/brand-logo"
import { tenant } from "@/lib/ljagenda/config"

const HIGHLIGHTS = [
  { icon: ClockIcon, label: "Reserva en 1 minuto" },
  { icon: CalendarCheckIcon, label: "Confirmación inmediata" },
  { icon: ShieldCheckIcon, label: "Sin crear contraseñas" },
]

export function WelcomeScreen({
  onStart,
  onManage,
}: {
  onStart: () => void
  onManage: () => void
}) {
  const [subtitleIndex, setSubtitleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % tenant.welcomeSubtitles.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 text-center">
        <div className="flex flex-col items-center gap-5">
          <BrandLogo showName={false} size="lg" />
          <div className="flex flex-col gap-2">
            <h1 className="text-pretty text-2xl font-semibold tracking-tight text-foreground">
              {tenant.clinicName}
            </h1>
            <p
              key={subtitleIndex}
              className="animate-in fade-in-0 slide-in-from-bottom-1 text-balance text-sm leading-relaxed text-muted-foreground duration-500"
            >
              {tenant.welcomeSubtitles[subtitleIndex]}
            </p>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-2.5">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3 text-left text-sm font-medium text-card-foreground"
            >
              <span className="grid size-8 place-items-center rounded-[8px] bg-brand-muted text-brand">
                <Icon className="size-4" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          onClick={onStart}
          className="h-12 w-full text-base font-medium shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          Agendar Cita
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="ghost" onClick={onManage} className="h-10 w-full text-muted-foreground">
          Ya tengo una cita
        </Button>
      </div>
    </div>
  )
}
