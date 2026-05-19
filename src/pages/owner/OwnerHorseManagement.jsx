import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { certState, ownerHorses, ownerIntro, OwnerPageHeader } from "./ownerUtils";

export default function OwnerHorseManagement() {
  const { data } = useAdminData();
  return (
    <>
      <OwnerPageHeader meta={ownerIntro.horses} />
      <section className="content-panel">
        <DataTable rows={ownerHorses(data)} columns={[
          { key: "name", header: "Name" },
          { key: "breed", header: "Breed" },
          { key: "age", header: "Age" },
          { key: "weight", header: "Weight", render: (row) => `${row.weight}kg` },
          { key: "healthCertExpiry", header: "Health Certificate", render: (row) => <span className={`cert ${certState(row.healthCertExpiry).level}`}>{row.healthCertExpiry} - {certState(row.healthCertExpiry).label}</span> },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
