import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { useAdminData } from "../../data/AdminDataContext";
import { ownerHorses, ownerIntro, OwnerPageHeader } from "./ownerUtils";

export default function OwnerResultView() {
  const { data, raceById, horseById, jockeyById } = useAdminData();
  const horseIds = new Set(ownerHorses(data).map((horse) => horse.id));
  const rows = data.raceResults.filter((result) => horseIds.has(result.horseId));

  return (
    <>
      <OwnerPageHeader meta={ownerIntro.results} />
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "horseId", header: "Horse", render: (row) => horseById.get(row.horseId)?.name },
          { key: "jockeyId", header: "Jockey", render: (row) => jockeyById.get(row.jockeyId)?.name },
          { key: "finishTime", header: "Finish Time" },
          { key: "rank", header: "Rank" },
          { key: "violationFlag", header: "Violation", render: (row) => row.violationFlag ? "Yes" : "No" },
          { key: "officialStatus", header: "Official Status", render: (row) => <StatusBadge status={row.officialStatus} /> },
        ]} />
      </section>
    </>
  );
}
