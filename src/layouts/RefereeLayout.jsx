import { Outlet } from "react-router-dom";
import RefereeSidebar from "../components/RefereeSidebar";
import { useAdminData } from "../data/AdminDataContext";

export default function RefereeLayout() {
  const { alert } = useAdminData();

  return (
    <div className="admin-shell referee-shell">
      <RefereeSidebar />
      <main className="admin-main">
        <header className="topbar">
          <div>
            <h1>Horse Racing Prototype</h1>
            <p>Race Referee portal for assigned races, inspection, results and official reports.</p>
          </div>
          <span className="role-pill">Current Role: Race Referee</span>
        </header>
        {alert && <div className={`toast ${alert.type}`}>{alert.message}</div>}
        <Outlet />
      </main>
    </div>
  );
}
