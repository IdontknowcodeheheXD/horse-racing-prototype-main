import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, REFEREE_ID, refereeIntro, RefereePageHeader } from "./refereeUtils";

export default function RefereeReportHistory() {
  const { data, raceById } = useAdminData();
  const rows = data.refereeReports.filter((item) => item.refereeId === REFEREE_ID);
  return (
    <>
      <RefereePageHeader meta={refereeIntro.history} />
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "submittedAt", header: "Submitted At", render: (row) => formatDateTime(row.submittedAt) },
          { key: "confirmedResult", header: "Confirmed Result", render: (row) => row.confirmedResult ? "Yes" : "No" },
          { key: "violations", header: "Violations", render: (row) => row.violations || "Pending" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]} />
      </section>
    </>
  );
}
