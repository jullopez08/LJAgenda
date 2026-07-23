"use client"

import { useCallback, useState } from "react"

import { BookingShell } from "@/components/booking/booking-shell"
import { WelcomeScreen } from "@/components/booking/welcome-screen"
import { IdentifyScreen } from "@/components/booking/identify-screen"
import { RegisterScreen } from "@/components/booking/register-screen"
import { ServiceScreen } from "@/components/booking/service-screen"
import { ProviderScreen } from "@/components/booking/provider-screen"
import { CalendarScreen } from "@/components/booking/calendar-screen"
import { ConfirmScreen } from "@/components/booking/confirm-screen"
import { SuccessScreen } from "@/components/booking/success-screen"
import { SearchAppointmentScreen } from "@/components/booking/searchAppointmentScreen"
import { ManageScreen } from "@/components/booking/manage-screen"
import { getPatient } from "@/lib/patients"
import { AppointmentListScreen } from "@/components/booking/appointment-list-screen"
import { buildDraftFromAppointment, mapBackendStatusToFrontend } from "@/lib/appointments"
import type { AppointmentSearchResult } from "@/lib/ljagenda/types"
import type {
  AppointmentStatus,
  BookingDraft,
  BookingStep,
  DocumentType,
  PatientDTO,
  ProviderDTO,
  ServiceDTO,
} from "@/lib/ljagenda/types"

const emptyDraft: BookingDraft = {
  patient: null,
  service: null,
  provider: null,
  date: null,
  time: null,
}

export default function Page() {
  const [step, setStep] = useState<BookingStep>("welcome")
  const [history, setHistory] = useState<BookingStep[]>([])
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft)
  const [docType, setDocType] = useState<DocumentType>("CC")
  const [docNumber, setDocNumber] = useState("")
  const [status, setStatus] = useState<AppointmentStatus>("scheduled")
  const [reschedule, setReschedule] = useState(false)
  const [appointmentOptions, setAppointmentOptions] = useState<AppointmentSearchResult[]>([])
  const [currentAppointmentId, setCurrentAppointmentId] = useState<string | null>(null)

  // Transiciones de estado seguras (fuera de callbacks de set)
  const goTo = useCallback((next: BookingStep) => {
    setHistory((h) => [...h, step])
    setStep(next)
  }, [step])

  const jump = useCallback((next: BookingStep) => {
    setHistory([])
    setStep(next)
  }, [])

  // Corrección crítica del método back
  const back = useCallback(() => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setStep(prev)
  }, [history])

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
  }, [])

  const showBack = !["welcome", "success"].includes(step) && history.length > 0

  function selectAppointment(appointment: AppointmentSearchResult) {
    setDraft(buildDraftFromAppointment(appointment))
    setStatus(mapBackendStatusToFrontend(appointment.status))
    setCurrentAppointmentId(appointment.id)
    jump("manage")
  }

  return (
    <BookingShell step={step} onBack={showBack ? back : undefined}>
      {step === "welcome" && (
        <WelcomeScreen
          onStart={() => {
            setDraft(emptyDraft)
            setDocNumber("")
            goTo("identify")
          }}
          onManage={() => {
            goTo("searchAppointment")
          }}
        />
      )}

      {step === "identify" && (
        <IdentifyScreen
          onNew={async (type, number) => {
            const patient = await getPatient(number)
            if (patient) {
              update({ patient })
              goTo("provider")
              return
            }
            setDocType(type)
            setDocNumber(number)
            goTo("register")
          }}
        />
      )}

      {step === "searchAppointment" && (
        <SearchAppointmentScreen
          onFound={(appointments) => {
            if (appointments.length === 1) {
              selectAppointment(appointments[0])
            } else {
              setAppointmentOptions(appointments)
              goTo("appointmentList")
            }
          }}
        />
      )}

      {step === "appointmentList" && (
        <AppointmentListScreen
          appointments={appointmentOptions}
          onSelect={selectAppointment}
        />
      )}

      {step === "register" && (
        <RegisterScreen
          identificationType={docType}
          identification={docNumber}
          onSubmit={(patient: PatientDTO) => {
            update({ patient })
            goTo("provider")
          }}
        />
      )}

      {step === "provider" && (
        <ProviderScreen
          selectedId={draft.provider?.id}
          onSelect={(provider: ProviderDTO) => {
            update({ provider })
            goTo("service")
          }}
        />
      )}

      {step === "service" && (
        <ServiceScreen
          doctorId={draft.provider!.id}
          selectedId={draft.service?.id}
          onSelect={(service: ServiceDTO) => {
            update({ service })
            goTo("calendar")
          }}
        />
      )}

      {step === "calendar" && (
        <CalendarScreen
          date={draft.date}
          time={draft.time}
          doctorId={draft.provider!.id}
          serviceId={draft.service!.id}
          onSelectDate={(date) => update({ date, time: null })}
          onSelectTime={(time) => update({ time })}
          onContinue={() => {
            if (reschedule) {
              setReschedule(false)
              setStatus("scheduled")
              jump("manage")
            } else {
              goTo("confirm")
            }
          }}
        />
      )}

      {step === "confirm" && (
        <ConfirmScreen
          draft={draft}
          onConfirm={() => {
            setStatus("scheduled")
            jump("success")
          }}
        />
      )}

      {step === "success" && (
        <SuccessScreen
          draft={draft}
          onManage={() => jump("manage")}
          onNewBooking={() => {
            setDraft((d) => ({ ...emptyDraft, patient: d.patient }))
            goTo("provider")
          }}
          onHome={() => {
            setDraft(emptyDraft)
            jump("welcome")
          }}
        />
      )}

      {step === "manage" && (
        <ManageScreen
          draft={draft}
          status={status}
          onConfirm={() => setStatus("confirmed")}
          onReschedule={() => {
            setReschedule(true)
            goTo("calendar")
          }}
          onCancel={() => setStatus("cancelled")}
          onHome={() => {
            setDraft(emptyDraft)
            jump("welcome")
          }}
        />
      )}
    </BookingShell>
  )
}