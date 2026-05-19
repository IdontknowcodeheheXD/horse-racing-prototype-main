import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { confirmedJockeyRegistrations, formatDateTime, hasScheduleConflict, JOCKEY_ID, jockeyIntro, jockeyRegistrations, JockeyPageHeader } from "./jockeyUtils";

export default function JockeyDashboard() {
  const { data, raceById, horseById, jockeyById } = useAdminData();
  const jockey = jockeyById.get(JOCKEY_ID);
  const invitations = jockeyRegistrations(data);
  const confirmed = confirmedJockeyRegistrations(data);
  const upcoming = confirmed.filter((item) => new Date(raceById.get(item.raceId)?.raceDate) >= new Date("2026-05-19T00:00"));
  const conflict = hasScheduleConflict(data, raceById);

  return (
    <>
      <JockeyPageHeader meta={jockeyIntro.dashboard} />
      <div className="stat-grid owner-stat-grid">
        <StatCard title="Lời mời pending" value={invitations.filter((item) => item.status === "Pending").length} note="Awaiting response" />
        <StatCard title="Race confirmed" value={confirmed.length} note="Accepted schedule" />
        <StatCard title="Race sắp tới" value={upcoming.length} note="From today onward" />
        <StatCard title="Ranking hiện tại" value={`#${jockey?.ranking || "-"}`} note={jockey?.status || "Unknown"} />
      </div>
      {conflict && <div className="warning-box danger dashboard-warning">Schedule conflict detected in confirmed races.</div>}
      <section className="content-panel">
        <h3>Upcoming Confirmed Races</h3>
        <DataTable rows={upcoming} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "raceDate", header: "Race Date", render: (row) => formatDateTime(raceById.get(row.raceId)?.raceDate) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
