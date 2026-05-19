import { useState } from "react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, PageHeader, pageIntro } from "./pageUtils";

const emptyRace = { tournamentId: "T001", round: "", raceDate: "", distance: 1200, track: "", maxHorseWeight: 500, maxLanes: 6, status: "Draft" };

export default function RaceManagement() {
  const { data, setData, flash, tournamentById } = useAdminData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyRace);

  const save = (event) => {
    event.preventDefault();
    setData((current) => ({ ...current, races: [{ ...form, id: `R${String(Date.now()).slice(-4)}`, refereeIds: [], raceOrder: current.races.length + 1 }, ...current.races] }));
    setOpen(false);
    setForm(emptyRace);
    flash("Race created successfully");
  };

  return (
    <>
      <PageHeader meta={pageIntro.races} />
      <div className="toolbar"><button onClick={() => setOpen(true)}>Create Race</button></div>
      <section className="content-panel">
        <DataTable rows={data.races} columns={[
          { key: "id", header: "ID" },
          { key: "tournamentId", header: "Tournament", render: (row) => tournamentById.get(row.tournamentId)?.name || row.tournamentId },
          { key: "round", header: "Round" },
          { key: "raceDate", header: "Date", render: (row) => formatDateTime(row.raceDate) },
          { key: "distance", header: "Distance", render: (row) => `${row.distance}m` },
          { key: "track", header: "Track" },
          { key: "maxHorseWeight", header: "Max Weight", render: (row) => `${row.maxHorseWeight}kg` },
          { key: "maxLanes", header: "Lanes" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <div className="actions"><button onClick={() => flash(`Viewing ${row.round}`)}>View</button><button onClick={() => flash(`Edit simulated for ${row.round}`)}>Edit</button><button className="danger" onClick={() => setData((current) => ({ ...current, races: current.races.filter((item) => item.id !== row.id) }))}>Delete</button></div> },
        ]} />
      </section>
      {open && <Modal title="Create Race" onClose={() => setOpen(false)}><form className="form-grid" onSubmit={save}>
        <label>Tournament<select value={form.tournamentId} onChange={(e) => setForm({ ...form, tournamentId: e.target.value })}>{data.tournaments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Round<input required value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} /></label>
        <label>Race Date<input required type="datetime-local" value={form.raceDate} onChange={(e) => setForm({ ...form, raceDate: e.target.value })} /></label>
        <label>Distance<input type="number" value={form.distance} onChange={(e) => setForm({ ...form, distance: Number(e.target.value) })} /></label>
        <label>Track<input required value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })} /></label>
        <label>Max Horse Weight<input type="number" value={form.maxHorseWeight} onChange={(e) => setForm({ ...form, maxHorseWeight: Number(e.target.value) })} /></label>
        <label>Max Lanes<input type="number" value={form.maxLanes} onChange={(e) => setForm({ ...form, maxLanes: Number(e.target.value) })} /></label>
        <button type="submit">Save Race</button>
      </form></Modal>}
    </>
  );
}
