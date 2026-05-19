import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, invitationErrors, jockeyIntro, jockeyRegistrations, JockeyPageHeader } from "./jockeyUtils";

export default function JockeyInvitation() {
  const ctx = useAdminData();
  const { data, setData, flash, raceById, horseById, tournamentById, jockeyById } = ctx;
  const rows = jockeyRegistrations(data).filter((item) => item.status === "Pending" || item.status === "Rejected" || item.status === "Confirmed");

  const updateStatus = (row, status) => {
    if (status === "Confirmed") {
      const errors = invitationErrors({ invitation: row, data, raceById, jockey: jockeyById.get(row.jockeyId) });
      if (errors.length) {
        flash(errors.join(" "), "error");
        return;
      }
    }
    setData((current) => ({ ...current, registrations: current.registrations.map((item) => item.id === row.id ? { ...item, status } : item) }));
    flash(status === "Confirmed" ? "Invitation accepted successfully" : "Invitation rejected");
  };

  return (
    <>
      <JockeyPageHeader meta={jockeyIntro.invitations} />
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "tournament", header: "Tournament", render: (row) => tournamentById.get(raceById.get(row.raceId)?.tournamentId)?.name },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "owner", header: "Owner" },
          { key: "raceDate", header: "Race Date", render: (row) => formatDateTime(raceById.get(row.raceId)?.raceDate) },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "actions", header: "Actions", render: (row) => <div className="actions"><button onClick={() => updateStatus(row, "Confirmed")}>Accept</button><button className="danger" onClick={() => updateStatus(row, "Rejected")}>Reject</button></div> },
        ]} />
      </section>
    </>
  );
}
