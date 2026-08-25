import apiClient, { getAuthHeader } from './client';
import { normalizePost } from './normalizers';

export const getPostRequest = (postId) => {
  return apiClient.get(`/posts/${postId}`).then((res) => {
    res.data = normalizePost(res.data);
    return res;
  });
};

export const createPostRequest = (data) => {
  return apiClient
    .post('/posts', data, {
      headers: getAuthHeader(),
    })
    .then((res) => {
      res.data = normalizePost(res.data);
      return res;
    });
};

export const updatePostRequest = (postId, data) => {
  return apiClient
    .put(`/posts/${postId}`, data, {
      headers: getAuthHeader(),
    })
    .then((res) => {
      res.data = normalizePost(res.data);
      return res;
    });
};

export const deletePostRequest = (postId) => {
  return apiClient.delete(`/posts/${postId}`, {
    headers: getAuthHeader(),
  });
};

export const toggleLikeRequest = (postId) => {
  return apiClient
    .put(
      `/posts/${postId}/like`,
      {},
      {
        headers: getAuthHeader(),
      },
    )
    .then((res) => {
      res.data = normalizePost(res.data);
      return res;
    });
};

export const addCommentPostRequest = (postId, body) => {
  return apiClient
    .post(
      `/posts/${postId}/comment`,
      { body },
      {
        headers: getAuthHeader(),
      },
    )
    .then((res) => {
      res.data = normalizePost(res.data);
      return res;
    });
};
