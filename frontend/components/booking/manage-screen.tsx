"use client"

import { useState } from "react"
import {
  CalendarClockIcon,
  CheckIcon,
  MessageCircleIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookingSummary } from "@/components/booking/booking-summary"
import { tenant } from "@/lib/ljagenda/config"
import type { AppointmentStatus, BookingDraft } from "@/lib/ljagenda/types"

const STATUS_META: Record<
  AppointmentStatus,
  { label: string; badge: "default" | "secondary" | "destructive"; className: string }
> = {
  pending: { 
    label: "Pendiente de confirmar",
    badge: "secondary",
    className: "bg-secondary text-secondary-foreground",
  },
  confirmed: {
    label: "Cita confirmada",
    badge: "default",
    className: "bg-success-muted text-success",
  },
  cancelled: {
    label: "Cita cancelada",
    badge: "destructive",
    className: "bg-destructive/10 text-destructive",
  },
}

export function ManageScreen({
  draft,
  status,
  onConfirm,
  onReschedule,
  onCancel,
  onHome,
}: {
  draft: BookingDraft
  status: AppointmentStatus
  onConfirm: () => void
  onReschedule: () => void
  onCancel: () => void
  onHome: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const meta = STATUS_META[status]
  const active = status !== "cancelled"

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center gap-2.5 rounded-input border border-border bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
        <MessageCircleIcon className="size-4 shrink-0 text-success" />
        <span>
          Enlace recibido por WhatsApp desde{" "}
          <span className="font-medium text-foreground">{tenant.supportHandle}</span>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Gestiona tu cita
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              meta.className,
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {meta.label}
          </span>
        </div>
      </div>

      <div className={cn(active ? "" : "opacity-60 grayscale")}>
        <BookingSummary draft={draft} />
      </div>

      {active ? (
        <div className="mt-auto flex flex-col gap-2.5 pt-2">
          {status === "pending" ? (
            <Button size="lg" className="h-12 w-full text-base" onClick={onConfirm}>
              <CheckIcon data-icon="inline-start" />
              Confirmar asistencia
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-input border border-success/30 bg-success-muted py-3 text-sm font-medium text-success">
              <CheckIcon className="size-4" />
              Asistencia confirmada
            </div>
          )}

          <Button variant="outline" size="lg" className="h-11 w-full" onClick={onReschedule}>
            <CalendarClockIcon data-icon="inline-start" />
            Reprogramar
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={<Button variant="destructive" size="lg" className="h-11 w-full" />}
            >
              <XIcon data-icon="inline-start" />
              Cancelar cita
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Cancelar tu cita?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Tu horario quedará disponible para
                  otros pacientes.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Mantener cita
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDialogOpen(false)
                    onCancel()
                  }}
                >
                  Sí, cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="mt-auto pt-2">
          <Button size="lg" className="h-12 w-full text-base" onClick={onHome}>
            Agendar una nueva cita
          </Button>
        </div>
      )}
    </div>
  )
}
