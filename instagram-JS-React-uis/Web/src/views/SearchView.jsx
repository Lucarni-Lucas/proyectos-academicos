import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PostGrid, SearchResultsHeader, Avatar } from '../components';
import { searchRequest } from '../api/search';
import '../styles/SearchView.css';

function SearchView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (query.trim()) {
      searchRequest(query)
        .then((response) => {
          setUsers(response.data.users || []);
          setPosts(response.data.posts || []);
        })
        .catch(() => {
          setUsers([]);
          setPosts([]);
        });
    }
  }, [query]);

  const hasResults = users.length > 0 || posts.length > 0;

  if (!query.trim()) {
    return (
      <div className="search-view">
        <SearchResultsHeader query="" />
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="search-view">
        <SearchResultsHeader query={query} />
        <div className="search-view__empty-state">
          <p>No se encontraron resultados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-view">
      <SearchResultsHeader query={query} />

      {users.length > 0 && (
        <div className="search-view__users-section">
          <div className="search-view__users">
            {users.map((user) => (
              <div
                key={user.id}
                className="search-view__user-item"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <Avatar src={user.image} alt={user.name} size={150} />
              </div>
            ))}
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <PostGrid
          posts={posts}
          columns={3}
          onPostClick={(postId) => navigate(`/posts/${postId}`)}
        />
      )}
    </div>
  );
}

export default SearchView;
