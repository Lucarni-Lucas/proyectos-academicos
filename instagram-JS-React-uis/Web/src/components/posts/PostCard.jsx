import './Posts.css';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import PostCaption from './PostCaption';

function PostCard({
  post,
  isOwner,
  variant,
  onOpenPost,
  onUserClick,
  onToggleLike,
  onOpenComments,
}) {
  const cardClassName = variant
    ? `post-card post-card--${variant}`
    : 'post-card';

  return (
    <div className={cardClassName}>
      <div className="post-header">
        <PostHeader
          user={post.user}
          createdAt={post.createdAt}
          onUserClick={onUserClick}
          showOwnerActions={false}
          onEdit={() => onOpenPost && onOpenPost(post.id)}
          onDelete={() => onOpenPost && onOpenPost(post.id)}
        />
      </div>
      <div className="post-media">
        <PostMedia
          className={variant ? `post-media--${variant}` : undefined}
          imageUrl={post.image}
          alt={post.description}
          aspect="square"
          onClick={() => onOpenPost && onOpenPost(post.id)}
        />
      </div>
      <div className="post-actions">
        <PostActions
          likesCount={post.likesCount ?? post.likes?.length ?? 0}
          commentsCount={post.commentsCount ?? post.comments?.length ?? 0}
          isLiked={post.isLiked}
          onToggleLike={() => onToggleLike && onToggleLike(post.id)}
          onOpenComments={() => onOpenComments && onOpenComments(post.id)}
        />
      </div>
      <div className="post-caption">
        <PostCaption username={post.user.username} text={post.description} />
      </div>
    </div>
  );
}

export default PostCard;
