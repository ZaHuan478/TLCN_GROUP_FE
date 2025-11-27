import { apiClient } from '../services/apiClient';
import { SearchAllResponse, SearchCompany, SearchCourse, SearchParams, SearchUser } from '../types/types';

const searchApi = {
  searchAll: async (query: string, limit: number = 10): Promise<SearchAllResponse> => {
    try {
      const url = `/search?q=${encodeURIComponent(query)}&type=all&limit=${limit}`;
      const data = await apiClient.get<SearchAllResponse>(url);
      
      if (!data) {
        return {
          users: [],
          companies: [],
          courses: []
        };
      }
      
      return data;
    } catch (error: any) {
      return {
        users: [],
        companies: [],
        courses: []
      };
    }
  },

  search: async (params: SearchParams): Promise<SearchAllResponse> => {
    const { q, type = 'all', limit = 10 } = params;
    const response = await apiClient.get(
      `/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`
    ) as any;
    return response.data;
  },

  searchUsers: async (query: string, limit: number = 10): Promise<SearchUser[]> => {
    const response = await apiClient.get(
      `/search/users?q=${encodeURIComponent(query)}&limit=${limit}`
    ) as any;
    return response.data;
  },

  searchCompanies: async (query: string, limit: number = 10): Promise<SearchCompany[]> => {
    const response = await apiClient.get(
      `/search/companies?q=${encodeURIComponent(query)}&limit=${limit}`
    ) as any;
    return response.data;
  },

  searchCourses: async (query: string, limit: number = 10): Promise<SearchCourse[]> => {
    const response = await apiClient.get(
      `/search/courses?q=${encodeURIComponent(query)}&limit=${limit}`
    ) as any;
    return response.data;
  },
};

export default searchApi;
