import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { certState, PageHeader, pageIntro } from "./pageUtils";

export default function HorseManagement() {
  const { data } = useAdminData();
  return (
    <>
      <PageHeader meta={pageIntro.horses} />
      <section className="content-panel">
        <DataTable rows={data.horses} columns={[
          { key: "name", header: "Name" },
          { key: "owner", header: "Owner" },
          { key: "breed", header: "Breed" },
          { key: "age", header: "Age" },
          { key: "weight", header: "Weight", render: (row) => `${row.weight}kg` },
          { key: "healthCertExpiry", header: "Health Cert", render: (row) => <span className={`cert ${certState(row.healthCertExpiry).level}`}>{row.healthCertExpiry} - {certState(row.healthCertExpiry).label}</span> },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
