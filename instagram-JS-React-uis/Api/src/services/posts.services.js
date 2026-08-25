export const createPostForUser = (system, userId, payload) => {
  const { image, description } = payload;
  return system.addPost(userId, { image, description });
};

export const getPostById = (system, postId) => {
  return system.getPost(postId);
};

export const getPostsByUserId = (system, userId) => {
  return system.getPostByUserId(userId);
};

export const updatePostById = (system, postId, payload) => {
  const { image, description } = payload;
  return system.editPost(postId, { image, description });
};

export const deletePostById = (system, postId) => {
  system.deletePost(postId);
};

export const toggleLikeOnPost = (system, postId, userId) => {
  return system.updateLike(postId, userId);
};

export const addCommentToPost = (system, postId, userId, body) => {
  return system.addComment(postId, userId, { body });
};