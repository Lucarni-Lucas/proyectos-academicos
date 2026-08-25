import { AxiosResponse } from 'axios';
import { SimpleUser, Post } from '@/types';
import apiClient from './client';

export interface SearchResponse {
  users?: SimpleUser[];
  posts?: Post[];
}

export const searchRequest = (query: string): Promise<AxiosResponse<SearchResponse>> => {
  return apiClient.get<SearchResponse>('/search', {
    params: { query },
  });
};