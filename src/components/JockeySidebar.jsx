import { NavLink } from "react-router-dom";

const menu = [
  ["Dashboard", "/jockey/dashboard"],
  ["Lời mời tham gia", "/jockey/invitations"],
  ["Lịch thi đấu", "/jockey/schedule"],
  ["Thành tích", "/jockey/performance"],
  ["Hồ sơ cá nhân", "/jockey/profile"],
];

export default function JockeySidebar() {
  return (
    <aside className="admin-sidebar jockey-sidebar">
      <div className="brand-mark">
        <strong>Jockey Portal</strong>
        <span>Le Minh Quan</span>
      </div>
      <nav>
        {menu.map(([label, path]) => (
          <NavLink key={path} to={path} className={({ isActive }) => (isActive ? "active" : "")}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="role-switch">
        <NavLink to="/">Role Selection</NavLink>
        <NavLink to="/demo-flow">Demo Flow</NavLink>
        <NavLink to="/owner/dashboard">Owner Demo</NavLink>
        <NavLink to="/referee/dashboard">Referee Demo</NavLink>
        <NavLink to="/spectator/dashboard">Spectator Demo</NavLink>
        <NavLink to="/admin/dashboard">Admin Demo</NavLink>
      </div>
    </aside>
  );
}
