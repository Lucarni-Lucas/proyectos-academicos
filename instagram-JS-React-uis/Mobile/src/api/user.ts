import { AxiosResponse } from 'axios';
import apiClient from './client';
import { ProfileData } from '@/types';

export const getUserProfileRequest = <T = ProfileData>(targetId: string): Promise<AxiosResponse<T>> => {
  return apiClient.get<T>(`/user/${targetId}`);
};

export const toggleFollowRequest = (targetId: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.put<unknown>(`/users/${targetId}/follow`);
};
