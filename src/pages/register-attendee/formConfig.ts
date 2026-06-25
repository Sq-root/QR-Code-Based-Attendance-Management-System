import * as z from "zod";
import type { RegisterAttendeeRequest } from "../../types";

export const emptyRegisterForm: RegisterAttendeeRequest = {
  fullName: "",
  gender: "",
  age: "",
  standard: "",
  fatherName: "",
  fatherPhone: "",
  motherName: "",
  motherPhone: "",
  residentialSuburb: "",
  whoWillAttend: "",
  referenceName: "",
};

export const standardOptions = [
  "Pre school",
  "Pre primary",
  "1st to 4th",
  "5th to 8th",
  "9th to 10th",
];

export const residentialSuburbOptions = [
  "Virar",
  "Nalasopara",
  "Vasai",
  "Mira-bhayander",
  "Dahisar",
  "Borivali",
  "Kandivali",
  "Malad",
  "Goregoan",
  "Andheri",
  "VileParle",
  "Santacruz",
  "South Mumbai",
];

export const whoWillAttendOptions = [
  "Both Parent Coming",
  "Only Mother Coming",
  "Only Father Coming",
  "Guardian Coming",
];

const requiredText = (message: string) => z.string().trim().min(1, message);

export const registerAttendeeSchema = z.object({
  fullName: requiredText("Child full name is required."),
  gender: requiredText("Gender is required."),
  age: requiredText("Age is required."),
  standard: requiredText("Standard is required."),
  fatherName: requiredText("Father full name is required."),
  fatherPhone: requiredText("Father WhatsApp is required."),
  motherName: requiredText("Mother full name is required."),
  motherPhone: z.string().trim(),
  residentialSuburb: requiredText("Residential suburb is required."),
  whoWillAttend: requiredText("Who will attend is required."),
  referenceName: requiredText("Reference name is required."),
});

export type RegisterAttendeeFormData = z.infer<typeof registerAttendeeSchema>;
