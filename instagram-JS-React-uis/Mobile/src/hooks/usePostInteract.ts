import { useState } from 'react';
import { toggleLikeRequest, addCommentRequest, deletePostRequest } from '@/api/posts';
import { useAuth } from '@/context/AuthContext';
import { normalizePost } from '@/utils/normalize';
import { Post, Like } from '@/types';
import { AxiosError } from 'axios';

export interface UsePostInteractResult {
  toggleLike: (post: Post, updatePostLocalState: (p: Post) => void) => Promise<Post | undefined>;
  addComment: (body: string) => Promise<Post>;
  deletePost: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function usePostInteract(postId: string | undefined | null): UsePostInteractResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = async (
    post: Post,
    updatePostLocalState: (p: Post) => void
  ): Promise<Post | undefined> => {
    if (!post || !postId) return;
    const currentUserId = user?.id || '';
    const wasLiked = post.isLiked;
    const previousLikes = [...(post.likes ?? [])];
    
    // Optimistic calculation
    let newLikes: Like[];
    if (wasLiked) {
      newLikes = previousLikes.filter(like => like.id !== currentUserId);
    } else {
      const selfSimple = { id: currentUserId, name: user?.name, image: user?.image };
      newLikes = [...previousLikes, selfSimple];
    }

    const optimisticPost: Post = {
      ...post,
      likes: newLikes,
      likesCount: newLikes.length,
      isLiked: !wasLiked
    };

    // Apply optimistic update
    updatePostLocalState(optimisticPost);

    try {
      const response = await toggleLikeRequest(postId);
      const updatedPost = normalizePost(response.data, currentUserId);
      if (updatedPost) {
        updatePostLocalState(updatedPost);
        return updatedPost;
      }
      return optimisticPost;
    } catch (err: unknown) {
      console.error('Failed to toggle like:', err);
      // Revert optimistic update
      const revertedPost: Post = {
        ...post,
        likes: previousLikes,
        likesCount: previousLikes.length,
        isLiked: wasLiked
      };
      updatePostLocalState(revertedPost);
      throw err;
    }
  };

  const addComment = async (body: string): Promise<Post> => {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    setLoading(true);
    setError(null);
    try {
      const response = await addCommentRequest(postId, body);
      const updatedPost = normalizePost(response.data, user?.id);
      if (!updatedPost) {
        throw new Error('Failed to parse updated post');
      }
      return updatedPost;
    } catch (err: unknown) {
      console.error('Failed to add comment:', err);
      let errMsg = 'Error adding comment';
      if (err instanceof AxiosError) {
        errMsg = err.response?.data?.error || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (): Promise<void> => {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    setLoading(true);
    setError(null);
    try {
      await deletePostRequest(postId);
    } catch (err: unknown) {
      console.error('Failed to delete post:', err);
      let errMsg = 'Error deleting post';
      if (err instanceof AxiosError) {
        errMsg = err.response?.data?.error || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, addComment, deletePost, loading, error };
}
