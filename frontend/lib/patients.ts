import { api } from "./api";
import type { PatientDTO, DocumentType } from "@/lib/ljagenda/types";


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