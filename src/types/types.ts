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
  role?: "STUDENT" | "COMPANY";
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

export type CommentAuthor = {
  id: string;
  username: string;
  fullName?: string;
};

export type Comment = {
  id: string;
  blogId: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
  replies?: Comment[];
}

export type CreateCommentPayload = {
  blogId: string;
  content: string;
  parentId?: string | null;
}

export type UpdateCommentPayload = {
  content: string;
};

export type RawCommentAuthor = {
  id?: string;
  username?: string;
  fullName?: string;
};

export type RawComment = {
  id?: string;
  blogId?: string;
  postId?: string;
  content?: string;
  author?: RawCommentAuthor;
  User?: RawCommentAuthor;
  createdAt?: string;
  updatedAt?: string;
  parentId?: string | null;
  replies?: RawComment[];
};

export type RawCommentListResponse = {
  total?: number;
  comments?: RawComment[];
  currentPage?: number;
  totalPages?: number;
};

export type CommentListResponse = {
  total: number;
  comments: Comment[];
  currentPage: number;
  totalPages: number;
};