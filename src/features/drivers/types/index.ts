import { User } from "@/features/auth/types";
import { phoneRegex } from "@/lib/utils";
import { z } from "zod";

export const DriverStatus = z.enum(["active", "inactive"]);

export const createDriverFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().regex(phoneRegex, "Invalid number").optional().or(z.literal("")),
  licenseNumber: z.string().optional().or(z.literal("")),
  status: DriverStatus,
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must contain at least 6 characters" }),
});

export const editDriverFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().regex(phoneRegex, "Invalid number").optional().or(z.literal("")),
  licenseNumber: z.string().optional().or(z.literal("")),
  status: DriverStatus,
});

export type Driver = User & {
  documents: Document[];
  phone: string;
  licenseNumber?: string;
  status: z.infer<typeof DriverStatus>;
};
