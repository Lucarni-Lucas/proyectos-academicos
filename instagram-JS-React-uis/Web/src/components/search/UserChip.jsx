import { DEFAULT_AVATAR_URL } from '../../utils/constants';
import './UserChip.css';

function UserChip({ user, onClick }) {
  return (
    <div
      className="user-chip"
      onClick={() => onClick?.(user)}
      title={user?.username}
    >
      <div className="user-chip__avatar">
        <img src={user?.avatarUrl || DEFAULT_AVATAR_URL} alt={user?.username} />
      </div>
      <span className="user-chip__name">{user?.username}</span>
    </div>
  );
}

export default UserChip;
