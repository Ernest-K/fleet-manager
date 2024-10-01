import { User } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";
import { Timestamp } from "firebase/firestore";

export const enum CollectionNames {
  Users = "users",
  Vehicles = "vehicles",
  Assignments = "assignments",
  Documents = "documents",
  Issues = "issues",
  Services = "services",
  Inspections = "inspections",
}

export type VehicleEvent = AuditFields & {
  uid: string;
  createdByUser: User | undefined;
  vehicleUid: string;
  vehicle: Vehicle | undefined;
};

export type AuditFields = {
  createdBy: string;
  createdAt: Timestamp;
};
