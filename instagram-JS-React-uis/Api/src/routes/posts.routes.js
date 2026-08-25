import express from 'express';
import { createPost, getPost, updatePost, deletePost, likePost, commentPost } from '../controllers/posts.controllers.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/posts', authenticate, createPost);
router.get('/posts/:postId', getPost);
router.put('/posts/:postId', authenticate, updatePost);
router.delete('/posts/:postId', authenticate, deletePost);
router.put('/posts/:postId/like', authenticate, likePost);
router.post('/posts/:postId/comment', authenticate, commentPost);

export default router;
