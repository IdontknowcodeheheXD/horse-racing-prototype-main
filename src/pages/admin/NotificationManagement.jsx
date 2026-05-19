import { useState } from "react";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, PageHeader, pageIntro } from "./pageUtils";

export default function NotificationManagement() {
  const { data, setData, flash } = useAdminData();
  const [form, setForm] = useState({ type: "Race Schedule", title: "", message: "" });
  const create = (event) => {
    event.preventDefault();
    setData((current) => ({ ...current, notifications: [{ ...form, id: `N${Date.now()}`, status: "Draft", createdAt: new Date().toISOString() }, ...current.notifications] }));
    setForm({ type: "Race Schedule", title: "", message: "" });
    flash("Notification created successfully");
  };
  const send = (id) => {
    setData((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === id ? { ...item, status: "Sent" } : item) }));
    flash("Notification sent successfully");
  };
  return (
    <>
      <PageHeader meta={pageIntro.notifications} />
      <section className="content-panel">
        <form className="form-grid inline-form" onSubmit={create}>
          <label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Race Schedule</option><option>Race Delay</option><option>Result Published</option><option>Prize Announcement</option></select></label>
          <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Message<input required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
          <button type="submit">Create Notification</button>
        </form>
      </section>
      <section className="content-panel">
        <DataTable rows={data.notifications} columns={[
          { key: "type", header: "Type" },
          { key: "title", header: "Title" },
          { key: "message", header: "Message" },
          { key: "createdAt", header: "Created", render: (row) => formatDateTime(row.createdAt) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <button onClick={() => send(row.id)}>Send</button> },
        ]} />
      </section>
    </>
  );
}
