"use client"

import { useMemo, useState } from "react"
import { Pencil, Plus, Search, UserPlus } from "lucide-react"
import {
  type Patient,
  INITIAL_PATIENTS,
} from "@/lib/doctor-mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const DOC_TYPES = ["CC", "TI", "CE", "PA"]

type Draft = Omit<Patient, "id">

const EMPTY_DRAFT: Draft = {
  docType: "CC",
  document: "",
  name: "",
  phone: "",
  email: "",
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function PatientsView() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.document.includes(q) ||
        p.email.toLowerCase().includes(q),
    )
  }, [patients, query])

  function openCreate() {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setOpen(true)
  }

  function openEdit(patient: Patient) {
    setEditingId(patient.id)
    const { id, ...rest } = patient
    setDraft(rest)
    setOpen(true)
  }

  function handleSave() {
    const record: Patient = { id: editingId ?? `p${Date.now()}`, ...draft }
    setPatients((prev) =>
      editingId ? prev.map((p) => (p.id === editingId ? record : p)) : [...prev, record],
    )
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Pacientes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Directorio administrativo de fichas de pacientes.
          </p>
        </div>
        <Button onClick={openCreate}>
          <UserPlus data-icon="inline-start" />
          Registrar paciente
        </Button>
      </div>

      <div className="max-w-sm">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Buscar por nombre, documento o email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No se encontraron pacientes para “{query}”.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {initials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {patient.docType} {patient.document}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {patient.phone}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {patient.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Editar ${patient.name}`}
                        onClick={() => openEdit(patient)}
                      >
                        <Pencil />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar paciente" : "Registrar paciente"}
            </DialogTitle>
            <DialogDescription>
              Datos básicos de la ficha del paciente.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <div className="grid grid-cols-3 gap-3">
              <Field className="col-span-1">
                <FieldLabel>Tipo</FieldLabel>
                <Select
                  value={draft.docType}
                  onValueChange={(v) => setDraft({ ...draft, docType: v as string })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field className="col-span-2">
                <FieldLabel htmlFor="p-doc">Número de documento</FieldLabel>
                <Input
                  id="p-doc"
                  value={draft.document}
                  placeholder="1032456789"
                  onChange={(e) => setDraft({ ...draft, document: e.target.value })}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="p-name">Nombre completo</FieldLabel>
              <Input
                id="p-name"
                value={draft.name}
                placeholder="María Fernanda Ríos"
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="p-phone">Teléfono</FieldLabel>
              <Input
                id="p-phone"
                value={draft.phone}
                placeholder="+57 300 000 0000"
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="p-email">Email</FieldLabel>
              <Input
                id="p-email"
                type="email"
                value={draft.email}
                placeholder="correo@ejemplo.com"
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </Field>
          </FieldGroup>

          <DialogFooter showCloseButton>
            <Button onClick={handleSave}>
              <Plus data-icon="inline-start" />
              {editingId ? "Guardar cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
