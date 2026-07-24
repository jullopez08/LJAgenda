"use client"

import { Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"

type DoctorEntryProps = {
  onClick?: () => void
}

export function DoctorEntry({onClick}: DoctorEntryProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground"
      aria-label="Acceso profesional"
      title="Acceso profesional"
    >
      <Stethoscope className="size-4" />
    </Button>

  )
}