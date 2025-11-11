import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { tokenStorage, userStorage } from "../helper/storage";

type ApiResponse<T> = { data: T };

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 20000,
      headers: { "Content-Type": "application/json" },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = tokenStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch {
            this.logoutOnAuthFailure();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
        `${this.baseURL}/auth/refresh-token`,
        { refreshToken }
      );
      const { accessToken } = data.data;
      tokenStorage.setTokens(accessToken, refreshToken);
      return accessToken;
    } catch {
      throw new Error("Refresh token failed");
    }
  }

  private logoutOnAuthFailure() {
    tokenStorage.clear();
    userStorage.clear();
    window.location.href = "/signin";
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<ApiResponse<T>>(url, config);
    return res.data.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<ApiResponse<T>>(url, data, config);
    return res.data.data;
  }

  async postFormData<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<ApiResponse<T>>(url, data, config);
    return res.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<ApiResponse<T>>(url, config);
    return res.data.data;
  }

  // Auth helpers
  setAuthTokens(accessToken: string, refreshToken: string) {
    tokenStorage.setTokens(accessToken, refreshToken);
  }

  clearAuthTokens() {
    tokenStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!tokenStorage.getAccessToken();
  }
}

export const apiClient = new ApiClient();