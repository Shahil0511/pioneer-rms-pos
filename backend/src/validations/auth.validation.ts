// src/validations/auth.validation.ts
import { z } from "zod";

// Common password requirements
const passwordRequirements = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const sendOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .max(100, "Email must be less than 100 characters"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .max(100, "Email must be less than 100 characters"),
    otp: z
      .string()
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only digits"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    password: passwordRequirements,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .max(100, "Email must be less than 100 characters"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Export types for TypeScript inference
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
