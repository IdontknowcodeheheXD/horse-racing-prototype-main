import { NavLink } from "react-router-dom";

const menu = [
  ["Dashboard", "/owner/dashboard"],
  ["Ngựa của tôi", "/owner/horses"],
  ["Thêm ngựa", "/owner/add-horse"],
  ["Danh sách cuộc đua", "/owner/races"],
  ["Đăng ký tham gia", "/owner/register"],
  ["Lịch sử đăng ký", "/owner/history"],
  ["Kết quả", "/owner/results"],
];

export default function OwnerSidebar() {
  return (
    <aside className="admin-sidebar owner-sidebar">
      <div className="brand-mark">
        <strong>Horse Owner</strong>
        <span>Nguyen Racing Stable</span>
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
        <NavLink to="/jockey/dashboard">Jockey Demo</NavLink>
        <NavLink to="/referee/dashboard">Referee Demo</NavLink>
        <NavLink to="/spectator/dashboard">Spectator Demo</NavLink>
        <NavLink to="/admin/dashboard">Admin Demo</NavLink>
      </div>
    </aside>
  );
}
