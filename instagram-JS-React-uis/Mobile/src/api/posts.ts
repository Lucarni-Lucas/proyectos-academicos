import { AxiosResponse } from 'axios';
import apiClient from './client';

export const getFeedRequest = (endpoint: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.get<unknown>(endpoint);
};

export const getPostDetailRequest = (id: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.get<unknown>(`/posts/${id}`);
};

export const createPostRequest = (image: string, description: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.post<unknown>('/posts', { image, description });
};

export const updatePostRequest = (id: string, image: string, description: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.put<unknown>(`/posts/${id}`, { image, description });
};

export const deletePostRequest = (id: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.delete<unknown>(`/posts/${id}`);
};

export const toggleLikeRequest = (postId: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.put<unknown>(`/posts/${postId}/like`);
};

export const addCommentRequest = (postId: string, body: string): Promise<AxiosResponse<unknown>> => {
  return apiClient.post<unknown>(`/posts/${postId}/comment`, { body });
};
