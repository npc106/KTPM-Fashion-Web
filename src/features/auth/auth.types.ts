export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthSession {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
  };
}

export interface AuthApiError {
  code: "INVALID_CREDENTIALS" | "NETWORK_ERROR";
}
