import { api } from "./api";
import type { PatientDTO } from "@/lib/ljagenda/types";


export async function getPatient(
  documentNumber: string,
): Promise<PatientDTO | null> {

  try {

    const patient = await api<any>(
      `/patients/search?identification=${documentNumber}`
    );

    return {
      identificationType: patient.identificationType,
      identification: patient.identification,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
    }; 

  } catch {

    return null;
  }

}
export async function createPatient(patient: PatientDTO): Promise<PatientDTO> {
  const created = await api<PatientDTO>("/patients", {
    method: "POST",
    body: JSON.stringify(patient),
  });

  return {
    identificationType: created.identificationType,
    identification: created.identification,
    name: created.name,
    phone: created.phone,
    email: created.email,
  };
}