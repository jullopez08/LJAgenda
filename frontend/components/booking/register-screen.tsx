"use client"

import { useState } from "react"
import { ArrowRightIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { documentTypes } from "@/lib/ljagenda/data"
import type { DocumentType, PatientDTO } from "@/lib/ljagenda/types"

export function RegisterScreen({
  documentType,
  documentNumber,
  onSubmit,
}: {
  documentType: DocumentType
  documentNumber: string
  onSubmit: (patient: PatientDTO) => void
}) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const docLabel =
    documentTypes.find((d) => d.value === documentType)?.label ?? documentType
  const valid = fullName.trim().length >= 3 && phone.trim().length >= 7

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit({
      documentType,
      documentNumber,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Completa tu registro
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Es la primera vez que te vemos. Solo necesitamos unos datos.
        </p>
      </div>

      <FieldGroup>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="reg-doc-type">Documento</FieldLabel>
            <div className="flex h-8 items-center gap-1.5 rounded-input border border-input bg-muted/50 px-2.5 text-sm text-muted-foreground">
              <LockIcon className="size-3.5 shrink-0" />
              <span className="truncate">{documentType}</span>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="reg-doc-number">Número</FieldLabel>
            <div className="flex h-8 items-center rounded-input border border-input bg-muted/50 px-2.5 text-sm text-muted-foreground">
              <span className="truncate">{documentNumber || "—"}</span>
            </div>
          </Field>
        </div>
        <p className="-mt-3 text-xs text-muted-foreground">{docLabel}</p>

        <Field>
          <FieldLabel htmlFor="reg-name">Nombre completo</FieldLabel>
          <Input
            id="reg-name"
            name="name"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            placeholder="Ej: Juan Camilo Torres"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="reg-phone">Teléfono</FieldLabel>
          <Input
            id="reg-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            placeholder="Ej: 300 555 0142"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="reg-email">
            Correo electrónico
            <span className="font-normal text-muted-foreground">· opcional</span>
          </FieldLabel>
          <Input
            id="reg-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="done"
            placeholder="tucorreo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldDescription>
            Lo usamos solo para enviarte el recordatorio de tu cita.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div className="mt-auto pt-2">
        <Button size="lg" type="submit" className="h-12 w-full text-base" disabled={!valid}>
          Continuar
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </form>
  )
}
