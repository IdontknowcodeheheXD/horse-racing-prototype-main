import { useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { assignedRaces, finishTimeValue, raceEntries, refereeIntro, RefereePageHeader } from "./refereeUtils";

export default function EnterRaceResult() {
  const { data, setData, flash, raceById, horseById, jockeyById } = useAdminData();
  const races = assignedRaces(data);
  const [form, setForm] = useState({ raceId: races[0]?.id || "", registrationId: "", finishTime: "01:10.00", rank: 1, violationFlag: false });
  const entries = raceEntries(data, form.raceId);
  const selected = entries.find((item) => item.id === form.registrationId) || entries[0];

  const save = (event) => {
    event.preventDefault();
    if (finishTimeValue(form.finishTime) <= 0) {
      flash("Finish time must be greater than 0.", "error");
      return;
    }
    const result = {
      id: `RES${Date.now()}`,
      raceId: form.raceId,
      horseId: selected.horseId,
      jockeyId: selected.jockeyId,
      finishTime: form.finishTime,
      rank: Number(form.rank),
      violationFlag: form.violationFlag,
      officialStatus: "Draft",
    };
    setData((current) => ({ ...current, raceResults: [result, ...current.raceResults.filter((item) => !(item.raceId === result.raceId && item.horseId === result.horseId))] }));
    flash("Temporary result saved");
  };

  return (
    <>
      <RefereePageHeader meta={refereeIntro.result} />
      <section className="content-panel split-panel">
        <form className="form-grid compact" onSubmit={save}>
          <label>Race<select value={form.raceId} onChange={(e) => setForm({ ...form, raceId: e.target.value, registrationId: "" })}>{races.map((item) => <option key={item.id} value={item.id}>{item.round}</option>)}</select></label>
          <label>Horse / Jockey<select value={form.registrationId || selected?.id || ""} onChange={(e) => setForm({ ...form, registrationId: e.target.value })}>{entries.map((item) => <option key={item.id} value={item.id}>{horseById.get(item.horseId)?.name} - {jockeyById.get(item.jockeyId)?.name}</option>)}</select></label>
          <label>Finish Time<input value={form.finishTime} onChange={(e) => setForm({ ...form, finishTime: e.target.value })} placeholder="01:10.00" /></label>
          <label>Rank<input type="number" min="1" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} /></label>
          <label className="check-label"><input type="checkbox" checked={form.violationFlag} onChange={(e) => setForm({ ...form, violationFlag: e.target.checked })} /> Violation Flag</label>
          <button type="submit">Save Temporary Result</button>
        </form>
        <div>
          <h3>Temporary Results</h3>
          <DataTable rows={data.raceResults.filter((item) => item.raceId === form.raceId)} columns={[
            { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
            { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
            { key: "finishTime", header: "Finish Time" },
            { key: "rank", header: "Rank" },
            { key: "officialStatus", header: "Status", render: (row) => <StatusBadge status={row.officialStatus} /> },
          ]} />
        </div>
      </section>
    </>
  );
}
