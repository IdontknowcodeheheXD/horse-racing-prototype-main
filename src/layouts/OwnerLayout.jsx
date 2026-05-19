import { Outlet } from "react-router-dom";
import OwnerSidebar from "../components/OwnerSidebar";
import { useAdminData } from "../data/AdminDataContext";

export default function OwnerLayout() {
  const { alert } = useAdminData();

  return (
    <div className="admin-shell owner-shell">
      <OwnerSidebar />
      <main className="admin-main">
        <header className="topbar">
          <div>
            <h1>Horse Racing Prototype</h1>
            <p>Horse Owner portal for horse registration, race tracking and result review.</p>
          </div>
          <span className="role-pill">Current Role: Horse Owner</span>
        </header>
        {alert && <div className={`toast ${alert.type}`}>{alert.message}</div>}
        <Outlet />
      </main>
    </div>
  );
}
