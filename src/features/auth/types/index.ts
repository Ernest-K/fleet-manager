import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must contain at least 6 characters" }),
});

export type User = {
  uid: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
};
