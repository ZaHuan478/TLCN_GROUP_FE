import { apiClient } from "./apiClient";

export type User = {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  role: "STUDENT" | "COMPANY" | "ADMIN";
  isActive: boolean;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
};

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<{ data: LoginResponse }>(
      "/auth",
      credentials
    );

    apiClient.setAuthTokens(
      response.data.accessToken,
      response.data.refreshToken
    );

    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<{ data: RefreshTokenResponse }>(
      "/auth/refresh-token",
      {
        refreshToken,
      }
    );

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      apiClient.clearAuthTokens();
      localStorage.removeItem("user");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated() && !!localStorage.getItem("user");
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  // Google OAuth
  initiateGoogleLogin(): void {
    const googleAuthUrl = `${
      import.meta.env.VITE_API_URL || "http://localhost:3000/api"
    }/auth/google`;
    window.location.href = googleAuthUrl;
  }

  // Xử lý OAuth callback (từ URL params)
  handleOAuthCallback(): { accessToken: string; refreshToken: string } | null {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken && refreshToken) {
      apiClient.setAuthTokens(accessToken, refreshToken);

      // Làm sạch URL
      window.history.replaceState({}, document.title, window.location.pathname);

      return { accessToken, refreshToken };
    }

    return null;
  }
}

export const authService = new AuthService();