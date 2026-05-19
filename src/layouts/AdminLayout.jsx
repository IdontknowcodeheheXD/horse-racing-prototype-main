import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAdminData } from "../data/AdminDataContext";

export default function AdminLayout() {
  const { alert } = useAdminData();

  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">
        <header className="topbar">
          <div>
            <h1>Horse Racing Prototype</h1>
            <p>Admin tournament management demo with mock data only.</p>
          </div>
          <span className="role-pill">Current Role: Admin</span>
        </header>
        {alert && <div className={`toast ${alert.type}`}>{alert.message}</div>}
        <Outlet />
      </main>
    </div>
  );
}
