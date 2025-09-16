import { AuthTokens } from "./types";

const ACCESS_KEY = "auth.tokenAccess";
const REFRESH_KEY = "auth.tokenRefresh";
const EXP_MS_KEY = "auth.tokenExpiration";

const numToStr = (n: number | null): string => {
  return String(n);
};

const strToNum = (s: string | null): number | null => {
  if (s == null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

export class TokenService {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  getExpMs(): number | null {
    return strToNum(localStorage.getItem(EXP_MS_KEY));
  }

  getTokens(): AuthTokens | null {
    const access = this.getAccessToken();
    if (!access) return null;

    const refresh = this.getRefreshToken();
    if (!refresh) return null;

    const accessExp = this.getExpMs();
    if (!accessExp) return null;

    return {
      access,
      refresh,
      accessExp,
    };
  }

  setTokens(tokens: AuthTokens) {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    if (tokens.refresh) {
      localStorage.setItem(REFRESH_KEY, tokens.refresh);
    }
    if (tokens.accessExp) {
      localStorage.setItem(EXP_MS_KEY, numToStr(tokens.accessExp));
    }
  }

  clearTokens() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EXP_MS_KEY);
  }
}
