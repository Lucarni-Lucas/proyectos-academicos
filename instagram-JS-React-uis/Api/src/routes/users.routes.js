import express from 'express';
import { getUser, getTimeline, followUser } from '../controllers/users.controllers.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/user', authenticate, getTimeline);
router.get('/user/:userId', getUser);
router.put('/users/:userId/follow', authenticate, followUser);

export default router;
