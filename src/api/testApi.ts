import { apiClient } from "../services/apiClient";
import { CreateTestPayload } from "../types/types";

// GET: localhost:5000/tests/:id
export const getTestById = async (id: string) => {
    return apiClient.get(`/tests/${id}`);
};

// POST: localhost:5000/tests
export const createTest = async (payload: CreateTestPayload) => {
    return apiClient.post(`/tests`, payload);
};

// PUT: localhost:5000/tests/:id
export const updateTest = async (id: string, payload: any) => {
    return apiClient.put(`/tests/${id}`, payload);
};

// DELETE: localhost:5000/tests/:id
export const deleteTest = async (id: string) => {
    return apiClient.delete(`/tests/${id}`);
};
