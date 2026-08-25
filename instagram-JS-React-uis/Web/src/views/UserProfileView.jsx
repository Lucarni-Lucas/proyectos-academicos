import { useEffect, useState } from 'react';
import { PostGrid, ProfileHeader } from '../components';
import { getCurrentUserRequest } from '../api/users';
import { useNavigate } from 'react-router-dom';

function UserProfileView() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getCurrentUserRequest()
      .then((res) => {
        setUserData(res.data);
      })
      .catch(console.error);
  }, []);

  const navigate = useNavigate();
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const followingCount =
    userData?.following?.length ?? userData?.followers?.length ?? 0;
  const postsCount = userData?.posts?.length ?? 0;

  return (
    <div>
      <ProfileHeader
        user={userData}
        postsCount={postsCount}
        followingCount={followingCount}
        isOwnProfile={true}
      />
      <PostGrid posts={userData?.posts || []} onPostClick={handlePostClick} />
    </div>
  );
}
export default UserProfileView;
