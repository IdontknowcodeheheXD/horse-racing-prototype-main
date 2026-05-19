import { useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { assignedRaces, raceEntries, REFEREE_ID, refereeIntro, RefereePageHeader } from "./refereeUtils";

export default function ViolationReport() {
  const { data, setData, flash, horseById, jockeyById } = useAdminData();
  const races = assignedRaces(data);
  const [form, setForm] = useState({ raceId: races[0]?.id || "", registrationId: "", violationType: "Lane interference", severity: "Minor", note: "" });
  const entries = raceEntries(data, form.raceId);
  const selected = entries.find((item) => item.id === form.registrationId) || entries[0];

  const save = (event) => {
    event.preventDefault();
    const report = { id: `V${Date.now()}`, raceId: form.raceId, horseId: selected.horseId, jockeyId: selected.jockeyId, refereeId: REFEREE_ID, violationType: form.violationType, severity: form.severity, note: form.note, createdAt: new Date().toISOString() };
    setData((current) => ({
      ...current,
      violationReports: [report, ...current.violationReports],
      raceResults: current.raceResults.map((item) => item.raceId === report.raceId && item.horseId === report.horseId ? { ...item, violationFlag: true, officialStatus: report.severity === "Disqualified" ? "Disqualified" : item.officialStatus } : item),
    }));
    flash("Violation report saved");
  };

  return (
    <>
      <RefereePageHeader meta={refereeIntro.violation} />
      <section className="content-panel split-panel">
        <form className="form-grid compact" onSubmit={save}>
          <label>Race<select value={form.raceId} onChange={(e) => setForm({ ...form, raceId: e.target.value, registrationId: "" })}>{races.map((item) => <option key={item.id} value={item.id}>{item.round}</option>)}</select></label>
          <label>Horse / Jockey<select value={form.registrationId || selected?.id || ""} onChange={(e) => setForm({ ...form, registrationId: e.target.value })}>{entries.map((item) => <option key={item.id} value={item.id}>{horseById.get(item.horseId)?.name} - {jockeyById.get(item.jockeyId)?.name}</option>)}</select></label>
          <label>Violation Type<input value={form.violationType} onChange={(e) => setForm({ ...form, violationType: e.target.value })} /></label>
          <label>Severity<select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}><option>Minor</option><option>Major</option><option>Disqualified</option></select></label>
          <label>Note<input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
          <button type="submit">Save Violation</button>
        </form>
        <div>
          <h3>Violation List</h3>
          <DataTable rows={data.violationReports.filter((item) => item.refereeId === REFEREE_ID)} columns={[
            { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
            { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
            { key: "violationType", header: "Type" },
            { key: "severity", header: "Severity", render: (row) => <StatusBadge status={row.severity} /> },
          ]} />
        </div>
      </section>
    </>
  );
}
