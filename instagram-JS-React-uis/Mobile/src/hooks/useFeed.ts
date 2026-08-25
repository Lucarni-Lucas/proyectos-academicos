import { useState, useEffect, useCallback } from 'react';
import { getFeedRequest } from '@/api/posts';
import { useAuth } from '@/context/AuthContext';
import { normalizePost } from '@/utils/normalize';
import { Post } from '@/types';
import { AxiosError } from 'axios';

export interface UseFeedResult {
  data: Post[];
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<Post[]>>;
}

export function useFeed(endpoint: string): UseFeedResult {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { token, user } = useAuth();

  const fetchData = useCallback(async (showRefreshingIndicator = false): Promise<void> => {
    if (!token) return;

    if (showRefreshingIndicator) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await getFeedRequest(endpoint);
      let posts: unknown[] = [];
      if (response.data && typeof response.data === 'object') {
        const rawData = response.data as Record<string, unknown>;
        if (Array.isArray(rawData)) {
          posts = rawData;
        } else if (rawData.timeline && Array.isArray(rawData.timeline)) {
          posts = rawData.timeline;
        } else if (rawData.posts && Array.isArray(rawData.posts)) {
          posts = rawData.posts;
        } else if (rawData.id && rawData.description) {
          posts = [rawData];
        }
      }
      
      const currentUserId = user?.id;
      const normalizedPosts = posts
        .map(post => normalizePost(post, currentUserId))
        .filter((post): post is Post => post !== null);
      setData(normalizedPosts);
    } catch (err: unknown) {
      console.error('Error fetching feed:', err);
      let errMsg = 'Error fetching feed';
      if (err instanceof AxiosError) {
        errMsg = err.response?.data?.error || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [endpoint, token, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback((): Promise<void> => {
    return fetchData(true);
  }, [fetchData]);

  return { data, loading, error, isRefreshing, refresh, setData };
}
