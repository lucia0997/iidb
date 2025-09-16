export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  groups: string[];
  permissions: string[];
}
export interface LoginPayload {
  username: string;
  password: string;
}
export interface LoginResponse extends AuthTokens {
  user: User;
}

export type AuthStatus = "bootstrapping" | "authenticated" | "unauthenticated";

export interface AuthTokens {
  access: string;
  refresh?: string;
  accessExp?: number;
}

export type JwtPayload = {
  exp?: number;
  [k: string]: unknown;
};
