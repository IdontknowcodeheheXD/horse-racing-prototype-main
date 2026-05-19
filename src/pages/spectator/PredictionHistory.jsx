import DataTable from "../../components/DataTable";
import { useAdminData } from "../../data/AdminDataContext";
import { predictionResult, SPECTATOR_ID, spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function PredictionHistory() {
  const { data, raceById, horseById } = useAdminData();
  const rows = data.predictions.filter((item) => item.spectatorId === SPECTATOR_ID);
  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.history} />
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "predictedRank", header: "Predicted Rank", render: (row) => row.predictedHorseIds.map((id, index) => `${index + 1}. ${horseById.get(id)?.name}`).join(" | ") },
          { key: "result", header: "Result", render: (row) => predictionResult(data, row).text },
          { key: "rewardPoints", header: "Reward Points", render: (row) => predictionResult(data, row).points },
        ]} />
      </section>
    </>
  );
}
