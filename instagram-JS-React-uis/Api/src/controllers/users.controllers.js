import { getUserById, getUserPosts, getUserTimeline, toggleFollowUser } from '../services/users.services.js';
import { toUser, toUserTimeline } from '../utils/dto.utils.js';

const resolveErrorStatus = (error) => {
  if (error.message?.toLowerCase().includes('not found')) {
    return 404;
  }

  if (error.message?.toLowerCase().includes("can't follow yourself")) {
    return 400;
  }

  return 400;
};

export const getUser = (req, res) => {
  const { userId } = req.params;
  const { system } = req;

  try {
    const user = getUserById(system, userId);
    const posts = getUserPosts(system, userId);
    res.status(200).json(toUser(user, posts));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};

export const getTimeline = (req, res) => {
  const { system, user } = req;

  try {
    const currentUser = getUserById(system, user.userId);
    const timeline = getUserTimeline(system, user.userId);
    res.status(200).json(toUserTimeline(currentUser, timeline));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};

export const followUser = (req, res) => {
  const { userId } = req.params;
  const { system, user } = req;

  try {
    const updatedUser = toggleFollowUser(system, user.userId, userId);
    res.status(200).json(toUser(updatedUser, []));
  } catch (error) {
    res.status(resolveErrorStatus(error)).json({ error: error.message });
  }
};
