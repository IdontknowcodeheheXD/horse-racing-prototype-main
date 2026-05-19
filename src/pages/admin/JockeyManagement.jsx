import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { PageHeader, pageIntro } from "./pageUtils";

export default function JockeyManagement() {
  const { data } = useAdminData();
  return (
    <>
      <PageHeader meta={pageIntro.jockeys} />
      <section className="content-panel">
        <DataTable rows={data.jockeys} columns={[
          { key: "licenseNo", header: "License No" },
          { key: "name", header: "Name" },
          { key: "weight", header: "Weight", render: (row) => `${row.weight}kg` },
          { key: "ranking", header: "Ranking", render: (row) => `#${row.ranking}` },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
