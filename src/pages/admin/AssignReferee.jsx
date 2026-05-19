import { useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, PageHeader, pageIntro } from "./pageUtils";

export default function AssignReferee() {
  const { data, setData, flash, refereeById } = useAdminData();
  const [raceId, setRaceId] = useState(data.races[0]?.id || "");
  const [refereeId, setRefereeId] = useState(data.referees[0]?.id || "");
  const race = data.races.find((item) => item.id === raceId);
  const conflict = data.races.some((item) => item.id !== raceId && item.raceDate === race?.raceDate && item.refereeIds?.includes(refereeId));

  const assign = () => {
    if (conflict) return flash("Referee schedule conflict detected", "error");
    setData((current) => ({ ...current, races: current.races.map((item) => item.id === raceId ? { ...item, refereeIds: Array.from(new Set([...(item.refereeIds || []), refereeId])) } : item) }));
    flash("Referee assigned successfully");
  };

  return (
    <>
      <PageHeader meta={pageIntro.referees} />
      <section className="content-panel split-panel">
        <div>
          <h3>Race List</h3>
          <DataTable rows={data.races} columns={[
            { key: "round", header: "Race" },
            { key: "raceDate", header: "Date", render: (row) => formatDateTime(row.raceDate) },
            { key: "refereeIds", header: "Referees", render: (row) => row.refereeIds?.length ? row.refereeIds.map((id) => refereeById.get(id)?.name).join(", ") : <span className="inline-warning">No referee assigned</span> },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]} />
        </div>
        <div>
          <h3>Assign Referee</h3>
          <div className="form-grid compact">
            <label>Race<select value={raceId} onChange={(e) => setRaceId(e.target.value)}>{data.races.map((item) => <option key={item.id} value={item.id}>{item.round}</option>)}</select></label>
            <label>Referee<select value={refereeId} onChange={(e) => setRefereeId(e.target.value)}>{data.referees.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <button onClick={assign}>Assign</button>
          </div>
          <div className={conflict ? "warning-box danger" : "warning-box ok"}>{conflict ? "This referee is already assigned to another race at the same time." : "No referee time conflict."}</div>
        </div>
      </section>
    </>
  );
}
