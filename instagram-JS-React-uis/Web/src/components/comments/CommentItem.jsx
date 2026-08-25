import { formatShortDate } from '../../utils/formatDate';
import { DEFAULT_AVATAR_URL } from '../../utils/constants';
import './Comments.css';

function CommentItem({ comment, isOwner, onUserClick, onEdit, onDelete }) {
  return (
    <div className="comment-item">
      <img
        className="comment-item__avatar"
        src={comment.user.avatarUrl || DEFAULT_AVATAR_URL}
        alt={comment.user.username}
        onClick={() => onUserClick && onUserClick(comment.user.id)}
      />
      <div className="comment-item__body">
        <div className="comment-item__text">
          <button
            className="comment-item__username"
            onClick={() => onUserClick && onUserClick(comment.user.id)}
            type="button"
          >
            {comment.user.username}
          </button>
          <span className="comment-item__message">{comment.text}</span>
        </div>
        <div className="comment-item__meta">
          {comment.createdAt && (
            <span className="comment-item__time">
              {formatShortDate(comment.createdAt)}
            </span>
          )}
          {isOwner && (
            <>
              <button
                className="comment-item__action-btn"
                onClick={() => onEdit && onEdit(comment.id)}
                type="button"
              >
                Editar
              </button>
              <button
                className="comment-item__action-btn"
                onClick={() => onDelete && onDelete(comment.id)}
                type="button"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
