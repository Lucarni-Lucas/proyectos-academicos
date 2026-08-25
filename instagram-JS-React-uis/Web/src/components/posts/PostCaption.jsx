import './Posts.css';

function PostCaption({ username, text }) {
  if (!text) return null;

  return (
    <div className="post-caption">
      {username && <span className="post-caption__username">{username}</span>}
      <span className="post-caption__text">{text}</span>
    </div>
  );
}

export default PostCaption;
