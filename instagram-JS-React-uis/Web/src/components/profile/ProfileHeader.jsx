import ProfileStats from './ProfileStats';
import { DEFAULT_AVATAR_URL } from '../../utils/constants';
import MainButton from '../App/mainButton/MainButton';
import './ProfileHeader.css';

function ProfileHeader({
  user,
  postsCount,
  followingCount,
  isOwnProfile,
  isFollowing,
  onFollowToggle,
}) {
  return (
    <div className="profile-header">
      <div className="profile-header__avatar">
        <img
          src={user?.avatarUrl || DEFAULT_AVATAR_URL}
          alt={`Avatar de ${user?.username}`}
        />
      </div>

      <div className="profile-header__info">
        <div className="profile-header__top">
          <h2 className="profile-header__username">{user?.username}</h2>

          {/* Solo renderiza si la condición es true (isOwnProfile = false) para el boton Seguir/Siguiendo*/}
          {!isOwnProfile && (
            <MainButton
              variant={isFollowing ? 'secondary' : 'primary'}
              label={isFollowing ? 'Dejar de seguir' : 'Seguir'}
              onClick={onFollowToggle}
            />
          )}
        </div>

        <ProfileStats postsCount={postsCount} followingCount={followingCount} />
      </div>
    </div>
  );
}

export default ProfileHeader;
