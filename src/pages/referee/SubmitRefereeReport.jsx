import { useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { assignedRaces, formatDateTime, REFEREE_ID, refereeIntro, RefereePageHeader } from "./refereeUtils";

export default function SubmitRefereeReport() {
  const { data, setData, flash, raceById, horseById, jockeyById } = useAdminData();
  const races = assignedRaces(data);
  const [raceId, setRaceId] = useState(races[0]?.id || "");
  const [confirmed, setConfirmed] = useState(false);
  const race = raceById.get(raceId);
  const results = data.raceResults.filter((item) => item.raceId === raceId);
  const violations = data.violationReports.filter((item) => item.raceId === raceId);

  const submit = () => {
    if (!race?.refereeIds?.includes(REFEREE_ID)) {
      flash("Only assigned referee can submit report.", "error");
      return;
    }
    if (!confirmed) {
      flash("Please confirm result before submitting report.", "error");
      return;
    }
    const reportText = violations.map((item) => `${item.violationType} (${item.severity})`).join("; ") || "No violation.";
    setData((current) => ({
      ...current,
      refereeReports: [
        { id: `REP${Date.now()}`, raceId, refereeId: REFEREE_ID, violations: reportText, confirmedResult: true, submittedAt: new Date().toISOString(), status: "Submitted" },
        ...current.refereeReports.filter((item) => !(item.raceId === raceId && item.refereeId === REFEREE_ID)),
      ],
      raceResults: current.raceResults.map((item) => item.raceId === raceId && item.officialStatus !== "Disqualified" ? { ...item, officialStatus: "Official" } : item),
      races: current.races.map((item) => item.id === raceId ? { ...item, status: "Finished" } : item),
    }));
    flash("Referee report submitted");
  };

  return (
    <>
      <RefereePageHeader meta={refereeIntro.submit} />
      <div className="toolbar"><select value={raceId} onChange={(e) => setRaceId(e.target.value)}>{races.map((item) => <option key={item.id} value={item.id}>{item.round}</option>)}</select></div>
      <section className="content-panel">
        <h3>Temporary Race Results</h3>
        <DataTable rows={results} columns={[
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "finishTime", header: "Finish Time" },
          { key: "rank", header: "Rank" },
          { key: "officialStatus", header: "Status", render: (row) => <StatusBadge status={row.officialStatus} /> },
        ]} />
      </section>
      <section className="content-panel">
        <h3>Violation List</h3>
        <DataTable rows={violations} columns={[
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "violationType", header: "Violation Type" },
          { key: "severity", header: "Severity", render: (row) => <StatusBadge status={row.severity} /> },
          { key: "note", header: "Note" },
        ]} />
        <label className="submit-confirm"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /> Confirm Result</label>
        <div className="toolbar footer-toolbar"><button onClick={submit}>Submit Report</button></div>
      </section>
      <section className="content-panel">
        <h3>Current Race</h3>
        <div className="preview-card"><p><strong>Race:</strong> {race?.round}</p><p><strong>Date:</strong> {formatDateTime(race?.raceDate)}</p><p><strong>Assigned:</strong> {race?.refereeIds?.includes(REFEREE_ID) ? "Yes" : "No"}</p></div>
      </section>
    </>
  );
}
