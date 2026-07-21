
"use client"

import { IdentifyForm } from "./identify-form"
import type { DocumentType } from "@/lib/ljagenda/types"

export function IdentifyScreen({
  onNew,
}: {
  onNew: (
    documentType: DocumentType,
    documentNumber: string,
  ) => void
}) {
  return (
    <IdentifyForm
      title="Identifícate"
      description="Ingresa tu documento para buscar tu historial. No necesitas contraseña."
      buttonText="Continuar"
      onSubmit={onNew}
    />
  )
}