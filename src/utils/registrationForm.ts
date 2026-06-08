import type { UserRegistration } from "../api/types";

export type RegistrationValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  memberTypeId: string;
};

export const initialValues: RegistrationValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  memberTypeId: "",
};

export type FieldConfig = {
  name: keyof RegistrationValues;
  label: string;
  type?: string;
  kind?: "input" | "dropdown";
  placeholder?: string;
};

export const fieldConfig: Record<keyof RegistrationValues, FieldConfig> = {
  memberTypeId: {
    name: "memberTypeId",
    label: "Membership",
    kind: "dropdown",
    placeholder: "Select membership",
  },
  firstName: { name: "firstName", label: "First name" },
  lastName: { name: "lastName", label: "Last name" },
  email: { name: "email", label: "Email", type: "email" },
  phoneNumber: { name: "phoneNumber", label: "Phone number", type: "tel" },
  dateOfBirth: { name: "dateOfBirth", label: "Date of birth", type: "date" },
};

export const steps = [
  { title: "Membership", fields: ["memberTypeId"] },
  {
    title: "Contact",
    fields: ["firstName", "lastName", "email", "phoneNumber", "dateOfBirth"],
  },
  { title: "Review", fields: [] },
] as const satisfies readonly {
  title: string;
  fields: readonly (keyof RegistrationValues)[];
}[];

export function validate(values: RegistrationValues) {
  const errors: Record<string, string> = {};
  if (!values.firstName) errors.firstName = "Enter your first name.";
  if (!values.lastName) errors.lastName = "Enter your last name.";
  if (!values.email.includes("@")) errors.email = "Enter a valid email.";
  if (!values.phoneNumber) errors.phoneNumber = "Enter a phone number.";
  if (!values.dateOfBirth) errors.dateOfBirth = "Enter your date of birth.";
  if (!values.memberTypeId) errors.memberTypeId = "Select a membership type.";
  return errors;
}

export function toUserRegistration(
  values: RegistrationValues
): UserRegistration {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phoneNumber: values.phoneNumber,
    dateOfBirth: values.dateOfBirth,
    memberTypeId: values.memberTypeId,
  };
}
