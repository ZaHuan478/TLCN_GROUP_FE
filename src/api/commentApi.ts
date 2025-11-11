import { apiClient } from "../services/apiClient";
import { CommentAuthor, Comment, CreateCommentPayload, UpdateCommentPayload, CommentListResponse, RawCommentListResponse, RawComment, RawCommentAuthor } from "../types/types";


const normalizeAuthor = (raw: RawCommentAuthor | undefined): CommentAuthor => ({
    id: raw?.id ?? "",
    username: raw?.username ?? "Unknown",
    fullName: raw?.fullName,
});

const normalizeComment = (raw: RawComment): Comment => ({
    id: raw?.id ?? "",
    blogId: raw?.blogId ?? raw?.postId ?? "",
    content: raw?.content ?? "",
    author: normalizeAuthor(raw?.author ?? raw?.User),
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt,
    parentId: raw?.parentId ?? null,
    replies: Array.isArray(raw?.replies) ? raw.replies.map(normalizeComment) : [],
});

export const commentApi = {
    getByBlogId: async (blogId: string, params?: { page?: number; limit?: number }): Promise<CommentListResponse> => {
        try {
            const res = await apiClient.get<RawCommentListResponse>(`/comments/${blogId}`, { params });
            const normalizedComments = Array.isArray(res?.comments) ? res.comments.map(normalizeComment) : [];

            return {
                total: res?.total ?? normalizedComments.length,
                comments: normalizedComments,
                currentPage: res?.currentPage ?? params?.page ?? 1,
                totalPages: res?.totalPages ?? 1,
            };
        } catch (error) {
            console.error("commentApi.getByBlogId error:", error);
            return {
                total: 0,
                comments: [],
                currentPage: params?.page ?? 1,
                totalPages: 0,
            };
        }
    },

    create: async (data: CreateCommentPayload): Promise<Comment> => {
        const response = await apiClient.post<RawComment>(`/comments`, data);
        return normalizeComment(response);
    },

    update: async (commentId: string, data: UpdateCommentPayload): Promise<Comment> => {
        try {
            const response = await apiClient.put<RawComment>(`/comments/${commentId}`, data);
            return normalizeComment(response);
        } catch (error: any) {
            console.error('commentApi.update error:', error);
            throw error;
        }
    },

    delete: async (commentId: string): Promise<void> => {
        try {
            await apiClient.delete(`/comments/${commentId}`);
        } catch (error: any) {
            console.error('commentApi.delete error:', error);
            throw error;
        }
    }
};