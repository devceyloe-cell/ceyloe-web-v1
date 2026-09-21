import { z } from "zod";

/**
 * Centralized validation schemas for all user-facing inputs.
 * Use these schemas to validate request bodies before processing.
 */

export const EmailSchema = z
  .string()
  .email("Enter a valid email address")
  .max(200, "Email too long")
  .toLowerCase()
  .trim();

export const ContactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: EmailSchema,
  phone: z.string().trim().max(20, "Phone too long").optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message too long"),
});

export const AppointmentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: EmailSchema,
  date: z.string().trim().min(1, "Date is required"),
  time: z.enum(["morning", "afternoon", "evening"]).default("morning"),
  type: z.enum(["in-person", "video", "phone"]).default("video"),
  notes: z.string().trim().max(1000, "Notes too long").optional(),
});

export const WholesaleInquirySchema = z.object({
  company: z.string().trim().min(1, "Company name is required").max(200, "Company name too long"),
  contactName: z.string().trim().min(1, "Contact name is required").max(100, "Contact name too long"),
  email: EmailSchema,
  phone: z.string().trim().max(20, "Phone too long").optional(),
  businessType: z.string().trim().max(100, "Business type too long").optional(),
  message: z.string().trim().max(2000, "Message too long").optional(),
});

export const CustomJewelryInquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: EmailSchema,
  phone: z.string().trim().max(20, "Phone too long").optional(),
  details: z.string().trim().min(1, "Details are required").max(2000, "Details too long"),
  budget: z.string().trim().max(50, "Budget too long").optional(),
});

export const LoginSchema = z.object({
  email: EmailSchema,
});

export const VerifyOtpSchema = z.object({
  email: EmailSchema,
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
    .length(6, "OTP must be exactly 6 digits"),
});

export const AdminLoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(100, "Username too long"),
  password: z.string().min(1, "Password is required").max(200, "Password too long"),
});

export const AdminVerifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
    .length(6, "OTP must be exactly 6 digits"),
});

export const AdminSecuritySettingsSchema = z.object({
  mfaEnabled: z.boolean(),
  email: EmailSchema.optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type AppointmentData = z.infer<typeof AppointmentSchema>;
export type WholesaleInquiryData = z.infer<typeof WholesaleInquirySchema>;
export type CustomJewelryInquiryData = z.infer<typeof CustomJewelryInquirySchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type VerifyOtpData = z.infer<typeof VerifyOtpSchema>;
export type AdminLoginData = z.infer<typeof AdminLoginSchema>;
export type AdminVerifyOtpData = z.infer<typeof AdminVerifyOtpSchema>;
export type AdminSecuritySettingsData = z.infer<typeof AdminSecuritySettingsSchema>;
