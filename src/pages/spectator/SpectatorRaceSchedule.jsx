import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function SpectatorRaceSchedule() {
  const { data, tournamentById } = useAdminData();
  const navigate = useNavigate();

  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.schedule} />
      <section className="content-panel">
        <DataTable rows={data.races} columns={[
          { key: "tournamentId", header: "Tournament", render: (row) => tournamentById.get(row.tournamentId)?.name },
          { key: "round", header: "Round" },
          { key: "raceDate", header: "Date", render: (row) => formatDateTime(row.raceDate) },
          { key: "distance", header: "Distance", render: (row) => `${row.distance}m` },
          { key: "track", header: "Track" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <div className="actions"><button onClick={() => navigate(`/spectator/race-detail?raceId=${row.id}`)}>View Detail</button><button onClick={() => navigate(`/spectator/predict?raceId=${row.id}`)}>Predict</button></div> },
        ]} />
      </section>
    </>
  );
}
