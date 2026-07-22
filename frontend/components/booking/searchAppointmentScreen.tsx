"use client"

import { IdentifyForm } from "./identify-form"
import type { DocumentType } from "@/lib/ljagenda/types"

export function SearchAppointmentScreen({
  onSearch,
}: {
  onSearch: (
    identificationType: DocumentType,
    identification: string,
  ) => void
}) {
  return (
    <IdentifyForm
      title="Buscar cita"
      description="Ingresa tu documento para consultar tu cita."
      buttonText="Buscar cita"
      onSubmit={onSearch}
    />
  )
}