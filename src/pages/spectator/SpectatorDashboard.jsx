import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, rewardTotal, SPECTATOR_ID, spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function SpectatorDashboard() {
  const { data, raceById } = useAdminData();
  const upcoming = data.races.filter((race) => new Date(race.raceDate) >= new Date("2026-05-19T00:00"));
  const liveRace = data.races.find((race) => race.status === "In Progress") || data.races.find((race) => race.status === "Confirmed");
  const latest = data.notifications.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.dashboard} />
      <div className="stat-grid owner-stat-grid">
        <StatCard title="Race sắp tới" value={upcoming.length} note="Available schedule" />
        <StatCard title="Prediction đã gửi" value={data.predictions.filter((item) => item.spectatorId === SPECTATOR_ID).length} note="Submitted predictions" />
        <StatCard title="Reward points" value={rewardTotal(data)} note="Current points" />
        <StatCard title="Live race" value={liveRace?.round || "-"} note={liveRace?.track || "No live race"} />
      </div>
      {latest && <div className="warning-box ok dashboard-warning"><strong>{latest.title}</strong><span>{latest.message}</span></div>}
      <section className="content-panel">
        <h3>Upcoming Races</h3>
        <DataTable rows={upcoming} columns={[
          { key: "round", header: "Race" },
          { key: "raceDate", header: "Date", render: (row) => formatDateTime(row.raceDate) },
          { key: "track", header: "Track" },
          { key: "distance", header: "Distance", render: (row) => `${row.distance}m` },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
