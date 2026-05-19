import { NavLink } from "react-router-dom";

const menu = [
  ["Dashboard", "/spectator/dashboard"],
  ["Lịch đua", "/spectator/schedule"],
  ["Chi tiết cuộc đua", "/spectator/race-detail"],
  ["Dự đoán", "/spectator/predict"],
  ["Lịch sử dự đoán", "/spectator/predictions"],
  ["Kết quả trực tiếp", "/spectator/live-results"],
  ["Xếp hạng", "/spectator/ranking"],
  ["Điểm thưởng", "/spectator/rewards"],
];

export default function SpectatorSidebar() {
  return (
    <aside className="admin-sidebar spectator-sidebar">
      <div className="brand-mark">
        <strong>Spectator Portal</strong>
        <span>Demo Fan Account</span>
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
        <NavLink to="/admin/dashboard">Admin Demo</NavLink>
        <NavLink to="/owner/dashboard">Owner Demo</NavLink>
        <NavLink to="/jockey/dashboard">Jockey Demo</NavLink>
        <NavLink to="/referee/dashboard">Referee Demo</NavLink>
      </div>
    </aside>
  );
}
