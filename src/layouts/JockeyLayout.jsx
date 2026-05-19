import { Outlet } from "react-router-dom";
import JockeySidebar from "../components/JockeySidebar";
import { useAdminData } from "../data/AdminDataContext";

export default function JockeyLayout() {
  const { alert } = useAdminData();

  return (
    <div className="admin-shell jockey-shell">
      <JockeySidebar />
      <main className="admin-main">
        <header className="topbar">
          <div>
            <h1>Horse Racing Prototype</h1>
            <p>Jockey portal for invitations, race schedule and performance tracking.</p>
          </div>
          <span className="role-pill">Current Role: Jockey</span>
        </header>
        {alert && <div className={`toast ${alert.type}`}>{alert.message}</div>}
        <Outlet />
      </main>
    </div>
  );
}
