import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));
export const requiredString = z
  .string()
  .trim()
  .min(1, { message: "This field is required" });

export const leadFormSchema = z.object({
  name: requiredString,
  age: requiredString,
  gender: requiredString,
  email: requiredString,
  phoneNumber: optionalString,
  address: optionalString,
  city: optionalString,
  state: optionalString,
  pincode: optionalString,
  country: optionalString,
  leadType: optionalString,
  physioPreference: optionalString,
  leadSource: optionalString,
  leadStatus: optionalString,
  condition: optionalString,
  treatment: optionalString,
  assignedTo: optionalString,
});

export const appointmentFormSchema = z.object({
  appointmentDate: requiredString,
  appointmentTime: requiredString,
  appointmentType: requiredString,
  status: requiredString,
  comments: optionalString,
});
