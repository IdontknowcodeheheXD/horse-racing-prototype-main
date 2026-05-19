import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { certState, formatDateTime, PageHeader, pageIntro } from "./pageUtils";

export default function AdminDashboard() {
  const { data, raceById, horseById, jockeyById } = useAdminData();
  const upcomingRaces = data.races.filter((race) => new Date(race.raceDate) >= new Date("2026-05-19T00:00"));
  const riskyHorses = data.horses.filter((horse) => certState(horse.healthCertExpiry).level !== "ok");

  return (
    <>
      <PageHeader meta={pageIntro.dashboard} />
      <div className="stat-grid">
        <StatCard title="Tổng giải đấu" value={data.tournaments.length} note="Mock tournaments" />
        <StatCard title="Cuộc đua sắp tới" value={upcomingRaces.length} note="From today onward" />
        <StatCard title="Ngựa đăng ký" value={new Set(data.registrations.map((item) => item.horseId)).size} note="Unique horses" />
        <StatCard title="Nài ngựa hoạt động" value={data.jockeys.filter((item) => item.status === "Active").length} note="Eligible jockeys" />
        <StatCard title="Báo cáo chờ xử lý" value={data.refereeReports.filter((item) => item.status === "Pending").length} note="Pending referee reports" />
      </div>

      <section className="content-panel">
        <h3>Upcoming Races</h3>
        <DataTable
          rows={upcomingRaces}
          columns={[
            { key: "round", header: "Race" },
            { key: "raceDate", header: "Date", render: (row) => formatDateTime(row.raceDate) },
            { key: "track", header: "Track" },
            { key: "distance", header: "Distance", render: (row) => `${row.distance}m` },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
        />
      </section>

      <section className="content-panel">
        <h3>Health Certificate Alerts</h3>
        <div className="warning-list">
          {riskyHorses.map((horse) => {
            const state = certState(horse.healthCertExpiry);
            return (
              <div key={horse.id} className={`warning-box ${state.level}`}>
                <strong>{horse.name}</strong>
                <span>{state.label} - expires {horse.healthCertExpiry}</span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
