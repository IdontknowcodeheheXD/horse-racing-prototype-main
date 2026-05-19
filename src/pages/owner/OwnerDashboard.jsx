import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import { useAdminData } from "../../data/AdminDataContext";
import { certState, formatDateTime, ownerHorses, ownerIntro, ownerRegistrations, OwnerPageHeader } from "./ownerUtils";

export default function OwnerDashboard() {
  const { data, raceById, horseById } = useAdminData();
  const horses = ownerHorses(data);
  const registrations = ownerRegistrations(data);
  const upcoming = data.races.filter((race) => new Date(race.raceDate) >= new Date("2026-05-19T00:00"));
  const certAlerts = horses.filter((horse) => certState(horse.healthCertExpiry).level !== "ok");

  return (
    <>
      <OwnerPageHeader meta={ownerIntro.dashboard} />
      <div className="stat-grid owner-stat-grid">
        <StatCard title="Tổng số ngựa" value={horses.length} note="Owned horses" />
        <StatCard title="Registration pending" value={registrations.filter((item) => item.status === "Pending").length} note="Waiting admin review" />
        <StatCard title="Registration confirmed" value={registrations.filter((item) => item.status === "Confirmed").length} note="Ready to race" />
        <StatCard title="Race sắp tới" value={upcoming.length} note="Available in schedule" />
      </div>
      <section className="content-panel">
        <h3>Upcoming Owner Registrations</h3>
        <DataTable rows={registrations} columns={[
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "raceDate", header: "Race Date", render: (row) => formatDateTime(raceById.get(row.raceId)?.raceDate) },
          { key: "status", header: "Status" },
        ]} />
      </section>
      <section className="content-panel">
        <h3>Health Certificate Alerts</h3>
        <div className="warning-list">
          {certAlerts.map((horse) => <div key={horse.id} className={`warning-box ${certState(horse.healthCertExpiry).level}`}><strong>{horse.name}</strong><span>{certState(horse.healthCertExpiry).label} - {horse.healthCertExpiry}</span></div>)}
          {certAlerts.length === 0 && <div className="warning-box ok">All owner horse certificates are valid for at least 6 months.</div>}
        </div>
      </section>
    </>
  );
}
