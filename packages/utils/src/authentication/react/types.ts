import { AuthStatus, LoginPayload, User } from "../core/types";

export interface AuthContextProps {
  user: User | null;
  status: AuthStatus;
  login: (credentials: LoginPayload) => Promise<boolean>;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
}
