export const OWNER_NAME = "Nguyen Racing Stable";
export const DEMO_NOW = new Date("2026-05-19T09:00");

export const ownerIntro = {
  dashboard: ["Owner Dashboard", "Overview of your stable, registrations, upcoming races and certificate alerts."],
  horses: ["Ngựa của tôi", "Manage horses owned by Nguyen Racing Stable."],
  addHorse: ["Thêm ngựa", "Add a new horse profile into local prototype state."],
  races: ["Danh sách cuộc đua", "Browse races currently open for owner registration."],
  register: ["Đăng ký tham gia", "Select a race, one of your horses and an available jockey."],
  history: ["Lịch sử đăng ký", "Track all submitted owner registrations and their approval status."],
  results: ["Kết quả", "Review official and draft race results for your horses."],
};

export function OwnerPageHeader({ meta }) {
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
  const expiryDate = new Date(`${expiry}T00:00`);
  const diffDays = Math.ceil((expiryDate - DEMO_NOW) / 86400000);
  if (diffDays < 0) return { level: "danger", label: "Expired" };
  if (diffDays <= 183) return { level: "warning", label: "Expires within 6 months" };
  return { level: "ok", label: "Valid" };
}

export function ownerHorses(data) {
  return data.horses.filter((horse) => horse.owner === OWNER_NAME);
}

export function ownerRegistrations(data) {
  const ownedIds = new Set(ownerHorses(data).map((horse) => horse.id));
  return data.registrations.filter((registration) => registration.owner === OWNER_NAME || ownedIds.has(registration.horseId));
}

export function registrationErrors({ race, horse, registrations }) {
  const errors = [];
  if (!race) errors.push("Race is required.");
  if (!horse) errors.push("Horse is required.");
  if (!race || !horse) return errors;

  if (certState(horse.healthCertExpiry).level !== "ok") {
    errors.push("Horse health certificate must be valid for at least 6 months.");
  }
  if (horse.weight > race.maxHorseWeight) {
    errors.push(`Horse weight ${horse.weight}kg exceeds race max weight ${race.maxHorseWeight}kg.`);
  }
  if ((new Date(race.raceDate) - DEMO_NOW) / 36e5 < 48) {
    errors.push("Registration must be submitted at least 48 hours before race time.");
  }
  if (registrations.some((item) => item.raceId === race.id && item.horseId === horse.id && item.status !== "Rejected" && item.status !== "Expired")) {
    errors.push("This horse is already registered for the selected race.");
  }
  return errors;
}
