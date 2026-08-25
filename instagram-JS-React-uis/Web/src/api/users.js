import apiClient, { getAuthHeader } from './client';
import { getValidToken, decodeToken } from '../utils/jwt';
import { normalizeUser } from './normalizers';

export const getCurrentUserRequest = () => {
  const token = getValidToken();
  if (!token) return Promise.reject(new Error('No valid token'));

  const decoded = decodeToken(token);
  if (!decoded || !decoded.userId)
    return Promise.reject(new Error('Invalid token payload'));

  return getUserRequest(decoded.userId);
};

export const getUserRequest = (userId) => {
  return apiClient.get(`/user/${userId}`).then((res) => {
    res.data = normalizeUser(res.data);
    return res;
  });
};

export const getTimelineRequest = () => {
  return apiClient
    .get('/user', {
      headers: getAuthHeader(),
    })
    .then((res) => {
      res.data = normalizeUser(res.data);
      return res;
    });
};

export const followUserRequest = (userId) => {
  return apiClient
    .put(
      `/users/${userId}/follow`,
      {},
      {
        headers: getAuthHeader(),
      },
    )
    .then((res) => {
      res.data = normalizeUser(res.data);
      return res;
    });
};
