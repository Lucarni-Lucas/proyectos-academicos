import './Comments.css';
import CommentItem from './CommentItem';

function CommentList({
  comments,
  canEditOwnComments,
  onEditComment,
  onDeleteComment,
  onUserClick,
  loading,
}) {
  if (loading) {
    return <div className="comment-list__loading">Cargando comentarios…</div>;
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="comment-list__empty">
        No hay comentarios aún. ¡Sé el primero!
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={canEditOwnComments}
          onUserClick={onUserClick}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
        />
      ))}
    </div>
  );
}

export default CommentList;
