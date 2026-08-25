import './ProfileStats.css';

function ProfileStats({ postsCount, followingCount }) {
  return (
    <div className="profile-stats">
      <span className="profile-stats__item">
        {/* ?? 0 para evitar mostrar "undefined"*/}
        <strong>{postsCount ?? 0}</strong> publicaciones
      </span>
      <span className="profile-stats__item">
        <strong>{followingCount ?? 0}</strong> seguidos
      </span>
    </div>
  );
}

export default ProfileStats;
