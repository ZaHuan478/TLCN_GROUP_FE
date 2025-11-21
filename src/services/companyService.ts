import { apiClient } from "./apiClient";
import { CompanyProfile, UpdateCompanyProfilePayload } from "../types/types";

export const getCompanyProfile = async (): Promise<CompanyProfile> => {
  return apiClient.get<CompanyProfile>('/companies/profile');
};

export const updateCompanyProfile = async (payload: UpdateCompanyProfilePayload): Promise<CompanyProfile> => {
  return apiClient.put<CompanyProfile>('/companies/profile', payload);
};
