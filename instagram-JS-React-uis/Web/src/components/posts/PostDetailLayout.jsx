import { useState } from 'react';
import './Posts.css';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import { DEFAULT_AVATAR_URL } from '../../utils/constants';
import PostMedia from './PostMedia';
import { CommentList, CommentComposer } from '../comments';

function PostDetailLayout({
  post,
  comments,
  isOwner,
  onUserClick,
  onToggleLike,
  onAddComment,
  onEditPost,
  onDeletePost,
  onOpenPost,
}) {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !onAddComment) return;
    setSubmitting(true);
    await onAddComment(commentText.trim());
    setCommentText('');
    setSubmitting(false);
  };

  return (
    <div className="post-detail">
      <PostMedia
        className="post-detail__media"
        imageUrl={post.image}
        alt={post.description}
        aspect="square"
      />

      <div className="post-detail__sidebar">
        <div className="post-detail__sidebar-header">
          <PostHeader
            user={post.user}
            createdAt={post.createdAt}
            showOwnerActions={isOwner}
            onUserClick={onUserClick}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />
        </div>

        <div className="post-detail__sidebar-comments">
          {post.description && (
            <div className="comment-item comment-item--caption">
              <img
                className="comment-item__avatar"
                src={
                  post.user.avatarUrl || post.user.image || DEFAULT_AVATAR_URL
                }
                alt={post.user.username || post.user.name}
                onClick={() => onUserClick && onUserClick(post.user.id)}
              />
              <div className="comment-item__body">
                <div className="comment-item__text">
                  <button
                    className="comment-item__username"
                    type="button"
                    onClick={() => onUserClick && onUserClick(post.user.id)}
                  >
                    {post.user.username || post.user.name}
                  </button>
                  <span className="comment-item__message">
                    {post.description}
                  </span>
                </div>
              </div>
            </div>
          )}
          <CommentList
            comments={comments}
            canEditOwnComments={false}
            onUserClick={onUserClick}
          />
        </div>

        <div className="post-detail__sidebar-actions">
          <PostActions
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            isLiked={post.isLiked}
            onToggleLike={() => onToggleLike && onToggleLike(post.id)}
            onOpenComments={() => {}}
          />
        </div>

        <div className="post-detail__sidebar-composer">
          <CommentComposer
            value={commentText}
            onChange={setCommentText}
            onSubmit={handleSubmitComment}
            loading={submitting}
          />
        </div>
      </div>
    </div>
  );
}

export default PostDetailLayout;
