import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7070';

const apiClient = axios.create({
  baseURL: API_URL,
});

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default apiClient;
