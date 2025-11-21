import { apiClient } from "./apiClient";
import { StudentProfile, UpdateStudentProfilePayload } from "../types/types";

export const getStudentProfile = async (): Promise<StudentProfile> => {
  const response = await apiClient.get<any>('/students/profile');
  console.log('🔍 Raw student API response:', response);

  if (response.student) {
    return {
      id: response.id,
      studentId: response.student.id,
      fullName: response.fullName,
      username: response.username,
      email: response.email,
      major: response.student.major,
      school: response.student.school,
      bio: response.bio,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  return response as StudentProfile;
};

export const updateStudentProfile = async (payload: UpdateStudentProfilePayload): Promise<StudentProfile> => {
  const response = await apiClient.put<any>('/students/profile', payload);
  console.log('🔍 Updated student profile response:', response);

  if (response.student) {
    return {
      id: response.id,
      studentId: response.student.id,
      fullName: response.fullName,
      username: response.username,
      email: response.email,
      major: response.student.major,
      school: response.student.school,
      bio: response.bio,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  return response as StudentProfile;
};
