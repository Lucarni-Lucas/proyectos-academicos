const normalizeSimpleUser = (user) => {
  if (!user) return user;

  return {
    ...user,
    username: user.username ?? user.name,
    avatarUrl: user.avatarUrl ?? user.image,
  };
};

const normalizeComment = (comment) => {
  if (!comment) return comment;

  return {
    ...comment,
    text: comment.text ?? comment.body,
    user: normalizeSimpleUser(comment.user),
  };
};

const normalizePost = (post) => {
  if (!post) return post;

  const comments = (post.comments ?? []).map(normalizeComment);
  const likes = post.likes ?? [];

  return {
    ...post,
    user: normalizeSimpleUser(post.user),
    comments,
    likes,
    createdAt: post.createdAt ?? post.date,
    likesCount: post.likesCount ?? likes.length,
    commentsCount: post.commentsCount ?? comments.length,
    isLiked: post.isLiked ?? false,
  };
};

const normalizePostForUser = (post, userId) => {
  const normalized = normalizePost(post);
  if (!normalized) return normalized;

  const likes = normalized.likes ?? [];

  return {
    ...normalized,
    isLiked: userId ? likes.some((like) => like.id === userId) : false,
  };
};

const normalizeUser = (user) => {
  if (!user) return user;

  const following = (user.following ?? user.followers ?? []).map(
    normalizeSimpleUser,
  );

  return {
    ...user,
    username: user.username ?? user.name,
    avatarUrl: user.avatarUrl ?? user.image,
    followers: (user.followers ?? []).map(normalizeSimpleUser),
    following,
    posts: (user.posts ?? []).map(normalizePost),
    timeline: (user.timeline ?? []).map(normalizePost),
  };
};

export {
  normalizeSimpleUser,
  normalizeComment,
  normalizePost,
  normalizePostForUser,
  normalizeUser,
};
