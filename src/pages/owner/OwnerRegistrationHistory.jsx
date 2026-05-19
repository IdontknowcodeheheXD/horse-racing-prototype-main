import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, ownerIntro, ownerRegistrations, OwnerPageHeader } from "./ownerUtils";

export default function OwnerRegistrationHistory() {
  const { data, raceById, horseById, jockeyById } = useAdminData();
  return (
    <>
      <OwnerPageHeader meta={ownerIntro.history} />
      <section className="content-panel">
        <DataTable rows={ownerRegistrations(data)} columns={[
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "registeredAt", header: "Date", render: (row) => formatDateTime(row.registeredAt) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
