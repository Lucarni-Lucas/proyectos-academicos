import axios, { AxiosInstance } from 'axios';

const API_URL: string | undefined = process.env.EXPO_PUBLIC_API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
});

let onUnauthorizedCallback: (() => void) | null = null;

export const registerUnauthorizedHandler = (handler: () => void): void => {
  onUnauthorizedCallback = handler;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;