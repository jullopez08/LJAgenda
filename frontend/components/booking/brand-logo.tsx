import { cn } from "@/lib/utils"
import { tenant } from "@/lib/ljagenda/config"

export function BrandLogo({
  className,
  showName = true,
  size = "sm",
}: {
  className?: string
  showName?: boolean
  size?: "sm" | "lg"
}) { 
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid place-items-center rounded-[10px] bg-brand font-semibold tracking-tight text-brand-foreground shadow-sm",
          size === "sm" ? "size-8 text-sm" : "size-12 text-lg",
        )}
        aria-hidden="true"
      >
        {tenant.logoInitials}
      </span>
      {showName && (
        <span
          className={cn(
            "font-semibold leading-none tracking-tight text-foreground",
            size === "sm" ? "text-sm" : "text-base",
          )}
        >
          {tenant.clinicName}
        </span>
      )}
    </div>
  )
}
