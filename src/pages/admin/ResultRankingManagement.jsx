import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { PageHeader, pageIntro, timeToNumber } from "./pageUtils";

export default function ResultRankingManagement() {
  const { data, setData, flash, raceById, horseById, jockeyById, tournamentById } = useAdminData();
  const publish = (raceId) => {
    const report = data.refereeReports.find((item) => item.raceId === raceId && item.confirmedResult);
    if (!report) return flash("Cannot publish result before referee report confirmation.", "error");
    setData((current) => ({ ...current, raceResults: current.raceResults.map((item) => item.raceId === raceId && item.officialStatus !== "Disqualified" ? { ...item, officialStatus: "Official" } : item) }));
    flash("Race result published successfully");
  };
  const rankingRows = data.raceResults
    .filter((item) => item.officialStatus !== "Disqualified")
    .slice()
    .sort((a, b) => timeToNumber(a.finishTime) - timeToNumber(b.finishTime))
    .map((item, index) => ({ ...item, rank: index + 1, tournamentId: raceById.get(item.raceId)?.tournamentId }));

  return (
    <>
      <PageHeader meta={pageIntro.results} />
      <section className="content-panel">
        <h3>Race Results</h3>
        <DataTable rows={data.raceResults} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "finishTime", header: "Finish Time" },
          { key: "rank", header: "Rank" },
          { key: "violationFlag", header: "Violation", render: (row) => row.violationFlag ? "Yes" : "No" },
          { key: "officialStatus", header: "Official Status", render: (row) => <StatusBadge status={row.officialStatus} /> },
          { key: "actions", header: "Actions", render: (row) => <button onClick={() => publish(row.raceId)}>Publish Result</button> },
        ]} />
      </section>
      <section className="content-panel">
        <h3>Ranking Tournament</h3>
        <DataTable rows={rankingRows} columns={[
          { key: "rank", header: "Ranking" },
          { key: "tournamentId", header: "Tournament", render: (row) => tournamentById.get(row.tournamentId)?.name },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "finishTime", header: "Best Finish Time" },
        ]} />
      </section>
    </>
  );
}
