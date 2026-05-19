import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { assignedRaces, formatDateTime, refereeIntro, RefereePageHeader } from "./refereeUtils";

export default function AssignedRace() {
  const { data, flash, tournamentById } = useAdminData();
  const navigate = useNavigate();
  return (
    <>
      <RefereePageHeader meta={refereeIntro.assigned} />
      <section className="content-panel">
        <DataTable rows={assignedRaces(data)} columns={[
          { key: "tournamentId", header: "Tournament", render: (row) => tournamentById.get(row.tournamentId)?.name },
          { key: "round", header: "Race" },
          { key: "raceDate", header: "Date", render: (row) => formatDateTime(row.raceDate) },
          { key: "track", header: "Track" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <div className="actions"><button onClick={() => flash(`${row.round} on ${row.track}`)}>View Detail</button><button onClick={() => navigate(`/referee/inspection?raceId=${row.id}`)}>Inspect</button></div> },
        ]} />
      </section>
    </>
  );
}
