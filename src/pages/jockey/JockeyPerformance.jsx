import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import { useAdminData } from "../../data/AdminDataContext";
import { JOCKEY_ID, jockeyIntro, JockeyPageHeader, timeToNumber } from "./jockeyUtils";

export default function JockeyPerformance() {
  const { data, raceById, horseById, tournamentById } = useAdminData();
  const rows = data.raceResults.filter((result) => result.jockeyId === JOCKEY_ID);
  const best = rows.length ? rows.slice().sort((a, b) => timeToNumber(a.finishTime) - timeToNumber(b.finishTime))[0].finishTime : "-";

  return (
    <>
      <JockeyPageHeader meta={jockeyIntro.performance} />
      <div className="stat-grid owner-stat-grid">
        <StatCard title="Tổng race đã tham gia" value={rows.length} note="Recorded results" />
        <StatCard title="Số lần top 1" value={rows.filter((item) => item.rank === 1).length} note="Rank #1 finishes" />
        <StatCard title="Best finish time" value={best} note="Lowest finish time" />
        <StatCard title="Violation count" value={rows.filter((item) => item.violationFlag).length} note="Flagged races" />
      </div>
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "tournament", header: "Tournament", render: (row) => tournamentById.get(raceById.get(row.raceId)?.tournamentId)?.name },
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "finishTime", header: "Finish Time" },
          { key: "rank", header: "Rank" },
          { key: "violationFlag", header: "Violation", render: (row) => row.violationFlag ? "Yes" : "No" },
        ]} />
      </section>
    </>
  );
}
