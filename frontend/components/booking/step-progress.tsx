import { cn } from "@/lib/utils"
import type { BookingStep } from "@/lib/ljagenda/types"

/** Ordered flow used to compute the slim progress indicator. */
const FLOW: BookingStep[] = [
  "identify",
  "register",
  "service",
  "provider",
  "calendar",
  "confirm",
]

const LABELS: Partial<Record<BookingStep, string>> = {
  identify: "Identificación",
  register: "Registro",
  service: "Servicio",
  provider: "Profesional",
  calendar: "Fecha y hora",
  confirm: "Confirmar",
}

export function StepProgress({ current }: { current: BookingStep }) {
  const activeIndex = FLOW.indexOf(current)
  if (activeIndex === -1) return null

  // Registration is optional, so collapse it out of the visible track.
  const visible = FLOW.filter((s) => s !== "register")
  const currentVisibleIndex = visible.indexOf(
    current === "register" ? "identify" : current,
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Paso {currentVisibleIndex + 1} de {visible.length}
        </span>
        <span className="text-foreground">{LABELS[current]}</span>
      </div>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {visible.map((step, i) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= currentVisibleIndex ? "bg-brand" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  )
}
