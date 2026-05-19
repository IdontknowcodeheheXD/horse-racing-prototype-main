import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import { useAdminData } from "../../data/AdminDataContext";
import { formatDateTime, predictionResult, rewardTotal, SPECTATOR_ID, spectatorIntro, SpectatorPageHeader } from "./spectatorUtils";

export default function RewardPoints() {
  const { data, raceById } = useAdminData();
  const predictedRewards = data.predictions
    .filter((item) => item.spectatorId === SPECTATOR_ID)
    .map((item) => ({ id: `CALC-${item.id}`, raceId: item.raceId, description: predictionResult(data, item).text, points: predictionResult(data, item).points, createdAt: item.submittedAt }));
  const rows = [...data.rewardHistory.filter((item) => item.spectatorId === SPECTATOR_ID), ...predictedRewards];

  return (
    <>
      <SpectatorPageHeader meta={spectatorIntro.rewards} />
      <div className="stat-grid owner-stat-grid">
        <StatCard title="Reward points hiện tại" value={rewardTotal(data) + predictedRewards.reduce((sum, item) => sum + item.points, 0)} note="Stored + calculated prediction rewards" />
        <StatCard title="Correct top 3 bonus" value="50" note="Exact top-3 order" />
        <StatCard title="Top-3 match" value="10" note="Per horse in top 3" />
        <StatCard title="Reward records" value={rows.length} note="History rows" />
      </div>
      <section className="content-panel">
        <DataTable rows={rows} columns={[
          { key: "raceId", header: "Race", render: (row) => raceById.get(row.raceId)?.round },
          { key: "description", header: "Description" },
          { key: "points", header: "Points" },
          { key: "createdAt", header: "Date", render: (row) => formatDateTime(row.createdAt) },
        ]} />
      </section>
    </>
  );
}
