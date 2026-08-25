import apiClient from './client';

export const searchRequest = (query) => {
  return apiClient.get('/search', {
    params: { query: query },
  });
};
