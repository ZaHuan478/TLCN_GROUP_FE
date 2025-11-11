import { apiClient } from "../services/apiClient";

export type Blog = {
    id: string;
    title: string;
    content: string;
    author: string | {
        id: string;
        username: string
    };
    images?: string[];
    createdAt: string;
}

export type CreateBlogPayLoad = {
    content: string;
    images?: File[];
}



export const blogApi = {
    getAll: async (forceRefresh = false): Promise<Blog[]> => {
        try {
            const headers: any = {};
            if (forceRefresh) {
                headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                headers['Pragma'] = 'no-cache';
                headers['Expires'] = '0';
            }

            const response = await apiClient.get<any>('/blogs', { headers });
            console.log('blogApi.getAll response:', response);

            let blogs: Blog[] = [];

            if (response && response.blogs && Array.isArray(response.blogs)) {
                blogs = response.blogs;
            } else if (Array.isArray(response)) {
                blogs = response;
            } else {
                console.warn('Unexpected response format:', typeof response, response);
                localStorage.removeItem('blogs_cache');
                return [];
            }

            // Cache the blogs array
            localStorage.setItem('blogs_cache', JSON.stringify(blogs));
            localStorage.setItem('blogs_last_fetch', Date.now().toString());
            return blogs;
        } catch (error) {
            console.error('blogApi.getAll error:', error);

            // Chỉ dùng cache nếu không phải là lần đầu load và không force refresh
            if (!forceRefresh) {
                const cached = localStorage.getItem('blogs_cache');
                const lastFetch = localStorage.getItem('blogs_last_fetch');
                const cacheAge = lastFetch ? Date.now() - parseInt(lastFetch) : Infinity;

                // Chỉ dùng cache nếu không quá 5 phút
                if (cached && cacheAge < 300000) {
                    console.log('Using cached blogs due to API error (cache age:', cacheAge, 'ms)');
                    return JSON.parse(cached);
                }
            }

            // Xóa cache cũ và trả về mảng rỗng
            localStorage.removeItem('blogs_cache');
            localStorage.removeItem('blogs_last_fetch');
            return [];
        }
    },
    getById: async (id: string): Promise<Blog | null> => {
        try {
            const response = await apiClient.get<Blog>(`/blogs/${id}`);
            return response;
        } catch (error) {
            console.error('blogApi.getById error:', error);
            return null;
        }
    },

    create: async (data: CreateBlogPayLoad): Promise<Blog> => {
        try {
            // Nếu có images, sử dụng FormData để upload
            if (data.images && data.images.length > 0) {
                const formData = new FormData();
                formData.append('content', data.content);

                // Append each image file
                data.images.forEach((image) => {
                    formData.append(`images`, image);
                });

                const response = await apiClient.postFormData<Blog>('/blogs', formData);
                console.log('blogApi.create (with images) response:', response);

                // Update cache with new blog
                const cached = localStorage.getItem('blogs_cache');
                const blogs = cached ? JSON.parse(cached) : [];
                const updatedBlogs = [response, ...blogs];
                localStorage.setItem('blogs_cache', JSON.stringify(updatedBlogs));

                return response;
            } else {
                // Không có images, gửi JSON như bình thường
                const response = await apiClient.post<Blog>('/blogs', { content: data.content });
                console.log('blogApi.create response:', response);

                // Update cache with new blog
                const cached = localStorage.getItem('blogs_cache');
                const blogs = cached ? JSON.parse(cached) : [];
                const updatedBlogs = [response, ...blogs];
                localStorage.setItem('blogs_cache', JSON.stringify(updatedBlogs));

                return response;
            }
        } catch (error) {
            console.error('blogApi.create error:', error);

            // If API fails, create a mock blog with temp ID for offline mode
            const errorObj = error as any;
            if (errorObj?.message?.includes('Network Error') || errorObj?.code === 'ECONNREFUSED') {
                const mockBlog: Blog = {
                    id: 'temp_' + Date.now(),
                    title: 'Untitled', // Default title since backend doesn't use it
                    content: data.content,
                    author: 'You',
                    createdAt: new Date().toISOString()
                };

                // Add to cache
                const cached = localStorage.getItem('blogs_cache');
                const blogs = cached ? JSON.parse(cached) : [];
                const updatedBlogs = [mockBlog, ...blogs];
                localStorage.setItem('blogs_cache', JSON.stringify(updatedBlogs));

                console.log('Created offline blog:', mockBlog);
                return mockBlog;
            }

            throw error;
        }
    },

    update: async (id: string, data: { content: string }): Promise<Blog> => {
        try {
            const response = await apiClient.put<Blog>(`/blogs/${id}`, data);
            return response;
        } catch (error) {
            console.error('blogApi.update error:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/blogs/${id}`);
        } catch (error) {
            console.error('blogApi.delete error:', error);
            throw error;
        }
    },

    // Helper functions for cache management
    clearCache: () => {
        localStorage.removeItem('blogs_cache');
    },

    getCachedBlogs: (): Blog[] => {
        const cached = localStorage.getItem('blogs_cache');
        return cached ? JSON.parse(cached) : [];
    }
}