import { getPostsByUserId } from './posts.services.js';

export const getUserById = (system, userId) => {
  return system.getUser(userId);
};

export const getUserPosts = (system, userId) => {
  return getPostsByUserId(system, userId);
};

export const getUserTimeline = (system, userId) => {
  const timelinePosts = system.timeline(userId);
  const ownPosts = getPostsByUserId(system, userId);
  const seen = new Set();

  const merged = [...timelinePosts, ...ownPosts].filter((post) => {
    if (!post?.id || seen.has(post.id)) return false;
    seen.add(post.id);
    return true;
  });

  return merged.sort(
    (a, b) => (b.date?.getTime?.() ?? 0) - (a.date?.getTime?.() ?? 0),
  );
};

export const toggleFollowUser = (system, userId, targetUserId) => {
  if (userId === targetUserId) {
    throw new Error("Can't add yourself as a friend");
  }
  system.updateFollower(userId, targetUserId);
  return system.getUser(userId);
};
