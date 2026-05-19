import { useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { officialStatusForRace, spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function LiveResult() {
  const { data, horseById, jockeyById } = useAdminData();
  const [raceId, setRaceId] = useState(data.races[0]?.id || "");
  const official = officialStatusForRace(data, raceId);
  const rows = data.raceResults.filter((item) => item.raceId === raceId).slice().sort((a, b) => Number(a.rank) - Number(b.rank));

  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.live} />
      <div className="toolbar"><select value={raceId} onChange={(e) => setRaceId(e.target.value)}>{data.races.map((race) => <option key={race.id} value={race.id}>{race.round}</option>)}</select></div>
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "rank", header: "Rank" },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "finishTime", header: "Finish Time" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.officialStatus === "Disqualified" ? "Disqualified" : official} /> },
        ]} />
      </section>
    </>
  );
}
