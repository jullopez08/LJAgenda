"use client"

import type { ReactNode } from "react"
import { BrandLogo } from "@/components/booking/brand-logo"
import { cn } from "@/lib/utils"

export interface NavItem {
  id: string
  label: string
  icon: React.ElementType
}

export function DoctorShell({
  children,
  navItems,
  currentSection,
  onSectionChange,
  headerSlot,
}: {
  children: ReactNode
  navItems: NavItem[]
  currentSection: string
  onSectionChange: (id: string) => void
  headerSlot?: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <BrandLogo showName />
          </div>
          {headerSlot}
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              currentSection === item.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <item.icon className="size-3.5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-start">
        {/* Sidebar para desktop */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-border/70 p-4 md:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  currentSection === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <footer className="border-t border-border/70 py-4">
        <div className="mx-auto w-full max-w-7xl px-4 text-center text-xs text-muted-foreground">
          Potenciado por <span className="font-medium text-foreground">LJAgenda</span>
        </div>
      </footer>
    </div>
  )
}
