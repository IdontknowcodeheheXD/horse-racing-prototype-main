export const SPECTATOR_ID = "SP001";
export const DEMO_NOW = new Date("2026-05-19T09:00");

export const spectatorIntro = {
  dashboard: ["Spectator Dashboard", "Upcoming races, prediction activity, reward points and live race highlights."],
  schedule: ["Lịch đua", "Browse tournament race schedule and open prediction flow."],
  detail: ["Chi tiết cuộc đua", "Race information, track, distance and participating horse/jockey pairs."],
  predict: ["Dự đoán", "Submit your predicted top 3 horses before the race starts."],
  history: ["Lịch sử dự đoán", "Review submitted predictions, result matching and reward points."],
  live: ["Kết quả trực tiếp", "Live and official race result board."],
  ranking: ["Xếp hạng", "Tournament ranking excluding disqualified horses."],
  rewards: ["Điểm thưởng", "Reward points earned from correct top-3 predictions."],
};

export function SpectatorPageHeader({ meta }) {
  return (
    <div className="page-header">
      <h2>{meta[0]}</h2>
      <p>{meta[1]}</p>
    </div>
  );
}

export function formatDateTime(value) {
  if (!value) return "Pending";
  return new Date(value).toLocaleString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function raceStarted(race) {
  return race && new Date(race.raceDate) <= DEMO_NOW;
}

export function raceEntries(data, raceId) {
  return data.registrations.filter((item) => item.raceId === raceId && item.status !== "Rejected" && item.status !== "Expired");
}

export function reportSubmitted(data, raceId) {
  return data.refereeReports.some((report) => report.raceId === raceId && report.status === "Submitted");
}

export function officialStatusForRace(data, raceId) {
  return reportSubmitted(data, raceId) ? "Official" : "Unofficial";
}

export function rewardTotal(data) {
  return data.rewardHistory.filter((item) => item.spectatorId === SPECTATOR_ID).reduce((sum, item) => sum + Number(item.points || 0), 0);
}

export function top3ResultHorseIds(data, raceId) {
  return data.raceResults
    .filter((item) => item.raceId === raceId && item.officialStatus !== "Disqualified")
    .slice()
    .sort((a, b) => Number(a.rank) - Number(b.rank))
    .slice(0, 3)
    .map((item) => item.horseId);
}

export function predictionResult(data, prediction) {
  const top3 = top3ResultHorseIds(data, prediction.raceId);
  if (top3.length < 3) return { text: "Pending result", points: prediction.rewardPoints || 0 };
  const exact = prediction.predictedHorseIds.every((horseId, index) => top3[index] === horseId);
  if (exact) return { text: "Correct top 3", points: 50 };
  const matches = prediction.predictedHorseIds.filter((horseId) => top3.includes(horseId)).length;
  return { text: `${matches} top-3 match${matches === 1 ? "" : "es"}`, points: matches * 10 };
}
