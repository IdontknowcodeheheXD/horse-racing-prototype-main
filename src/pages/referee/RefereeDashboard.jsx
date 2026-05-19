import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { assignedRaces, formatDateTime, REFEREE_ID, refereeIntro, RefereePageHeader } from "./refereeUtils";

export default function RefereeDashboard() {
  const { data, tournamentById } = useAdminData();
  const races = assignedRaces(data);
  const reports = data.refereeReports.filter((report) => report.refereeId === REFEREE_ID);
  const pending = reports.filter((report) => report.status !== "Submitted");
  const upcoming = races.filter((race) => new Date(race.raceDate) >= new Date("2026-05-19T00:00"));
  const violations = data.violationReports.filter((item) => item.refereeId === REFEREE_ID);

  return (
    <>
      <RefereePageHeader meta={refereeIntro.dashboard} />
      <div className="stat-grid owner-stat-grid">
        <StatCard title="Race được phân công" value={races.length} note="Assigned races" />
        <StatCard title="Race pending report" value={pending.length} note="Need submission" />
        <StatCard title="Race completed" value={reports.filter((item) => item.status === "Submitted").length} note="Submitted reports" />
        <StatCard title="Violation reports" value={violations.length} note="Recorded violations" />
      </div>
      <section className="content-panel">
        <h3>Race sắp diễn ra</h3>
        <DataTable rows={upcoming} columns={[
          { key: "tournamentId", header: "Tournament", render: (row) => tournamentById.get(row.tournamentId)?.name },
          { key: "round", header: "Race" },
          { key: "raceDate", header: "Date", render: (row) => formatDateTime(row.raceDate) },
          { key: "track", header: "Track" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
