"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, ChevronLeftIcon, Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { BrandLogo } from "../booking/brand-logo"

export function LoginGate({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("dra.gomez@clinicalj.co")
  const [password, setPassword] = useState("demo1234")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onLogin()
  }

  return (


    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            aria-label="Volver"
          >
            <ChevronLeftIcon />
          </Button>


        </div>
      </header>

      {/* Contenido */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <BrandLogo size="lg" />
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
              Panel del Profesional
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Ingresa a tu entorno operativo privado.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Correo profesional</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <FieldDescription className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5" />
                      Modo demo · el acceso es simulado en memoria.
                    </FieldDescription>
                  </Field>
                  <Button type="submit" className="w-full">
                    <Lock data-icon="inline-start" />
                    Ingresar
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Potenciado por <span className="font-semibold text-foreground">LJAgenda</span>
          </p>
        </div>
      </main>
    </div>
  )
}
