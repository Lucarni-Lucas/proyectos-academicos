import { AxiosResponse } from 'axios';
import apiClient from './client';

export const loginRequest = (email: string, password: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.post<unknown>('/login', { email, password });
};

export const registerRequest = (
  name: string,
  email: string,
  password: string,
  image?: string
): Promise<AxiosResponse<unknown>> => {
  return apiClient.post<unknown>('/register', { name, email, password, image });
};
