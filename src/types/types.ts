export type User = {
  id: string; // Keep original id for backward compatibility
  studentId?: string; // For STUDENT role
  companyId?: string; // For COMPANY role
  fullName: string;
  userName: string;
  email: string;
  role: "STUDENT" | "COMPANY" | "ADMIN" | null;
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

export type RegisterRequest = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "STUDENT" | "COMPANY" | "ADMIN";
};

export type RegisterResponse = LoginResponse;

export type TestQuestion = {
  id: string;
  question: string;
  options: string[];
}

export type CareerTestResponse = {
  questions: TestQuestion[];
}