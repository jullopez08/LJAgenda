"use client"

import { CheckIcon, PlusIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BookingSummary } from "@/components/booking/booking-summary"
import type { BookingDraft } from "@/lib/ljagenda/types"



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
