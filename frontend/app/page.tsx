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
import { getPatient } from "@/lib/patients";
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
  const [status, setStatus] = useState<AppointmentStatus>("pending")
  const [reschedule, setReschedule] = useState(false)

  const goTo = useCallback(
    (next: BookingStep) => {
      setHistory((h) => [...h, step])
      setStep(next)
    },
    [step],
  )

  const jump = useCallback((next: BookingStep) => {
    setHistory([])
    setStep(next)
  }, [])

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const prev = h[h.length - 1]
      setStep(prev)
      return h.slice(0, -1)
    })
  }, [])

  const update = (patch: Partial<BookingDraft>) =>
    setDraft((d) => ({ ...d, ...patch }))

  const showBack = !["welcome", "success"].includes(step) && history.length > 0

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
            const patient = await getPatient(number);
            console.log(patient)
            if (patient) {
              update({ patient });
              goTo("service");
              return;
            }

            setDocType(type);
            setDocNumber(number);

            goTo("register");
          }}
        />
      )}
      {step === "searchAppointment" && (
        <SearchAppointmentScreen
          onSearch={async (documentType, documentNumber) => {

            console.log(documentType)
            console.log(documentNumber)

            jump("manage")
          }}
        />
      )}

      {step === "register" && (
        <RegisterScreen
          identificationType={docType}
          identification={docNumber}
          onSubmit={(patient: PatientDTO) => {
            update({ patient })
            goTo("service")
          }}
        />
      )}
 
      {step === "service" && (
        <ServiceScreen
          selectedId={draft.service?.id}
          onSelect={(service: ServiceDTO) => {
            update({ service })
            goTo("provider")
          }}
        />
      )}

      {step === "provider" && (
        <ProviderScreen
          selectedId={draft.provider?.id}
          onSelect={(provider: ProviderDTO) => {
            update({ provider })
            goTo("calendar")
          }}
        />
      )}

      {step === "calendar" && (
        <CalendarScreen
          date={draft.date}
          time={draft.time}
          onSelectDate={(date) => update({ date, time: null })}
          onSelectTime={(time) => update({ time })}
          onContinue={() => {
            if (reschedule) {
              setReschedule(false)
              setStatus("pending")
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
            setStatus("pending")
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
            jump("service")
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
