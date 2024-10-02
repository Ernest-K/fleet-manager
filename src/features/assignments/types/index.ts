import { Driver } from "@/features/drivers/types";
import { Vehicle } from "@/features/vehicles/types";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const createAssignmentFormSchema = z
  .object({
    driverUid: z.string(),
    vehicleUid: z.string(),
    dateRange: z.object({ from: z.date(), to: z.date().optional() }, { required_error: "Please select a date range" }),
  })
  .refine(
    (data) => {
      if (data.dateRange.to) {
        return data.dateRange.from < data.dateRange.to;
      }
    },
    {
      message: "From date must be before to date",
    }
  );

export type CreateAssignmentFormData = z.infer<typeof createAssignmentFormSchema>;

export type Assignment = {
  uid: string;
  dateRange: { from: Timestamp; to: Timestamp };
  driverUid: string;
  vehicleUid: string;
  driver: Driver;
  vehicle: Vehicle;
  managerUid: string;
};
