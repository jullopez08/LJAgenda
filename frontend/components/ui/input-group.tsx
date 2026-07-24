"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const inputGroupAddonVariants = cva(
  "flex items-center justify-center text-muted-foreground",
  {
    variants: {
      align: {
        start: "pl-3",
        end: "pr-3",
      },
    },
    defaultVariants: {
      align: "start",
    },
  }
)

export function InputGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "flex w-full items-center rounded-lg border border-input bg-background transition-all",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40",
        className
      )}
      {...props}
    />
  )
}

export function InputGroupAddon({
  className,
  align,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(inputGroupAddonVariants({ align }), className)}
      {...props}
    />
  )
}

export function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-input"
      className={cn(
        "border-0 shadow-none focus-visible:ring-0 focus-visible:border-transparent bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export function InputGroupButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="input-group-button"
      variant="ghost"
      className={cn("rounded-none", className)}
      {...props}
    />
  )
}