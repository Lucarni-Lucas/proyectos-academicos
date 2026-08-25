const toSimpleUser = (user) => ({
  id: user.id,
  name: user.name,
  image: user.image
});

const toComment = (comment) => ({
  id: comment.id,
  body: comment.body,
  user: toSimpleUser(comment.user)
});

const toSimplePost = (post) => ({
  id: post.id,
  description: post.description,
  image: post.image,
  user: toSimpleUser(post.user),
  date: post.date,
  comments: post.comments.map(toComment),
  likes: post.likes.map(toSimpleUser)
});

const toUser = (user, posts = []) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  image: user.image,
  followers: user.followers.map(toSimpleUser),
  posts: posts.map(toSimplePost)
});

const toUserTimeline = (user, timeline = []) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  image: user.image,
  followers: user.followers.map(toSimpleUser),
  timeline: timeline.map(toSimplePost)
});

const toSearchResult = (users = [], posts = []) => ({
  users: users.map(toSimpleUser),
  posts: posts.map(toSimplePost)
});

export {
  toSimpleUser,
  toComment,
  toSimplePost,
  toUser,
  toUserTimeline,
  toSearchResult
};