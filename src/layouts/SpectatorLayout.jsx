import { Outlet } from "react-router-dom";
import SpectatorSidebar from "../components/SpectatorSidebar";
import { useAdminData } from "../data/AdminDataContext";

export default function SpectatorLayout() {
  const { alert } = useAdminData();

  return (
    <div className="admin-shell spectator-shell">
      <SpectatorSidebar />
      <main className="admin-main">
        <header className="topbar">
          <div>
            <h1>Horse Racing Prototype</h1>
            <p>Spectator portal for race schedule, predictions, live results, rankings and reward points.</p>
          </div>
          <span className="role-pill">Current Role: Spectator</span>
        </header>
        {alert && <div className={`toast ${alert.type}`}>{alert.message}</div>}
        <Outlet />
      </main>
    </div>
  );
}
