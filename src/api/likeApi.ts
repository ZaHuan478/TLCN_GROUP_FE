import { apiClient } from "../services/apiClient";

export type LikeInfo = {
  liked: boolean;
  count: number;
};

export const likeApi = {
  getByBlogId: async (blogId: string): Promise<LikeInfo> => {
    try {
      const response = await apiClient.get<any>(`/like/${blogId}`);
      if (response && typeof response === "object") {
        const liked = !!response.liked;
        const count = Number(response.count ?? 0);
        return { liked, count };
      }

      return { liked: false, count: 0 };
    } catch (error: any) {
      console.error("[likeApi] getByBlogId error:", error);
      throw error;
    }
  },

  toggleLike: async (blogId: string): Promise<LikeInfo> => {
    try {
      const response = await apiClient.post<any>(`/like/${blogId}`);
      if (response && typeof response === "object") {
        const liked = !!response.liked;
        const count = Number(response.count ?? 0);
        return { liked, count };
      }

      return { liked: false, count: 0 };
    } catch (error: any) {
      console.error("[likeApi] toggleLike error:", error);
      throw error;
    }
  },
};

