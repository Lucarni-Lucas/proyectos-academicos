import './Posts.css';
import PostCard from './PostCard';

function PostList({
  posts,
  currentUserId,
  variant,
  onOpenPost,
  onToggleLike,
  onOpenComments,
  onUserClick,
}) {
  if (!posts || posts.length === 0) {
    return (
      <div className="post-list">
        <p style={{ color: '#8e8e8e', fontSize: '14px' }}>
          No hay publicaciones para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isOwner={post.user.id === currentUserId}
          variant={variant}
          onOpenPost={onOpenPost}
          onUserClick={onUserClick}
          onToggleLike={onToggleLike}
          onOpenComments={onOpenComments}
        />
      ))}
    </div>
  );
}

export default PostList;
