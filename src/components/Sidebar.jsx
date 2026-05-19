import { NavLink } from "react-router-dom";

const menu = [
  ["Dashboard", "/admin/dashboard"],
  ["Giải đấu", "/admin/tournaments"],
  ["Cuộc đua", "/admin/races"],
  ["Lịch đua", "/admin/scheduling"],
  ["Đăng ký", "/admin/registrations"],
  ["Ngựa", "/admin/horses"],
  ["Nài ngựa", "/admin/jockeys"],
  ["Trọng tài", "/admin/referees"],
  ["Báo cáo trọng tài", "/admin/referee-reports"],
  ["Kết quả & Xếp hạng", "/admin/results-rankings"],
  ["Giải thưởng", "/admin/prizes"],
  ["Thông báo", "/admin/notifications"],
  ["Xuất báo cáo", "/admin/reports"],
];

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="brand-mark">
        <strong>Horse Racing</strong>
        <span>Admin Prototype</span>
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
        <NavLink to="/jockey/dashboard">Jockey Demo</NavLink>
        <NavLink to="/referee/dashboard">Referee Demo</NavLink>
        <NavLink to="/spectator/dashboard">Spectator Demo</NavLink>
      </div>
    </aside>
  );
}
