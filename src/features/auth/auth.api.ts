import type { AuthApiError, AuthSession, LoginRequest } from "./auth.types";

const DEMO_ACCOUNT = {
  email: "demo@example.com",
  password: "password123",
};

export async function login(
  request: LoginRequest,
): Promise<AuthSession> {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  if (
    request.email.toLowerCase() !== DEMO_ACCOUNT.email ||
    request.password !== DEMO_ACCOUNT.password
  ) {
    const error: AuthApiError = { code: "INVALID_CREDENTIALS" };
    throw error;
  }

  return {
    accessToken: "mock-access-token",
    user: {
      id: "demo-user",
      email: DEMO_ACCOUNT.email,
      role: "CUSTOMER",
    },
  };
}
