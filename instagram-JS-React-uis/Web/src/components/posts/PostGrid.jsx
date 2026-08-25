import './PostGrid.css';

function PostGrid({
  posts,
  columns = 3,
  onPostClick,
  emptyMessage = 'No hay publicaciones',
}) {
  if (!posts || posts.length === 0) {
    return (
      <div className="post-grid__empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="post-grid" style={{ '--columns': columns }}>
      {posts.map((post) => (
        <div
          key={post._id || post.id}
          className="post-grid__item"
          onClick={() => onPostClick(post.id)}
        >
          <img
            src={post.image}
            alt={post.description || 'Post'}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default PostGrid;
