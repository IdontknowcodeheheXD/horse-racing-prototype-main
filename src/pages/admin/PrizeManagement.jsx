import { useState } from "react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { PageHeader, pageIntro } from "./pageUtils";

export default function PrizeManagement() {
  const { data, setData, flash, tournamentById } = useAdminData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ tournamentId: data.tournaments[0]?.id || "", rank: 1, prizeName: "", prizeValue: "" });
  const save = (event) => {
    event.preventDefault();
    setData((current) => ({ ...current, prizes: [{ ...form, id: `P${Date.now()}`, status: "Draft" }, ...current.prizes] }));
    setOpen(false);
    flash("Prize created successfully");
  };
  const publish = (id) => {
    setData((current) => ({ ...current, prizes: current.prizes.map((item) => item.id === id ? { ...item, status: "Published" } : item) }));
    flash("Prize published successfully");
  };
  return (
    <>
      <PageHeader meta={pageIntro.prizes} />
      <div className="toolbar"><button onClick={() => setOpen(true)}>Create Prize</button></div>
      <section className="content-panel">
        <DataTable rows={data.prizes} columns={[
          { key: "tournamentId", header: "Tournament", render: (row) => tournamentById.get(row.tournamentId)?.name },
          { key: "rank", header: "Rank" },
          { key: "prizeName", header: "Prize Name" },
          { key: "prizeValue", header: "Prize Value" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <button onClick={() => publish(row.id)}>Publish Prize</button> },
        ]} />
      </section>
      {open && <Modal title="Create Prize" onClose={() => setOpen(false)}><form className="form-grid" onSubmit={save}>
        <label>Tournament<select value={form.tournamentId} onChange={(e) => setForm({ ...form, tournamentId: e.target.value })}>{data.tournaments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Rank<input type="number" min="1" value={form.rank} onChange={(e) => setForm({ ...form, rank: Number(e.target.value) })} /></label>
        <label>Prize Name<input required value={form.prizeName} onChange={(e) => setForm({ ...form, prizeName: e.target.value })} /></label>
        <label>Prize Value<input required value={form.prizeValue} onChange={(e) => setForm({ ...form, prizeValue: e.target.value })} /></label>
        <button type="submit">Save Prize</button>
      </form></Modal>}
    </>
  );
}
