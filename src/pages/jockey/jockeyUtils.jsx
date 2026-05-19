export const JOCKEY_ID = "J001";
export const DEMO_NOW = new Date("2026-05-19T09:00");

export const jockeyIntro = {
  dashboard: ["Jockey Dashboard", "Overview of invitations, confirmed races, upcoming schedule and ranking."],
  invitations: ["Lời mời tham gia", "Accept or reject horse owner invitations to join upcoming races."],
  schedule: ["Lịch thi đấu", "Confirmed race schedule for the selected jockey."],
  performance: ["Thành tích", "Race history, finish time, rank and violation summary."],
  profile: ["Hồ sơ cá nhân", "License, ranking and eligibility information."],
};

export function JockeyPageHeader({ meta }) {
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

export function jockeyRegistrations(data, jockeyId = JOCKEY_ID) {
  return data.registrations.filter((registration) => registration.jockeyId === jockeyId);
}

export function confirmedJockeyRegistrations(data, jockeyId = JOCKEY_ID) {
  return jockeyRegistrations(data, jockeyId).filter((registration) => registration.status === "Confirmed");
}

export function invitationErrors({ invitation, data, raceById, jockey }) {
  const errors = [];
  const race = raceById.get(invitation.raceId);
  if (!race) return ["Race data is missing."];
  if (jockey?.status === "Suspended" || jockey?.status === "Banned") {
    errors.push("Jockey Suspended/Banned cannot accept invitation.");
  }

  const confirmed = confirmedJockeyRegistrations(data, invitation.jockeyId);
  const sameTime = confirmed.find((item) => item.id !== invitation.id && raceById.get(item.raceId)?.raceDate === race.raceDate);
  if (sameTime) errors.push("Jockey cannot join two races at the same time.");

  const sameDayCount = confirmed.filter((item) => raceById.get(item.raceId)?.raceDate.slice(0, 10) === race.raceDate.slice(0, 10)).length;
  const isAlreadyConfirmed = invitation.status === "Confirmed";
  if (!isAlreadyConfirmed && sameDayCount >= 3) errors.push("Jockey cannot ride more than 3 horses in one day.");

  return errors;
}

export function hasScheduleConflict(data, raceById, jockeyId = JOCKEY_ID) {
  const confirmed = confirmedJockeyRegistrations(data, jockeyId);
  const byTime = new Map();
  for (const registration of confirmed) {
    const time = raceById.get(registration.raceId)?.raceDate;
    if (!time) continue;
    byTime.set(time, (byTime.get(time) || 0) + 1);
  }
  return [...byTime.values()].some((count) => count > 1);
}

export function timeToNumber(time) {
  const [minutes, rest] = time.split(":");
  return Number(minutes) * 60 + Number(rest);
}
