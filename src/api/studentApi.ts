import { apiClient } from '../services/apiClient';

export const submitTest = async (testId: string, score: number, code?: string) => {
    return apiClient.post('/students/submit-test', {
        testId,
        score,
        code
    });
};

export const getCareerPathProgress = async (careerPathId: string) => {
    return apiClient.get(`/students/progress/${careerPathId}`);
};

export const joinCareerPath = async (careerPathId: string) => {
    return apiClient.post('/students/join', {
        careerPathId
    });
};

export const getEnrolledCourses = async () => {
    return apiClient.get('/students/enrolled-courses');
};
