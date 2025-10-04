import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));
export const requiredString = z
  .string()
  .trim()
  .min(1, { message: "This field is required" });

export const leadFormSchema = z.object({
  name: requiredString,
  age: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().min(1, { message: "This field is required" })),
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
  assignedTo: optionalString.transform((val) => (val === "" ? null : val)),
});

export const appointmentFormSchema = z.object({
  appointmentDate: requiredString,
  appointmentTime: optionalString,
  appointmentType: requiredString,
  status: requiredString,
  physio:requiredString,
  comments: optionalString,
});

export const recheduleConfirmAppointmentFormSchema = z.object({
  appointmentTime: requiredString,
  status: requiredString,
  comments: optionalString,
});

export const cancelAppointmentFormSchema = z.object({
  status: requiredString,
  comments: optionalString,
});

export const closePatientFormSchema = z.object({
  closeReason: requiredString
});

export const packageFormSchema = z.object({
  packageName: requiredString,
  chargePerSession: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(
      z
        .string()
        .min(0, { message: "This field is required" })
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Must be a valid positive number",
        })
    ),
  totalSession: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(
      z
        .string()
        .min(1, { message: "This field is required" })
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Must be a valid positive number",
        })
    ),
  totalCost: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(
      z
        .string()
        .min(1, { message: "This field is required" })
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Must be a valid positive number",
        })
    ),
  chargePerSessionForPackage: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(
      z
        .string()
        .min(1, { message: "This field is required" })
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Must be a valid positive number",
        })
    ),
});

export const sessionTypeFormSchema = z.object({
  sessionName: requiredString,
  chargePerSession: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .pipe(
      z
        .string()
        .min(0, { message: "This field is required" })
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Must be a valid positive number",
        })
    ),
});

export const checkoutPatientFormSchema = z.object({
  packageId: optionalString,
  sessionTypes: z.array(z.string()).optional(),
  sessionCharges: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === undefined || val === "") return "";
    return String(val);
  }).refine((val) => {
    if (!val || val === "") return true; // Optional field
    return !isNaN(Number(val)) && Number(val) >= 0;
  }, {
    message: "Must be a valid positive number"
  }),
  paymentMode: optionalString,
}).refine((data) => {
  // If packageId is selected or sessionTypes has items, sessionCharges and paymentMode are required
  if ((data.packageId && data.packageId !== "") || (data.sessionTypes && data.sessionTypes.length > 0)) {
    return data.sessionCharges && data.sessionCharges !== "" && data.paymentMode && data.paymentMode !== "";
  }
  return true;
}, {
  message: "Session charges and payment mode are required when a package is selected or session types are chosen",
  path: ["sessionCharges"], // This will show the error on the sessionCharges field
});
