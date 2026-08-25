import './SideBar.css';

function NavItem({ icon, label, isActive, onClick, disabled = false }) {
  return (
    <button
      className={`nav-item ${isActive ? 'nav-item--active' : ''}`.trim()}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="nav-item__icon">{icon}</span>
      <span className="nav-item__label">{label}</span>
    </button>
  );
}

export default NavItem;
