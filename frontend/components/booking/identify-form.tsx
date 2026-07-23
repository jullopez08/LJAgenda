"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"

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
import { Spinner } from "../ui/spinner"

interface IdentifyFormProps {
  title: string
  description: string
  buttonText: string
  loadingText?: string
  loading?: boolean
  error?: string | null
  onSubmit: (
    identificationType: DocumentType,
    identification: string,
  ) => void
}

export function IdentifyForm({
  title,
  description,
  buttonText,
  loadingText = "Cargando…",
  loading = false,
  error = null,
  onSubmit,
}: IdentifyFormProps) {
  const [identificationType, setDocumentType] = useState<DocumentType>("CC")
  const [identification, setDocumentNumber] = useState("")

  const canContinue = identification.trim().length >= 4

  function handleSubmit() {
    onSubmit(identificationType, identification.trim())
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="doc-type">
            Tipo de documento
          </FieldLabel>

          <Select
            value={identificationType}
            onValueChange={(v) =>
              setDocumentType(v as DocumentType)
            }
          >
            <SelectTrigger
              id="doc-type"
              className="w-full"
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {documentTypes.map((d) => (
                  <SelectItem
                    key={d.value}
                    value={d.value}
                  >
                    {d.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="doc-number">
            Número de documento
          </FieldLabel>

          <Input
            id="doc-number"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej: 1032456789"
            value={identification}
            onChange={(e) =>
              setDocumentNumber(
                e.target.value.replace(/[^0-9]/g, "")
              )
            }
          />
        </Field>
      </FieldGroup>

      {error ? (
        <div className="rounded-input border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs text-destructive">
          {error}
        </div>
      ) : null}

      <div className="mt-auto pt-2">
        <Button
          size="lg"
          className="h-12 w-full text-base"
          disabled={!canContinue || loading}
          onClick={handleSubmit}
        >
          {loading ? <Spinner data-icon="inline-start" /> : null}
          {loading ? loadingText : buttonText}
          {!loading && <ArrowRightIcon data-icon="inline-end" />}
         
        </Button>
      </div>
    </div>
  )
}