import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, raceEntries, spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function RaceDetail() {
  const { data, raceById, horseById, jockeyById, tournamentById } = useAdminData();
  const [params] = useSearchParams();
  const [raceId, setRaceId] = useState(params.get("raceId") || data.races[0]?.id || "");
  const race = raceById.get(raceId);
  const rows = raceEntries(data, raceId);

  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.detail} />
      <div className="toolbar"><select value={raceId} onChange={(e) => setRaceId(e.target.value)}>{data.races.map((item) => <option key={item.id} value={item.id}>{item.round}</option>)}</select></div>
      <section className="content-panel split-panel">
        <div className="preview-card">
          <p><strong>Tournament:</strong> {tournamentById.get(race?.tournamentId)?.name}</p>
          <p><strong>Race:</strong> {race?.round}</p>
          <p><strong>Track:</strong> {race?.track}</p>
          <p><strong>Distance:</strong> {race?.distance}m</p>
          <p><strong>Race Date:</strong> {formatDateTime(race?.raceDate)}</p>
          <p><strong>Status:</strong> <StatusBadge status={race?.status} /></p>
        </div>
        <div>
          <h3>Horse / Jockey Participants</h3>
          <DataTable rows={rows} columns={[
            { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
            { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
            { key: "owner", header: "Owner" },
            { key: "status", header: "Registration", render: (row) => <StatusBadge status={row.status} /> },
          ]} />
        </div>
      </section>
    </>
  );
}
