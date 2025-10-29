import { apiClient } from "./apiClient";
import { User, LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest, RegisterResponse } from "../types/types";
import { storage } from "../helper/storage";


class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<{ data: LoginResponse }>("/auth", credentials);

    apiClient.setAuthTokens(data.accessToken, data.refreshToken);
    storage.setUser(data.user);

    return data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const { data } = await apiClient.post<{ data: RefreshTokenResponse }>(
      "/auth/refresh-token",
      { refreshToken }
    );
    return data;
  }

  async logout(): Promise<void> {
    try {
      if (this.isAuthenticated()) {
        await apiClient.post("/auth/logout");
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      this.clearSession();
    }
  }

  async resetPassword(
    username: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<any> {
    try {
      const data = await apiClient.post<{ message: string }>(
        "/auth/reset-password", {
          username,
          newPassword,
          confirmNewPassword,
        }
      );
      return data;
    } catch (error: any) {
      throw error.response?.data || { message: "Unable to reset password" };
    }
  }

  async verifyOTP(username: string, otp: string): Promise<{ message: string }> {
    try {
      const data = await apiClient.post<{ message: string }>("/auth/verify-otp", { username, otp });
      return data;
    } catch(error: any) {
      const message = error.response?.data?.message || error.message || "OTP verification failed";
      throw { message };
    }
  }

  async verifyUsername(username: string): Promise<{ message: string }> {
    try {
      const data  = await apiClient.post<{ message: string }>("/auth/verify-username", { username });
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Username verification failed";
      throw { message };
    }
  }

  clearSession(): void {
    apiClient.clearAuthTokens();
    storage.clearUser();
    storage.clearTokens();
  }

  getCurrentUser(): User | null {
    return storage.getUser();
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated() && !!storage.getUser();
  }

  getAccessToken(): string | null {
    return storage.getAccessToken();
  }

  getRefreshToken(): string | null {
    return storage.getRefreshToken();
  }

  // Google OAuth
  initiateGoogleLogin(): void {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${baseUrl}/auth/google`;
  }

  handleOAuthCallback(): { accessToken: string; refreshToken: string } | null {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      apiClient.setAuthTokens(accessToken, refreshToken);

      // Xóa query khỏi URL
      window.history.replaceState({}, document.title, window.location.pathname);

      return { accessToken, refreshToken };
    }
    return null;
  }

  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    await apiClient.post("/users", {
      email: credentials.email,
      username: credentials.userName,
      fullName: credentials.userName,
      role: credentials.role ?? null,
      password: credentials.password,
      provider: "LOCAL",
    });

    return this.login({
      username: credentials.userName,
      password: credentials.password,
    }) as Promise<RegisterResponse>;
  }
}

export const authService = new AuthService();