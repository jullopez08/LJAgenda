"use client"
import { useState } from "react"
import { IdentifyForm } from "./identify-form"
import type { DocumentType } from "@/lib/ljagenda/types"
import { searchAppointmentsByIdentification } from "@/lib/patient/appointments"
import type { AppointmentSearchResult } from "@/lib/ljagenda/types"



export function SearchAppointmentScreen({
   onFound,
}: {
  onFound: (appointments: AppointmentSearchResult[]) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(_type: DocumentType, identification: string) {
    setLoading(true)
    setError(null)

    try {
      const appointments = await searchAppointmentsByIdentification(identification)

       if (appointments.length === 0) {
        setError("No encontramos citas futuras asociadas a este documento.")
        return
      }

       onFound(appointments)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo buscar tu cita. Intenta de nuevo.",
      )
       } finally {
      setLoading(false)
    }
  }
  return (
    <IdentifyForm

      title="Buscar cita"
      description="Ingresa tu documento para consultar tu cita."
      buttonText="Buscar cita"
      loadingText="Buscando…"
      loading={loading}
      error={error}
      onSubmit={handleSearch}
    />
  )
  
} 