import { VehicleEvent } from "@/types";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const ServiceStatus = z.enum(["scheduled", "in progress", "completed"]);
export const ServiceType = z.enum(["maintenance", "repair", "other"]);

const partSchema = z.object({
  name: z.string().min(1, "Part name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const serviceFormSchema = z.object({
  vehicleUid: z.string(),
  type: ServiceType,
  status: ServiceStatus,
  date: z.date(),
  parts: z.array(partSchema),
  notes: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;

export type Service = VehicleEvent & {
  type: z.infer<typeof ServiceType>;
  status: z.infer<typeof ServiceStatus>;
  date: Timestamp;
  parts: Part[];
  notes?: string;
  managerUid: string;
};

export type Part = {
  name: string;
  quantity: number;
};
