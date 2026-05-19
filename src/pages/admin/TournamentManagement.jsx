import { useState } from "react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { PageHeader, pageIntro } from "./pageUtils";

const emptyTournament = { name: "", startDate: "", endDate: "", location: "", status: "Draft" };

export default function TournamentManagement() {
  const { data, setData, flash } = useAdminData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyTournament);

  const save = (event) => {
    event.preventDefault();
    const item = { ...form, id: `T${String(Date.now()).slice(-4)}` };
    setData((current) => ({ ...current, tournaments: [item, ...current.tournaments] }));
    setForm(emptyTournament);
    setOpen(false);
    flash("Tournament created successfully");
  };

  const remove = (id) => {
    setData((current) => ({ ...current, tournaments: current.tournaments.filter((item) => item.id !== id) }));
    flash("Tournament deleted in mock state");
  };

  return (
    <>
      <PageHeader meta={pageIntro.tournaments} />
      <div className="toolbar"><button onClick={() => setOpen(true)}>Create Tournament</button></div>
      <section className="content-panel">
        <DataTable rows={data.tournaments} columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Name" },
          { key: "startDate", header: "Start" },
          { key: "endDate", header: "End" },
          { key: "location", header: "Location" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <div className="actions"><button onClick={() => flash(`Viewing ${row.name}`)}>View</button><button onClick={() => flash(`Edit simulated for ${row.name}`)}>Edit</button><button className="danger" onClick={() => remove(row.id)}>Delete</button></div> },
        ]} />
      </section>
      {open && <Modal title="Create Tournament" onClose={() => setOpen(false)}><form className="form-grid" onSubmit={save}>
        {["name", "startDate", "endDate", "location"].map((field) => <label key={field}>{field}<input required type={field.includes("Date") ? "date" : "text"} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /></label>)}
        <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Draft</option><option>Confirmed</option><option>In Progress</option></select></label>
        <button type="submit">Save Tournament</button>
      </form></Modal>}
    </>
  );
}
