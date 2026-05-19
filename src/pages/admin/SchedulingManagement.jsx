import { useMemo, useState } from "react";
import DataTable from "../../components/DataTable";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, PageHeader, pageIntro } from "./pageUtils";

export default function SchedulingManagement() {
  const { data, setData, flash, raceById, horseById, jockeyById } = useAdminData();
  const [raceId, setRaceId] = useState(data.races[0]?.id || "");
  const selectedRace = raceById.get(raceId);
  const entries = useMemo(() => data.registrations.filter((item) => item.raceId === raceId && item.status !== "Rejected"), [data.registrations, raceId]);
  const sameDay = data.registrations.filter((item) => raceById.get(item.raceId)?.raceDate.slice(0, 10) === selectedRace?.raceDate.slice(0, 10));
  const conflicts = [
    ...entries.filter((entry) => sameDay.some((item) => item.id !== entry.id && item.horseId === entry.horseId)).map((entry) => `${horseById.get(entry.horseId)?.name} has another race that day`),
    ...entries.filter((entry) => sameDay.some((item) => item.id !== entry.id && item.jockeyId === entry.jockeyId)).map((entry) => `${jockeyById.get(entry.jockeyId)?.name} has another race that day`),
    entries.length > (selectedRace?.maxLanes || 0) ? `Race exceeds max lanes (${selectedRace?.maxLanes})` : "",
  ].filter(Boolean);

  const assignLane = (registrationId, lane) => {
    setData((current) => ({ ...current, registrations: current.registrations.map((item) => item.id === registrationId ? { ...item, lane: Number(lane) } : item) }));
    flash("Lane assigned successfully");
  };

  return (
    <>
      <PageHeader meta={pageIntro.scheduling} />
      <div className="toolbar"><select value={raceId} onChange={(e) => setRaceId(e.target.value)}>{data.races.map((race) => <option key={race.id} value={race.id}>{race.round} - {formatDateTime(race.raceDate)}</option>)}</select></div>
      <section className="content-panel split-panel">
        <div>
          <h3>Registered Horse/Jockey</h3>
          <DataTable rows={entries} columns={[
            { key: "lane", header: "Lane", render: (row) => <input className="lane-input" type="number" min="1" max={selectedRace?.maxLanes} value={row.lane || ""} onChange={(e) => assignLane(row.id, e.target.value)} /> },
            { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
            { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
            { key: "status", header: "Status" },
          ]} />
        </div>
        <div>
          <h3>Race Order</h3>
          <div className="order-box">Order #{selectedRace?.raceOrder} on {selectedRace?.track}</div>
          <h3>Conflict Warning</h3>
          <div className={conflicts.length ? "warning-box danger" : "warning-box ok"}>{conflicts.length ? conflicts.map((item) => <p key={item}>{item}</p>) : "No schedule conflict detected."}</div>
        </div>
      </section>
    </>
  );
}
