"use client"

import { useState } from "react"
import { Clock, Pencil, Plus, Trash2 } from "lucide-react"
import {
  type Service,
  INITIAL_SERVICES,
  formatCOP,
} from "@/lib/doctor-mock-data"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Draft = {
  name: string
  description: string
  durationMin: string
  price: string
  active: boolean
}

const EMPTY_DRAFT: Draft = {
  name: "",
  description: "",
  durationMin: "30",
  price: "",
  active: true,
}

export function ServicesView() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)

  function openCreate() {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setOpen(true)
  }

  function openEdit(service: Service) {
    setEditingId(service.id)
    setDraft({
      name: service.name,
      description: service.description,
      durationMin: String(service.durationMin),
      price: service.price != null ? String(service.price) : "",
      active: service.active,
    })
    setOpen(true)
  }

  function handleSave() {
    const parsed: Service = {
      id: editingId ?? `s${Date.now()}`,
      name: draft.name.trim() || "Servicio sin nombre",
      description: draft.description.trim(),
      durationMin: Number(draft.durationMin) || 30,
      price: draft.price.trim() === "" ? null : Number(draft.price),
      active: draft.active,
    }
    setServices((prev) =>
      editingId ? prev.map((s) => (s.id === editingId ? parsed : s)) : [...prev, parsed],
    )
    setOpen(false)
  }

  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  function toggleActive(id: string) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Servicios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra el catálogo de atención que ofreces.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus data-icon="inline-start" />
          Nuevo servicio
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="flex flex-col gap-3 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {service.name}
                    </span>
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {service.description || "Sin descripción."}
                  </p>
                </div>
                <Switch
                  checked={service.active}
                  onCheckedChange={() => toggleActive(service.id)}
                  aria-label={`Activar ${service.name}`}
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {service.durationMin} min
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {formatCOP(service.price)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openEdit(service)}
                >
                  <Pencil data-icon="inline-start" />
                  Editar
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => removeService(service.id)}
                  aria-label="Eliminar servicio"
                >
                  <Trash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar servicio" : "Nuevo servicio"}
            </DialogTitle>
            <DialogDescription>
              Define los datos visibles para el paciente al reservar.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="svc-name">Nombre</FieldLabel>
              <Input
                id="svc-name"
                value={draft.name}
                placeholder="Ej: Consulta general"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="svc-desc">Descripción</FieldLabel>
              <Textarea
                id="svc-desc"
                value={draft.description}
                placeholder="Valoración médica integral y plan de tratamiento."
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDraft({ ...draft, description: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="svc-duration">Duración (min)</FieldLabel>
                <Input
                  id="svc-duration"
                  type="number"
                  min={5}
                  step={5}
                  value={draft.durationMin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, durationMin: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="svc-price">Precio base (opcional)</FieldLabel>
                <Input
                  id="svc-price"
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="50000"
                  value={draft.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, price: e.target.value })}
                />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="svc-active" className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Servicio activo</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Visible para reservar en el flujo del paciente.
                </span>
              </Label>
              <Switch
                id="svc-active"
                checked={draft.active}
                onCheckedChange={(checked) => setDraft({ ...draft, active: checked })}
              />
            </div>
          </FieldGroup>

          <DialogFooter showCloseButton>
            <Button onClick={handleSave}>
              {editingId ? "Guardar cambios" : "Crear servicio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
