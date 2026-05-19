export const REFEREE_ID = "RF001";
export const DEMO_NOW = new Date("2026-05-19T09:00");

export const refereeIntro = {
  dashboard: ["Referee Dashboard", "Overview of assigned races, reports, violations and upcoming schedule."],
  assigned: ["Race được phân công", "Races assigned to the current referee."],
  inspection: ["Kiểm tra trước race", "Review horse certificate, horse weight and jockey eligibility before racing."],
  result: ["Nhập kết quả", "Save temporary race results before submitting the official referee report."],
  violation: ["Báo cáo vi phạm", "Record race violations and disqualification decisions."],
  submit: ["Nộp báo cáo", "Confirm temporary results, review violations and submit referee report."],
  history: ["Lịch sử báo cáo", "Submitted and pending referee report records."],
};

export function RefereePageHeader({ meta }) {
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

export function assignedRaces(data, refereeId = REFEREE_ID) {
  return data.races.filter((race) => race.refereeIds?.includes(refereeId));
}

export function raceEntries(data, raceId) {
  return data.registrations.filter((item) => item.raceId === raceId && item.status !== "Rejected" && item.status !== "Expired");
}

export function certState(expiry) {
  const expiryDate = new Date(`${expiry}T00:00`);
  const diffDays = Math.ceil((expiryDate - DEMO_NOW) / 86400000);
  if (diffDays < 0) return { level: "danger", label: "Expired" };
  if (diffDays <= 183) return { level: "warning", label: "Expires within 6 months" };
  return { level: "ok", label: "Valid" };
}

export function inspectionWarnings({ horse, jockey, race }) {
  const warnings = [];
  if (certState(horse.healthCertExpiry).level !== "ok") warnings.push("Horse health certificate failed.");
  if (horse.weight > race.maxHorseWeight) warnings.push("Horse weight exceeds max race weight.");
  if (jockey.status === "Suspended" || jockey.status === "Banned") warnings.push("Jockey status is not eligible.");
  return warnings;
}

export function finishTimeValue(time) {
  if (!time || !time.includes(":")) return 0;
  const [minutes, seconds] = time.split(":");
  return Number(minutes) * 60 + Number(seconds);
}
