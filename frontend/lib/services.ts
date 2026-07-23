import { api } from "./api";
import type { ServiceDTO } from "@/lib/ljagenda/types";


export async function getServices(doctorId?: string): Promise<ServiceDTO[]> {
  const query = doctorId ? `?doctorId=${doctorId}` : "";
  const services = await api<ServiceDTO[]>(`/services/patient${query}`);

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    basePrice: service.basePrice ?? 0,
  }));
}