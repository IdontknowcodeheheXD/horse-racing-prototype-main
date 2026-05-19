export const pageIntro = {
  dashboard: ["Dashboard", "Overview of tournaments, upcoming races, health certificate risks and pending steward work."],
  tournaments: ["Giải đấu", "Create, view, edit and delete tournament records in mock state."],
  races: ["Cuộc đua", "Manage race rounds, track setup, lane limits and race status."],
  registrations: ["Đăng ký", "Review registrations and enforce health, weight, deadline and jockey workload rules."],
  scheduling: ["Lịch đua", "Assign lanes, inspect race order and simulate scheduling conflicts."],
  referees: ["Trọng tài", "Assign referees to races and surface missing or conflicting steward schedules."],
  horses: ["Ngựa", "Monitor horse profile, owner, breed, racing weight and certificate validity."],
  jockeys: ["Nài ngựa", "Track jockey license, weight, ranking and competition eligibility."],
  reports: ["Báo cáo trọng tài", "Review referee report submission and confirmed race result status."],
  results: ["Kết quả & Xếp hạng", "Publish official race results after referee confirmation and calculate ranking tables."],
  prizes: ["Giải thưởng", "Create and publish tournament prize definitions."],
  notifications: ["Thông báo", "Create and send operational notifications to race participants."],
  exports: ["Xuất báo cáo", "Simulate PDF and Excel export actions for admin reports."],
};

export function PageHeader({ meta }) {
  return (
    <div className="page-header">
      <h2>{meta[0]}</h2>
      <p>{meta[1]}</p>
    </div>
  );
}

export function formatDateTime(value) {
  if (!value) return "Pending";
  return new Date(value).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function certState(expiry) {
  const today = new Date("2026-05-19T00:00");
  const expiryDate = new Date(`${expiry}T00:00`);
  const diffDays = Math.ceil((expiryDate - today) / 86400000);
  if (diffDays < 0) return { level: "danger", label: "Expired" };
  if (diffDays <= 183) return { level: "warning", label: "Expires within 6 months" };
  return { level: "ok", label: "Valid" };
}

export function registrationWarnings(reg, maps, allRegistrations) {
  const race = maps.raceById.get(reg.raceId);
  const horse = maps.horseById.get(reg.horseId);
  const jockey = maps.jockeyById.get(reg.jockeyId);
  if (!race || !horse || !jockey) return ["Missing linked data"];

  const warnings = [];
  if (certState(horse.healthCertExpiry).level !== "ok") warnings.push("Horse health certificate expired or under 6-month validity rule");
  if (horse.weight > race.maxHorseWeight) warnings.push("Horse overweight");
  if ((new Date(race.raceDate) - new Date(reg.registeredAt)) / 36e5 < 48) warnings.push("Registration later than 48 hours before race");

  const sameDay = allRegistrations.filter((item) => {
    const itemRace = maps.raceById.get(item.raceId);
    return item.jockeyId === reg.jockeyId && itemRace && itemRace.raceDate.slice(0, 10) === race.raceDate.slice(0, 10);
  });
  if (sameDay.length > 3) warnings.push("Jockey already has 3 races in the same day");
  return warnings;
}

export function timeToNumber(time) {
  const [minutes, rest] = time.split(":");
  return Number(minutes) * 60 + Number(rest);
}
