"use client"

import { CheckIcon, ClockIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { services } from "@/lib/ljagenda/data"
import { formatPrice } from "@/lib/ljagenda/config"
import type { ServiceDTO } from "@/lib/ljagenda/types"

export function ServiceScreen({
  selectedId,
  onSelect,
}: {
  selectedId?: string
  onSelect: (service: ServiceDTO) => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Elige un servicio
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Selecciona el tipo de atención que necesitas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const active = service.id === selectedId
          return (
            <Card
              key={service.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(service)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(service)
                }
              }}
              className={cn(
                "cursor-pointer rounded-card border-border transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                active && "border-brand ring-2 ring-brand/20",
              )}
            >
              <CardContent className="flex h-full flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-pretty text-sm font-semibold leading-snug text-card-foreground">
                    {service.name}
                  </h2>
                  {active ? (
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                      <CheckIcon className="size-3" />
                    </span>
                  ) : null}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <Badge variant="secondary" className="gap-1 font-normal">
                    <ClockIcon className="size-3" />
                    {service.durationMin} min
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="mt-auto text-center text-xs text-muted-foreground">
        Toca una tarjeta para continuar
      </p>
    </div>
  )
}
