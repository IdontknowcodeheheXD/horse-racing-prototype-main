import { useMemo, useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, PageHeader, pageIntro, registrationWarnings } from "./pageUtils";

export default function RegistrationManagement() {
  const ctx = useAdminData();
  const { data, setData, flash, raceById, horseById, jockeyById } = ctx;
  const [filter, setFilter] = useState("All");
  const rows = useMemo(() => data.registrations.filter((item) => filter === "All" || item.status === filter), [data.registrations, filter]);
  const updateStatus = (id, status) => {
    setData((current) => ({ ...current, registrations: current.registrations.map((item) => item.id === id ? { ...item, status } : item) }));
    flash(`Registration ${status.toLowerCase()} successfully`);
  };

  return (
    <>
      <PageHeader meta={pageIntro.registrations} />
      <div className="toolbar"><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Pending</option><option>Confirmed</option><option>Rejected</option></select></div>
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "owner", header: "Owner" },
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "registeredAt", header: "Registered", render: (row) => formatDateTime(row.registeredAt) },
          { key: "warnings", header: "Warnings", render: (row) => {
            const warnings = registrationWarnings(row, ctx, data.registrations);
            return warnings.length ? <div className="mini-warnings">{warnings.map((warning) => <span key={warning}>{warning}</span>)}</div> : "Clear";
          } },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <div className="actions"><button onClick={() => updateStatus(row.id, "Confirmed")}>Confirm</button><button className="danger" onClick={() => updateStatus(row.id, "Rejected")}>Reject</button></div> },
        ]} />
      </section>
    </>
  );
}
