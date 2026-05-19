import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useAdminData } from "../../data/AdminDataContext";
import { assignedRaces, certState, inspectionWarnings, raceEntries, refereeIntro, RefereePageHeader } from "./refereeUtils";

export default function RaceInspection() {
  const { data, flash, raceById, horseById, jockeyById } = useAdminData();
  const [params] = useSearchParams();
  const races = assignedRaces(data);
  const [raceId, setRaceId] = useState(params.get("raceId") || races[0]?.id || "");
  const race = raceById.get(raceId);
  const [checks, setChecks] = useState({});
  const rows = raceEntries(data, raceId);
  const setCheck = (id, field, value) => setChecks((current) => ({ ...current, [id]: { ...(current[id] || {}), [field]: value } }));

  return (
    <>
      <RefereePageHeader meta={refereeIntro.inspection} />
      <div className="toolbar"><select value={raceId} onChange={(e) => setRaceId(e.target.value)}>{races.map((item) => <option key={item.id} value={item.id}>{item.round}</option>)}</select></div>
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "cert", header: "Health Certificate", render: (row) => {
            const horse = horseById.get(row.horseId);
            return <span className={`cert ${certState(horse.healthCertExpiry).level}`}>{horse.healthCertExpiry} - {certState(horse.healthCertExpiry).label}</span>;
          } },
          { key: "weight", header: "Horse Weight", render: (row) => `${horseById.get(row.horseId)?.weight}kg / max ${race?.maxHorseWeight}kg` },
          { key: "jockey", header: "Jockey Status", render: (row) => `${jockeyById.get(row.jockeyId)?.name} - ${jockeyById.get(row.jockeyId)?.status}` },
          { key: "pass", header: "Pass", render: (row) => <input type="checkbox" checked={checks[row.id]?.pass || false} onChange={(e) => setCheck(row.id, "pass", e.target.checked)} /> },
          { key: "fail", header: "Fail", render: (row) => <input type="checkbox" checked={checks[row.id]?.fail || false} onChange={(e) => setCheck(row.id, "fail", e.target.checked)} /> },
          { key: "warning", header: "Warning", render: (row) => {
            const warnings = inspectionWarnings({ horse: horseById.get(row.horseId), jockey: jockeyById.get(row.jockeyId), race });
            return warnings.length || checks[row.id]?.fail ? <div className="mini-warnings">{(warnings.length ? warnings : ["Marked as fail by referee."]).map((item) => <span key={item}>{item}</span>)}</div> : "Clear";
          } },
        ]} />
        <div className="toolbar footer-toolbar"><button onClick={() => flash("Inspection checklist saved")}>Save Inspection</button></div>
      </section>
    </>
  );
}
