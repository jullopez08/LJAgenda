"use client"

import { useState } from "react"
import { CalendarCheckIcon, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { BookingSummary } from "@/components/booking/booking-summary"
import { tenant } from "@/lib/ljagenda/config"
import type { BookingDraft } from "@/lib/ljagenda/types"
import { buildCreateAppointmentPayload, createAppointment } from "@/lib/api"

export function ConfirmScreen({
  draft,
  onConfirm,
}: {
  draft: BookingDraft
  onConfirm: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      const payload = buildCreateAppointmentPayload(draft)
      await createAppointment(payload)
      onConfirm()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo agendar la cita. Intenta de nuevo.",
      )
    } finally {
      setSubmitting(false)
    }
  
  }
 
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Revisa y confirma
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Verifica que todo esté correcto antes de reservar.
        </p>
      </div>

      <BookingSummary draft={draft} />

      <div className="flex items-start gap-2.5 rounded-input border border-border bg-muted/40 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
        <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
        <p>
          Recibirás la confirmación y recordatorios por WhatsApp al{" "}
          <span className="font-medium text-foreground">{draft.patient?.phone ?? tenant.supportHandle}</span>.
          El pago se realiza en el consultorio.
        </p>
      </div>
      {error ? (
        <div className="rounded-input border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs text-destructive">
          {error}
        </div>
      ) : null}

      <div className="mt-auto pt-2">
        <Button
          size="lg"
          className="h-12 w-full text-base"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <CalendarCheckIcon data-icon="inline-start" />
          )}
          {submitting ? "Confirmando…" : "Confirmar Cita"}
        </Button>
      </div>
    </div>
  )
}
