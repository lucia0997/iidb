import { AuthTokens, LoginPayload, LoginResponse, User } from "./types";
import { AxiosHttpClient } from "../../api/core";

export class AuthService {
  constructor(private http: AxiosHttpClient) {}

  async login(
    credentials: LoginPayload,
    endpoint?: string
  ): Promise<LoginResponse> {
    const { data } = await this.http.post<LoginResponse>(
      endpoint ?? "/auth/login/",
      credentials
    );
    return data;
  }

  async getUserProfile(endpoint?: string): Promise<User> {
    const { data } = await this.http.get<User>(endpoint ?? "/auth/me/");
    return data;
  }

  async refreshToken(refresh: string, endpoint?: string): Promise<AuthTokens> {
    const { data } = await this.http.post<AuthTokens>(
      endpoint ?? "/auth/refresh/",
      {
        refresh: refresh,
      }
    );
    return data;
  }
}
