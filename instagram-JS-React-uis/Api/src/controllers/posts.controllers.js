import {
  addCommentToPost,
  createPostForUser,
  deletePostById,
  getPostById,
  toggleLikeOnPost,
  updatePostById
} from '../services/posts.services.js';
import { toSimplePost } from '../utils/dto.utils.js';

const resolveErrorStatus = (error) => {
  if (error.message?.toLowerCase().includes('not found')) {
    return 404;
  }

  return 400;
};

const isValidUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const createPost = (req, res) => {
  const { image, description } = req.body;
  const { system, user } = req;

  if (!image || !description) {
    return res.status(400).json({ error: 'image and description are required' });
  }

  if (!isValidUrl(image)) {
    return res.status(400).json({ error: 'image must be a valid URL' });
  }

  try {
    const post = createPostForUser(system, user.userId, { image, description });
    res.status(200).json(toSimplePost(post));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};

export const getPost = (req, res) => {
  const { postId } = req.params;
  const { system } = req;

  try {
    const post = getPostById(system, postId);
    res.status(200).json(toSimplePost(post));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};

export const updatePost = (req, res) => {
  const { postId } = req.params;
  const { image, description } = req.body;
  const { system, user } = req;

  if (!image || !description) {
    return res.status(400).json({ error: 'image and description are required' });
  }

  if (!isValidUrl(image)) {
    return res.status(400).json({ error: 'image must be a valid URL' });
  }

  try {
    const existingPost = getPostById(system, postId);
    if (existingPost.user.id !== user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedPost = updatePostById(system, postId, {
      image,
      description
    });

    res.status(200).json(toSimplePost(updatedPost));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};

export const deletePost = (req, res) => {
  const { postId } = req.params;
  const { system, user } = req;

  try {
    const existingPost = getPostById(system, postId);
    if (existingPost.user.id !== user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    deletePostById(system, postId);
    res.status(204).send();
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};

export const likePost = (req, res) => {
  const { postId } = req.params;
  const { system, user } = req;

  try {
    const post = toggleLikeOnPost(system, postId, user.userId);
    res.status(200).json(toSimplePost(post));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};

export const commentPost = (req, res) => {
  const { postId } = req.params;
  const { body } = req.body;
  const { system, user } = req;

  if (!body) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const post = addCommentToPost(system, postId, user.userId, body);
    res.status(200).json(toSimplePost(post));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};