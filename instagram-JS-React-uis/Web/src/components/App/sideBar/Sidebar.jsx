import { Link } from 'react-router-dom';
import NavItem from './NavItem';
import './SideBar.css';
import logo from '../../../assets/logo.png';
import Logout from '../../../assets/Logout.png';
import Search from '../../../assets/Search.png';

function Sidebar({
  logoSrc = logo,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  navItems = [],
  activeItem,
  onLogout,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchValue);
    }
  };
  return (
    <aside className="sidebar">
      <Link to="/">
        <img src={logoSrc} alt="Instagram" className="sidebar__logo" />
      </Link>

      <form className="sidebar__search-form" onSubmit={handleSubmit}>
        <input
          className="sidebar__search-input"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search"
          name="search"
          type="text"
        />
        <button
          className="sidebar__search-submit"
          type="submit"
          aria-label="Buscar"
        >
          <img className="sidebar__search-icon" src={Search} alt="Buscar" />
        </button>
      </form>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            onClick={item.onClick}
            disabled={item.disabled}
          />
        ))}
      </nav>

      <NavItem
        icon={<img src={Logout} alt="Salir" />}
        label="Salir"
        onClick={onLogout}
        disabled={!onLogout}
        isActive={false}
      />
    </aside>
  );
}

export default Sidebar;
