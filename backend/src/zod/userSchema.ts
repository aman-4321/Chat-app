import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "password must contain atleast 6 characters")
    .max(20),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});
