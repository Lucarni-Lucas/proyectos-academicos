import { useEffect, useState } from 'react';
import { PostGrid, ProfileHeader } from '../components';
import {
  followUserRequest,
  getUserRequest,
  getCurrentUserRequest,
} from '../api/users';
import { useParams, useNavigate } from 'react-router-dom';

function ProfileView() {
  const params = useParams();
  const userId = params.id;
  const [loggedUser, setLoggedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      try {
        const currentUserRes = await getCurrentUserRequest();
        if (!isActive) return;
        const currentUser = currentUserRes.data;
        setLoggedUser(currentUser);

        if (currentUser?.id && String(currentUser.id) === String(userId)) {
          navigate('/user_profile');
          return;
        }

        const userRes = await getUserRequest(userId);
        if (!isActive) return;
        setUserData(userRes.data);
        // Seguimiento real: se guarda en el usuario logueado.
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [userId, navigate]);

  const handleFollowClick = async () => {
    try {
      const res = await followUserRequest(userId);
      setLoggedUser(res.data);
    } catch (err) {
      console.error('Error al seguir/dejar de seguir al usuario:', err);
    }
  };
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const loggedUserFollowing =
    loggedUser?.following ?? loggedUser?.followers ?? [];
  const isFollowing = loggedUserFollowing.some(
    (followed) => String(followed.id) === String(userId),
  );
  const followingCount =
    userData?.following?.length ?? userData?.followers?.length ?? 0;
  const postsCount = userData?.posts?.length ?? 0;

  return (
    <div>
      <ProfileHeader
        user={userData}
        postsCount={postsCount}
        followingCount={followingCount}
        isOwnProfile={false}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowClick}
      />
      <PostGrid posts={userData?.posts || []} onPostClick={handlePostClick} />
    </div>
  );
}
export default ProfileView;
