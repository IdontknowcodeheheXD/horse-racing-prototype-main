import DataTable from "../../components/DataTable";
import { useAdminData } from "../../data/AdminDataContext";
import { spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function SpectatorRanking() {
  const { data, horseById, jockeyById, raceById, tournamentById } = useAdminData();
  const rows = data.raceResults
    .filter((item) => item.officialStatus !== "Disqualified")
    .slice()
    .sort((a, b) => Number(a.rank) - Number(b.rank))
    .map((item, index) => ({ ...item, displayRank: index + 1 }));

  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.ranking} />
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "displayRank", header: "Rank" },
          { key: "tournament", header: "Tournament", render: (row) => tournamentById.get(raceById.get(row.raceId)?.tournamentId)?.name },
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "finishTime", header: "Finish Time" },
        ]} />
      </section>
    </>
  );
}
