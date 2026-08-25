import { Post, RawApiPost, Like, Comment } from '@/types';

export const normalizePost = (
  post: RawApiPost | unknown,
  currentUserId?: string
): Post | null => {
  if (!post || typeof post !== 'object') return null;

  const rawPost = post as Record<string, unknown>;

  const likes = Array.isArray(rawPost.likes) ? (rawPost.likes as Like[]) : [];
  const comments = Array.isArray(rawPost.comments) ? rawPost.comments : [];

  const rawUser = typeof rawPost.user === 'object' && rawPost.user !== null 
    ? (rawPost.user as Record<string, unknown>) 
    : {};

  const user = {
    id: String(rawUser.id ?? ''),
    name: String(rawUser.name ?? ''),
    image: String(rawUser.image ?? ''),
  };

  const normalizedComments: Comment[] = comments.map((comment: unknown): Comment => {
    if (!comment || typeof comment !== 'object') {
      return {
        id: '',
        body: '',
        user: { id: '', name: '', image: '' }
      };
    }
    const c = comment as Record<string, unknown>;
    const cUser = typeof c.user === 'object' && c.user !== null 
      ? (c.user as Record<string, unknown>) 
      : {};
    return {
      id: String(c.id ?? ''),
      body: String(c.body ?? c.text ?? ''),
      user: {
        id: String(cUser.id ?? ''),
        name: String(cUser.name ?? ''),
        image: String(cUser.image ?? ''),
      },
      createdAt: typeof c.createdAt === 'string' ? c.createdAt : undefined
    };
  });

  const createdAt = String(rawPost.date ?? rawPost.createdAt ?? new Date().toISOString());
  const isLiked = currentUserId ? likes.some((like) => like && String(like.id) === String(currentUserId)) : false;

  return {
    id: String(rawPost.id ?? ''),
    image: String(rawPost.image ?? ''),
    description: String(rawPost.description ?? ''),
    user,
    likes,
    comments: normalizedComments,
    createdAt,
    likesCount: likes.length,
    commentsCount: normalizedComments.length,
    isLiked,
  };
};
