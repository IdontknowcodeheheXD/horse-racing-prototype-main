import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, ownerIntro, OwnerPageHeader } from "./ownerUtils";

export default function OwnerRaceList() {
  const { data, tournamentById } = useAdminData();
  const navigate = useNavigate();
  const rows = data.races.filter((race) => ["Open Registration", "Confirmed", "Draft"].includes(race.status) && new Date(race.raceDate) > new Date("2026-05-19T00:00"));
  return (
    <>
      <OwnerPageHeader meta={ownerIntro.races} />
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "tournamentId", header: "Tournament", render: (row) => tournamentById.get(row.tournamentId)?.name },
          { key: "round", header: "Round" },
          { key: "raceDate", header: "Race Date", render: (row) => formatDateTime(row.raceDate) },
          { key: "distance", header: "Distance", render: (row) => `${row.distance}m` },
          { key: "track", header: "Track" },
          { key: "maxHorseWeight", header: "Max Weight", render: (row) => `${row.maxHorseWeight}kg` },
          { key: "maxLanes", header: "Max Lanes" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <button onClick={() => navigate(`/owner/register?raceId=${row.id}`)}>Register</button> },
        ]} />
      </section>
    </>
  );
}
