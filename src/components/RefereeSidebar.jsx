import { NavLink } from "react-router-dom";

const menu = [
  ["Dashboard", "/referee/dashboard"],
  ["Race được phân công", "/referee/assigned-races"],
  ["Kiểm tra trước race", "/referee/inspection"],
  ["Nhập kết quả", "/referee/enter-result"],
  ["Báo cáo vi phạm", "/referee/violations"],
  ["Nộp báo cáo", "/referee/submit-report"],
  ["Lịch sử báo cáo", "/referee/history"],
];

export default function RefereeSidebar() {
  return (
    <aside className="admin-sidebar referee-sidebar">
      <div className="brand-mark">
        <strong>Race Referee</strong>
        <span>Nguyen Van Khoa</span>
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
        <NavLink to="/spectator/dashboard">Spectator Demo</NavLink>
      </div>
    </aside>
  );
}
