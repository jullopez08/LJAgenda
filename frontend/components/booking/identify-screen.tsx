/* "use client"

import { useState } from "react"
import { ArrowRightIcon} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { documentTypes } from "@/lib/ljagenda/data"
import type { DocumentType } from "@/lib/ljagenda/types"

export function IdentifyScreen({
  
  onNew,
}: {
  onNew: (documentType: DocumentType, documentNumber: string) => void
}) {
  const [documentType, setDocumentType] = useState<DocumentType>("CC")
  const [documentNumber, setDocumentNumber] = useState("")

  const canContinue =  documentNumber.trim().length >= 4

  function handleContinue() {
     {
      onNew(documentType, documentNumber.trim())
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Identifícate
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ingresa tu documento para buscar tu historial. No necesitas contraseña.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="doc-type">Tipo de documento</FieldLabel>
          <Select
            value={documentType}
            onValueChange={(v) => setDocumentType(v as DocumentType)}
          >
            <SelectTrigger id="doc-type" className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {documentTypes.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="doc-number">Número de documento</FieldLabel>
          <Input
            id="doc-number"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej: 1032456789"
            value={documentNumber }
            onChange={(e) =>
              setDocumentNumber(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
        </Field>
      </FieldGroup>

      <div className="mt-auto pt-2">
        <Button
          size="lg"
          className="h-12 w-full text-base"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continuar
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
 */
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