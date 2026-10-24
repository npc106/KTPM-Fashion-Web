import type { TFunction } from "i18next";
import type { LoginRequest } from "./auth.types";

export interface LoginErrors {
  email?: string;
  password?: string;
}

export function validateLogin(
  values: LoginRequest,
  t: TFunction,
): LoginErrors {
  const errors: LoginErrors = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = t("invalidEmail");
  }

  if (!values.password) {
    errors.password = t("requiredPassword");
  }

  return errors;
}
