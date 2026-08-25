import { formatDateTime } from '../../utils/formatDate';
import { Avatar } from '../';
import './Posts.css';

function PostHeader({
  user,
  createdAt,
  onUserClick,
  showOwnerActions,
  onEdit,
  onDelete,
}) {
  const formattedDate = formatDateTime(createdAt);

  return (
    <div className="post-header">
      <Avatar
        src={user.avatarUrl || user.image}
        alt={user.username || user.name}
        size={40}
        onClick={() => onUserClick && onUserClick(user.id)}
      />
      <div className="post-header__info">
        <button
          className="post-header__username"
          onClick={() => onUserClick && onUserClick(user.id)}
          type="button"
        >
          {user.username || user.name}
        </button>
        {formattedDate && (
          <div className="post-header__date">{formattedDate}</div>
        )}
      </div>
      {showOwnerActions && (
        <div className="post-header__actions">
          <button
            className="post-header__action-btn"
            onClick={onDelete}
            type="button"
            title="Eliminar publicación"
          >
            <img
              className="post-header__action-icon"
              src="/delete.svg"
              alt="Eliminar"
            />
          </button>
          <button
            className="post-header__action-btn"
            onClick={onEdit}
            type="button"
            title="Editar publicación"
          >
            <img
              className="post-header__action-icon"
              src="/edit.svg"
              alt="Editar"
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default PostHeader;
