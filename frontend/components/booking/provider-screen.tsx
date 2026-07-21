"use client"

import { CheckIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { providers, initialsOf } from "@/lib/ljagenda/data"
import type { ProviderDTO } from "@/lib/ljagenda/types"

export function ProviderScreen({
  selectedId,
  onSelect,
}: {
  selectedId?: string
  onSelect: (provider: ProviderDTO) => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Elige tu profesional
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Reserva con quien prefieras según su disponibilidad.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {providers.map((provider) => {
          const active = provider.id === selectedId
          return (
            <Card
              key={provider.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(provider)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(provider)
                }
              }}
              className={cn(
                "flex cursor-pointer flex-row items-center gap-3.5 rounded-card border-border p-3.5 transition-all duration-200 outline-none hover:border-brand/40 hover:shadow-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                active && "border-brand ring-2 ring-brand/20",
              )}
            >
              <Avatar className="size-11 rounded-full">
                <AvatarFallback className="bg-brand-muted text-sm font-medium text-brand">
                  {initialsOf(provider.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm font-semibold text-card-foreground">
                  {provider.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {provider.specialty}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      provider.availableToday ? "bg-success" : "bg-muted-foreground/50",
                    )}
                  />
                  <span className={provider.availableToday ? "text-success" : "text-muted-foreground"}>
                    Próxima disponibilidad: {provider.nextAvailability}
                  </span>
                </span>
              </div>

              {active ? (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                  <CheckIcon className="size-3.5" />
                </span>
              ) : (
                <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
