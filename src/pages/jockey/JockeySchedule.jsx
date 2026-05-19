import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { confirmedJockeyRegistrations, formatDateTime, jockeyIntro, JockeyPageHeader } from "./jockeyUtils";

export default function JockeySchedule() {
  const { data, raceById, horseById } = useAdminData();
  const rows = confirmedJockeyRegistrations(data).map((registration) => ({ ...registration, upcoming: new Date(raceById.get(registration.raceId)?.raceDate) >= new Date("2026-05-19T00:00") }));

  return (
    <>
      <JockeyPageHeader meta={jockeyIntro.schedule} />
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "raceId", header: "Race", render: (row) => <span className={row.upcoming ? "upcoming-race" : ""}>{raceById.get(row.raceId)?.round}</span> },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "track", header: "Track", render: (row) => raceById.get(row.raceId)?.track },
          { key: "date", header: "Date", render: (row) => formatDateTime(raceById.get(row.raceId)?.raceDate) },
          { key: "round", header: "Round", render: (row) => raceById.get(row.raceId)?.round },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
