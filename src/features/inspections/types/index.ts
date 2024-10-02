import { VehicleEvent } from "@/types";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const InspectionType = z.enum(["regular", "pre-trip", "post-trip", "specific"]);

const checklistItemSchema = z.object({
  name: z.string().min(1, "Checklist item name is required"),
  checked: z.boolean().default(false),
});

export const inspectionFormSchema = z.object({
  vehicleUid: z.string(),
  type: InspectionType,
  date: z.date(),
  checklist: z.array(checklistItemSchema),
  notes: z.string().optional(),
});

export type InspectionFormData = z.infer<typeof inspectionFormSchema>;

export type Inspection = VehicleEvent & {
  type: z.infer<typeof InspectionType>;
  date: Timestamp;
  checklist: ChecklistItem[];
  notes?: string;
  managerUid: string;
};

export type ChecklistItem = {
  name: string;
  checked: boolean;
};
