import apiClient from './client';

export const loginRequest = (credentials) => {
  return apiClient.post('/login', credentials);
};

export const registerRequest = (data) => {
  return apiClient.post('/register', data);
};
