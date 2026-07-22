"use client"

import { useEffect, useState } from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/ljagenda/config"

import { getServices } from "@/lib/services"
import type { ServiceDTO } from "@/lib/ljagenda/types"

export function ServiceScreen({
  selectedId,
  onSelect,
}: {
  selectedId?: string
  onSelect: (service: ServiceDTO) => void
}) {
  const [services, setServices] = useState<ServiceDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error("Error cargando servicios:", error)
      } finally {
        setLoading(false)
      }
    } 

    loadServices()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Cargando servicios...
      </div>
    )
  }

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
                "cursor-pointer rounded-card border-border transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md",
                active && "border-brand ring-2 ring-brand/20",
              )}
            >
              <CardContent className="flex h-full flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold">
                    {service.name}
                  </h2>

                  {active && (
                    <span className="grid size-5 place-items-center rounded-full bg-brand text-brand-foreground">
                      <CheckIcon className="size-3" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-auto flex justify-end">
                  {service.basePrice != null && (
                    <span className="font-semibold text-foreground">
                      {formatPrice(service.basePrice)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}