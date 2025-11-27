import { apiClient } from '../services/apiClient';
import { FollowInfo, FollowersResponse, FollowingResponse } from '../types/types';

const followApi = {
  toggleFollow: async (targetUserId: string): Promise<FollowInfo> => {
    const response = await apiClient.post(`/follows/${targetUserId}`) as any;
    return response.data;
  },

  getFollowInfo: async (targetUserId: string): Promise<FollowInfo> => {
    const response = await apiClient.get(`/follows/${targetUserId}`) as any;
    return response.data;
  },

  getFollowers: async (
    targetUserId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<FollowersResponse> => {
    const response = await apiClient.get(
      `/follows/${targetUserId}/followers?page=${page}&limit=${limit}`
    ) as any;
    return response.data;
  },

  getFollowing: async (
    targetUserId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<FollowingResponse> => {
    const response = await apiClient.get(
      `/follows/${targetUserId}/following?page=${page}&limit=${limit}`
    ) as any;
    return response.data;
  },
};

export default followApi;
