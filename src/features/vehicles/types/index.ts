import { colorMap } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const VehicleType = z.enum(["car", "truck", "van", "motorcycle", "bus", "other"]);
export const FuelType = z.enum(["gasoline", "diesel", "electric", "hybrid", "other"]);
export const TransmissionType = z.enum(["manual", "automatic", "other"]);
export const VehicleStatus = z.enum(["active", "inactive"]);
export const Colors = z.enum(Object.keys(colorMap) as [string, ...string[]]);

export const vehicleFormSchema = z
  .object({
    vehicleType: VehicleType,
    make: z.string().min(1, { message: "Make is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear() + 1, {
      message: `Year must be between 1900 and ${new Date().getFullYear() + 1}`,
    }),
    vin: z.string().length(17, { message: "VIN must be exactly 17 characters" }),
    fuelType: FuelType,
    color: Colors,
    licensePlateNumber: z.string().min(1, { message: "License plate is required" }),
    registration: z.string().min(1, { message: "Registration is required" }),
    odometerReading: z.number().int().min(0, { message: "Odometer reading cannot be negative" }),
    technicalInspectionDate: z.date(),
    insurancePolicyDate: z.date(),
    status: VehicleStatus,
    notes: z.string().optional(),
    customMake: z.string().optional(),
    customModel: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.make === "Other" && (!data.customMake || data.customMake.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Custom make is required when 'Other' is selected",
      path: ["customMake"],
    }
  )
  .refine(
    (data) => {
      if (data.model === "Other" && (!data.customModel || data.customModel.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Custom model is required when 'Other' is selected",
      path: ["customModel"],
    }
  );

export type Vehicle = {
  uid: string;
  vehicleType: z.infer<typeof VehicleType>;
  make: string;
  model: string;
  year: string;
  vin: string;
  fuelType: z.infer<typeof FuelType>;
  color: z.infer<typeof Colors>;
  licensePlateNumber: string;
  registration: string;
  odometerReading: number;
  technicalInspectionDate: Timestamp;
  insurancePolicyDate: Timestamp;
  status: z.infer<typeof VehicleStatus>;
  notes?: string;
  photosURL?: string[];
};
