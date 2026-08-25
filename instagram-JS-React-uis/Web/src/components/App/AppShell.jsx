import { useState, useEffect } from 'react';
import Sidebar from './sideBar/Sidebar';
import Avatar from './avatar/Avatar';
import add from '../../assets/add.png';
import HomeFilled from '../../assets/HomeFilled.png';
import './Base.css';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../utils/jwt';
import { getCurrentUserRequest } from '../../api/users';

function AppShell({ children }) {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUserRequest()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
      });
  }, []);
  const navItems = (user) => [
    {
      id: 'home',
      label: 'Inicio',
      icon: <img src={HomeFilled} alt="Inicio" />,
      onClick: () => navigate('/'),
    },
    {
      id: 'newPost',
      label: 'Crear publicación',
      icon: <img src={add} alt="Crear publicación" />,
      onClick: () => navigate('/new-post'),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: (
        <Avatar
          src={user?.image}
          alt={user?.name}
          size={24}
          onClick={() => navigate('/user_profile')}
        />
      ),
      onClick: () => navigate('/user_profile'),
    },
  ];

  const handleSearchSubmit = (query) => {
    navigate(`/search?q=${query}`);
  };

  return (
    <div className="app-shell">
      <Sidebar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        navItems={navItems(user)}
        onLogout={() => {
          clearToken();
          navigate('/login');
        }}
      />
      <main className="app-shell__main">{children}</main>
    </div>
  );
}

export default AppShell;
