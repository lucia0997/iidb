import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthProviderProps,
  ProactiveRefreshConfig,
} from "./AuthProvider.types";
import {
  AuthStatus,
  AuthTokens,
  LoginPayload,
  LoginResponse,
  User,
} from "../../core/types";
import { AuthService } from "../../core/AuthService";
import { TokenService } from "../../core/TokenService";
import { AuthContext } from "../AuthContext";
import { getExpMs } from "../../core/jwt";
import { attachAuthInterceptors } from "../../../api/core/interceptors/attachAuthInterceptors";
import { useApiClient } from "../../../api/react";

export function AuthProvider({
  children,
  fallback = null,
  options,
}: AuthProviderProps): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("bootstrapping");
  const client = useApiClient();
  const tokenService = new TokenService();
  const navigate = useNavigate();

  const authService = useMemo(() => new AuthService(client), [client]);

  // Refresh token logic
  const doRefresh = React.useCallback(async () => {
    const refToken = tokenService.getRefreshToken();
    if (!refToken) {
      navigate("/login");
      throw new Error("No refresh Token");
    }

    const tokens = await authService.refreshToken(
      refToken,
      options?.refreshEndpoint
    );
    tokenService.setTokens({
      ...tokens,
      accessExp: getExpMs(tokens.access),
    });
    sheduleProactiveRefresh();
  }, [authService, tokenService]);

  const doRefreshRef = useRef(doRefresh);
  useEffect(() => {
    doRefreshRef.current = doRefresh;
  }, [doRefresh]);

  const refreshTimerRef = useRef<number | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current != null) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const sheduleProactiveRefresh = useCallback(
    (
      cfg: ProactiveRefreshConfig | undefined = options?.proactiveRefresh,
      tokens: AuthTokens | null = tokenService.getTokens()
    ) => {
      clearRefreshTimer();

      if (cfg?.mode === "none") return;
      const access = tokens?.access;
      if (!access) return;

      const now = Date.now();
      const exp = tokens?.accessExp ?? getExpMs(access) ?? 0;
      if (!exp || exp <= now) return;

      const skew = cfg?.skewMs ?? 10_000;
      const targetTs = exp - skew;
      let delay = targetTs - now;
      if (delay < 2_000) delay = 2_000;

      refreshTimerRef.current = window.setTimeout(async () => {
        try {
          await doRefreshRef.current?.();
          sheduleProactiveRefresh(cfg);
        } catch {
          // 401 managed by the interceptors
        }
      }, delay);
    },
    [clearRefreshTimer]
  );

  useEffect(() => {
    const detach = attachAuthInterceptors(client, {
      getAccessToken: () => tokenService.getAccessToken() ?? null,
      doRefresh: () => doRefreshRef.current(),
      isRefreshRequest: (cfg) =>
        (cfg.url ?? "").includes(options?.refreshEndpoint ?? "/auth/refresh"),
    });
    return detach;
  }, [client]);

  // Bootstrapping
  const bootstrapPromiseRef = useRef<Promise<User | void> | null>(null);

  const bootstrap = () => {
    if (!bootstrapPromiseRef.current) {
      bootstrapPromiseRef.current = (async () => {
        setStatus("bootstrapping");
        const tokens = tokenService.getTokens();
        if (!tokens) {
          setUser(null);
          setStatus("unauthenticated");
          return;
        }
        const crtl = new AbortController();
        try {
          const userData = await authService.getUserProfile(
            options?.userEndpoint
          );
          if (crtl.signal.aborted) return;
          setUser(userData);
          setStatus("authenticated");
          sheduleProactiveRefresh();
        } catch (e) {
          console.warn("Failed to restore user:", e);
          try {
            const newToken = await authService.refreshToken(
              tokens.refresh ?? "",
              options?.refreshEndpoint
            );
            tokenService.setTokens({
              ...tokens,
              access: newToken.access,
              accessExp: getExpMs(newToken.access),
            });
            const userData = await authService.getUserProfile(
              options?.userEndpoint
            );
            if (crtl.signal.aborted) return;
            setUser(userData);
            setStatus("authenticated");
            sheduleProactiveRefresh();
          } catch {
            tokenService.clearTokens();
            setUser(null);
            setStatus("unauthenticated");
          }
        }
      })().finally(() => {});
    }
    return bootstrapPromiseRef.current;
  };

  useEffect(() => {
    bootstrap();
  });

  const invalidateBootstrap = () => {
    bootstrapPromiseRef.current = null;
  };

  // Public functions
  const login = useCallback(
    async (credentials: LoginPayload): Promise<boolean> => {
      try {
        const tokens: LoginResponse = await authService.login(
          credentials,
          options?.loginEndpoint
        );
        tokenService.setTokens({
          ...tokens,
          accessExp: getExpMs(tokens.access),
        });
        invalidateBootstrap();
        await bootstrap();
        return true;
      } catch (e) {
        console.error("Login error:", e);
        return false;
      }
    },
    [authService, tokenService, bootstrap]
  );

  const logout = useCallback(() => {
    tokenService.clearTokens();
    setUser(null);
    clearRefreshTimer();
    invalidateBootstrap();
    navigate("/login");
  }, [tokenService]);

  const hasPermission = useCallback(
    (perm: string): boolean => {
      return user?.permissions.includes(perm) ?? false;
    },
    [user?.permissions]
  );

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      logout,
      hasPermission,
    }),
    [user, status, login, logout, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
