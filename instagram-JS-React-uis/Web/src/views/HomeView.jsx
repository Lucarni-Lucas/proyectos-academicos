import { PostList } from '../components';
import '../styles/HomeView.css';
import { useState, useEffect } from 'react';
import { getCurrentUserRequest, getTimelineRequest } from '../api/users';
import { useNavigate } from 'react-router-dom';
import { toggleLikeRequest } from '../api/posts';
import { normalizePostForUser } from '../api/normalizers';

function HomeView() {
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getCurrentUserRequest(), getTimelineRequest()])
      .then(([currentUserRes, timelineRes]) => {
        const userId = currentUserRes.data?.id ?? null;
        setCurrentUserId(userId);

        const timelinePosts = Array.isArray(timelineRes.data.timeline)
          ? timelineRes.data.timeline.map((post) =>
              normalizePostForUser(post, userId),
            )
          : [];
        setPosts(timelinePosts);
      })
      .catch(() => setPosts([]));
  }, []);

  const handleOpenPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleToggleLike = async (postId) => {
    try {
      const res = await toggleLikeRequest(postId);
      const updated = res.data;

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;

          const normalized = normalizePostForUser(updated, currentUserId);
          return {
            ...post,
            ...normalized,
          };
        }),
      );
    } catch {
      // no-op: se mantiene el estado actual si falla la API
    }
  };

  return (
    <div className="home-view-body">
      <PostList
        posts={posts}
        currentUserId={currentUserId}
        variant="home"
        onOpenPost={handleOpenPost}
        onUserClick={handleUserClick}
        onToggleLike={handleToggleLike}
        onOpenComments={handleOpenPost}
      />
    </div>
  );
}

export default HomeView;
