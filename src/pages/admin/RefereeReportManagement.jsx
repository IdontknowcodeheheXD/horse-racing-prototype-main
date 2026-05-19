import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, PageHeader, pageIntro } from "./pageUtils";

export default function RefereeReportManagement() {
  const { data, flash, raceById, refereeById } = useAdminData();
  return (
    <>
      <PageHeader meta={pageIntro.reports} />
      <section className="content-panel">
        <DataTable rows={data.refereeReports} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "refereeId", header: "Referee", render: (row) => refereeById.get(row.refereeId)?.name || "Unassigned" },
          { key: "violations", header: "Violations", render: (row) => row.violations || "Pending review" },
          { key: "confirmedResult", header: "Confirmed Result", render: (row) => row.confirmedResult ? "Yes" : "No" },
          { key: "submittedAt", header: "Submitted At", render: (row) => formatDateTime(row.submittedAt) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.submittedAt ? "Submitted" : "Pending"} /> },
          { key: "actions", header: "Actions", render: (row) => <button onClick={() => flash(`Report detail: ${row.violations || "No submission yet"}`)}>View Detail</button> },
        ]} />
      </section>
    </>
  );
}
