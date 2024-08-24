import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters" }),
});

export { loginFormSchema, registerFormSchema };
