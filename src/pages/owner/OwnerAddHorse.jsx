import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminData } from "../../data/AdminDataContext";
import { OWNER_NAME, ownerIntro, OwnerPageHeader } from "./ownerUtils";

export default function OwnerAddHorse() {
  const { setData, flash } = useAdminData();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", breed: "", age: 4, weight: 480, healthCertExpiry: "" });
  const submit = (event) => {
    event.preventDefault();
    const horse = { ...form, id: `H${Date.now()}`, owner: OWNER_NAME, age: Number(form.age), weight: Number(form.weight), status: "Active" };
    setData((current) => ({ ...current, horses: [horse, ...current.horses] }));
    flash("Horse added successfully");
    navigate("/owner/horses");
  };

  return (
    <>
      <OwnerPageHeader meta={ownerIntro.addHorse} />
      <section className="content-panel">
        <form className="form-grid" onSubmit={submit}>
          <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Breed<input required value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} /></label>
          <label>Age<input required type="number" min="2" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></label>
          <label>Weight<input required type="number" min="300" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></label>
          <label>Health Cert Expiry<input required type="date" value={form.healthCertExpiry} onChange={(e) => setForm({ ...form, healthCertExpiry: e.target.value })} /></label>
          <button type="submit">Add Horse</button>
        </form>
      </section>
    </>
  );
}
