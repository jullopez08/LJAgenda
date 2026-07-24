"use client"

import type { ReactNode } from "react"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/booking/brand-logo"
import { StepProgress } from "@/components/booking/step-progress"
import type { BookingStep } from "@/lib/ljagenda/types"
import { DoctorEntry } from "../doctor/doctor-entry"

export function BookingShell({
  step,
  onBack,
  children,
  headerSlot,
  onDoctorClick,
}: {
  step: BookingStep
  onBack?: () => void
  children: ReactNode
  headerSlot?: ReactNode
  onDoctorClick?: () => void
}) {
  const showProgress = !["welcome", "success", "manage"].includes(step)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-1">
            {onBack ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onBack}
                aria-label="Volver al paso anterior"
                className="-ml-1.5 text-muted-foreground"
              >
                <ChevronLeftIcon />
              </Button>
            ) : null}
            <BrandLogo showName={!onBack} />
          </div>
          <DoctorEntry  onClick={onDoctorClick!}/>
          {headerSlot}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 pt-5">
        {showProgress ? (
          <div className="mb-6"> 
            <StepProgress current={step} />
          </div> 
        ) : null}
        {children}
      </main>

      <footer className="mx-auto w-full max-w-lg px-4 pb-6 pt-2">
        <p className="text-center text-xs text-muted-foreground">
          Potenciado por <span className="font-medium text-foreground">LJAgenda</span>
        </p>
      </footer>
    </div>
  )
}
