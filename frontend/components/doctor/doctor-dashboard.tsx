"use client"

import { useState } from "react"
import {
  CalendarDays,
  CalendarOff,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DoctorShell, type NavItem } from "@/components/doctor/doctor-shell"
import { DashboardHome } from "@/components/doctor/dashboard-home"
import { ServicesView } from "@/components/doctor/services-view"
import { AvailabilityView } from "@/components/doctor/availability-view"
import { BlocksView } from "@/components/doctor/blocks-view"
import { PatientsView } from "@/components/doctor/patients-view"

type Section = "home" | "services" | "availability" | "blocks" | "patients"

const NAV: NavItem[] = [
  { id: "home", label: "Inicio", icon: LayoutDashboard },
  { id: "services", label: "Servicios", icon: Stethoscope },
  { id: "availability", label: "Horarios", icon: CalendarDays },
  { id: "blocks", label: "Bloqueos", icon: CalendarOff },
  { id: "patients", label: "Pacientes", icon: Users },
]

export function DoctorDashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>("home")

  const headerSlot = (
    <Button variant="ghost" size="sm" onClick={onLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Salir
    </Button>
  )

  return (
    <DoctorShell
      navItems={NAV}
      currentSection={section}
      onSectionChange={(id) => setSection(id as Section)}
      headerSlot={headerSlot}
    >
      <div className="mx-auto max-w-5xl">
        {section === "home" && <DashboardHome />}
        {section === "services" && <ServicesView />}
        {section === "availability" && <AvailabilityView />}
        {section === "blocks" && <BlocksView />}
        {section === "patients" && <PatientsView />}
      </div>
    </DoctorShell>
  )
}
