import {
  tournaments as baseTournaments,
  races as baseRaces,
  horses as baseHorses,
  jockeys as baseJockeys,
  referees as baseReferees,
  registrations as baseRegistrations,
  participationData,
  tournamentStats,
  notifications,
  VALID_LOCATIONS,
  VALID_TRACKS,
  type Tournament,
  type Race,
  type Horse,
  type Jockey,
  type Referee,
  type Registration,
  type TournamentStatus,
  type RaceStatus,
  type HorseStatus,
  type JockeyStatus,
} from "./mockData";

export type { Tournament, Race, Horse, Jockey, Referee, Registration, RaceStatus };


// Helper: format YYYY-MM-DD in local time.
function toYMD(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDateYMD(ymd: string, deltaDays: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  return toYMD(dt);
}

function parseRaceDateTime(dateTime: string) {
  // input: "YYYY-MM-DD HH:mm"
  const [datePart, timePart] = dateTime.split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function toRaceDateTimeLocal(dt: Date) {
  const ymd = toYMD(dt);
  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${ymd} ${hh}:${mm}`;
}

function shiftRaceDateTime(dateTime: string, deltaDays: number) {
  const dt = parseRaceDateTime(dateTime);
  dt.setDate(dt.getDate() + deltaDays);
  return toRaceDateTimeLocal(dt);
}

// Make sample data align with real time:
// - Any tournament with status "Ongoing" will be moved to include today.
// - Any tournament with status "Open Registration" will be moved to start in the future.
// - Race dateTimes are shifted accordingly to preserve containment.

const today = new Date();
const todayYMD = toYMD(today);
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

function ymdToDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const ongoingTournaments = baseTournaments.filter(t => t.status === "Ongoing");

const ongoingShiftDays = (() => {
  if (ongoingTournaments.length === 0) return 0;
  // Use the first ongoing tournament to compute shift.
  const t = ongoingTournaments[0];
  const start = ymdToDate(t.startDate);
  const desiredStart = new Date(todayStart);
  desiredStart.setDate(desiredStart.getDate() - 1); // start yesterday so it surely contains today
  const delta = Math.round((desiredStart.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return delta;
})();

// For Open Registration, shift so it starts at least +3 days from today.
const openTournaments = baseTournaments.filter(t => t.status === "Open Registration");
const openShiftDays = (() => {
  if (openTournaments.length === 0) return 0;
  const t = openTournaments[0];
  const start = ymdToDate(t.startDate);
  const desiredStart = new Date(todayStart);
  desiredStart.setDate(desiredStart.getDate() + 3);
  const delta = Math.round((desiredStart.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return delta;
})();

function shiftTournaments() {
  return baseTournaments.map(t => {
    if (t.status === "Ongoing") {
      return {
        ...t,
        startDate: shiftDateYMD(t.startDate, ongoingShiftDays),
        endDate: shiftDateYMD(t.endDate, ongoingShiftDays),
      };
    }
    if (t.status === "Open Registration") {
      return {
        ...t,
        startDate: shiftDateYMD(t.startDate, openShiftDays),
        endDate: shiftDateYMD(t.endDate, openShiftDays),
      };
    }
    return t;
  });
}

function shiftRaces(updatedTournaments: Tournament[]) {
  // Shift each race by the delta for its parent tournament status.
  const tournamentById = new Map(updatedTournaments.map(t => [t.id, t] as const));
  return baseRaces.map(r => {
    const updatedTournament = tournamentById.get(r.tournamentId);
    if (!updatedTournament) return r;

    const originalTournament = baseTournaments.find(t => t.id === r.tournamentId);
    if (!originalTournament) return r;

    let deltaDays = 0;
    if (originalTournament.status === "Ongoing") deltaDays = ongoingShiftDays;
    else if (originalTournament.status === "Open Registration") deltaDays = openShiftDays;
    else deltaDays = 0;

    if (deltaDays === 0) return r;

    return {
      ...r,
      dateTime: shiftRaceDateTime(r.dateTime, deltaDays),
    };
  });
}

export const tournaments: Tournament[] = shiftTournaments();
export const races: Race[] = shiftRaces(tournaments);

// The rest can be reused as-is.
export const horses: Horse[] = baseHorses;
export const jockeys: Jockey[] = baseJockeys;
export const referees: Referee[] = baseReferees;
export const registrations: Registration[] = baseRegistrations;

export { participationData, tournamentStats, notifications, VALID_LOCATIONS, VALID_TRACKS };

