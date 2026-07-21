import { api } from "./api";
import type { ServiceDTO } from "@/lib/ljagenda/types";


export async function getServices(): Promise<ServiceDTO[]> {
  const services = await api<ServiceDTO[]>("/services/patient");

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    basePrice: service.basePrice ?? 0,
  }));
}