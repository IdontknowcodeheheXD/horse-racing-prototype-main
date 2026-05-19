import { createContext, useContext, useState, ReactNode } from "react";
import {
  tournaments as seedTournaments,
  races as seedRaces,
  horses as seedHorses,
  jockeys as seedJockeys,
  referees as seedReferees,
  registrations as seedRegistrations,
  RaceStatus,
  VALID_LOCATIONS,
  VALID_TRACKS,
  type Tournament,
  type Race,
  type Horse,
  type Jockey,
  type Referee,
  type Registration,
} from "@/data/mockDataDynamic";



// Business Rule Validation Functions
const isValidLocation = (location: string): boolean => VALID_LOCATIONS.includes(location);
const isValidTrack = (track: string): boolean => VALID_TRACKS.includes(track);
const isValidDistance = (distance: number): boolean => distance >= 800 && distance <= 4000;
const isToday = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};
const isInFuture = (date: string): boolean => new Date(date) > new Date();
const isInPast = (date: string): boolean => new Date(date) < new Date();
const isSameOrAfterToday = (date: string): boolean => !isInPast(date);

// Tournament validations (BR-001 to BR-034)
const isTournamentNameDuplicate = (name: string, tournaments: Tournament[], excludeId?: string): boolean => {
  return tournaments.some(t => t.name === name && (!excludeId || t.id !== excludeId) && t.status !== "Cancelled");
};

const isTournamentOverlapAtLocation = (
  location: string,
  startDate: string,
  endDate: string,
  tournaments: Tournament[],
  excludeId?: string
): boolean => {
  return tournaments.some(t => {
    if ((!excludeId || t.id !== excludeId) && t.location === location && t.status !== "Cancelled") {
      const tStart = new Date(t.startDate);
      const tEnd = new Date(t.endDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      return !(newEnd < tStart || newStart > tEnd);
    }
    return false;
  });
};

const canTransitionTournamentStatus = (
  from: Tournament["status"],
  to: Tournament["status"]
): boolean => {
  const validTransitions: Record<Tournament["status"], Tournament["status"][]> = {
    "Draft": ["Open Registration", "Cancelled"],
    "Open Registration": ["Ongoing", "Cancelled"],
    "Ongoing": ["Finished", "Cancelled"],
    "Finished": [],
    "Cancelled": [],
  };
  return validTransitions[from]?.includes(to) ?? false;
};

// Race validations (BR-035 to BR-073)
const isRaceOrderDuplicate = (
  raceOrder: string,
  tournamentId: string,
  races: Race[],
  excludeId?: string
): boolean => {
  return races.some(r => 
    r.tournamentId === tournamentId && 
    r.round === raceOrder && 
    (!excludeId || r.id !== excludeId)
  );
};

const hasTrackOverlap = (
  track: string,
  dateTime: string,
  races: Race[],
  excludeId?: string
): boolean => {
  const raceStart = new Date(dateTime);
  const raceEnd = new Date(raceStart.getTime() + 3 * 60 * 60 * 1000); // Assume 3 hour race
  
  return races.some(r => {
    if (r.track !== track || (excludeId && r.id === excludeId)) return false;
    const otherStart = new Date(r.dateTime);
    const otherEnd = new Date(otherStart.getTime() + 3 * 60 * 60 * 1000);
    return !(raceEnd <= otherStart || raceStart >= otherEnd);
  });
};

const canTransitionRaceStatus = (
  from: RaceStatus,
  to: RaceStatus
): boolean => {
  const validTransitions: Record<RaceStatus, RaceStatus[]> = {
    "Draft": ["Draft", "Open", "Cancelled"],
    "Open": ["Open", "Ongoing", "Cancelled"],
    "Ongoing": ["Ongoing", "Finished", "Cancelled"],
    "Finished": ["Finished"],
    "Cancelled": ["Cancelled"],
  };
  return validTransitions[from]?.includes(to) ?? false;
};

// Horse validations
const isHorseEligible = (horse: Horse): boolean => {
  return (
    horse.status === "Hoạt động" &&
    new Date(horse.certExpiry) > new Date()
  );
};

interface DataCtx {
  tournaments: Tournament[];
  races: Race[];
  horses: Horse[];
  jockeys: Jockey[];
  referees: Referee[];
  registrations: Registration[];
  addTournament: (t: Omit<Tournament, "id" | "totalRaces">) => { success: boolean; message?: string; tournament?: Tournament };
  updateTournament: (t: Tournament) => { success: boolean; message?: string };
  deleteTournament: (id: string) => { success: boolean; message?: string };
  addRace: (r: Omit<Race, "id" | "tournamentName" | "refereeReportSubmitted">) => { success: boolean; message?: string; race?: Race };
  updateRace: (r: Race) => { success: boolean; message?: string };
  deleteRace: (id: string) => { success: boolean; message?: string };
  addHorse: (h: Omit<Horse, "id">) => Horse;
  updateHorse: (h: Horse) => void;
  deleteHorse: (id: string) => void;
  addJockey: (j: Omit<Jockey, "id">) => Jockey;
  updateJockey: (j: Jockey) => void;
  deleteJockey: (id: string) => void;
  updateRegistrationStatus: (id: string, status: Registration["status"]) => void;
  registerForRace: (data: { raceId: string; horseId: string; jockeyId: string }) => { success: boolean; message?: string };
  assignReferee: (raceId: string, refereeId?: string) => void;
  // Validation helpers
  validateTournament: (t: Omit<Tournament, "id" | "totalRaces">, excludeId?: string) => { valid: boolean; errors: string[] };
  validateRace: (r: Omit<Race, "id" | "tournamentName" | "refereeReportSubmitted">, excludeId?: string) => { valid: boolean; errors: string[] };
}

const Ctx = createContext<DataCtx>({} as DataCtx);

const pad = (n: number, w = 3) => String(n).padStart(w, "0");

const refreshRefereeCounts = (races: Race[], referees: Referee[]) => {
  return referees.map(ref => ({
    ...ref,
    assignedRaces: races.filter(r => r.refereeId === ref.id).length,
  }));
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>(seedTournaments);
  const [races, setRaces] = useState<Race[]>(seedRaces);
  const [horses, setHorses] = useState<Horse[]>(seedHorses);
  const [jockeys, setJockeys] = useState<Jockey[]>(seedJockeys);
  const [referees, setReferees] = useState<Referee[]>(seedReferees);
  const [registrations, setRegistrations] = useState<Registration[]>(seedRegistrations);

  // Monotonic id counters to avoid id reuse after deletions.
  // We initialize them from seed data so tournament/race ids remain stable within the app session.
  const [nextTournamentSeq, setNextTournamentSeq] = useState(() => {
    const nums = seedTournaments.map(t => {
      const m = String(t.id).match(/^T(\d+)$/);
      return m ? Number(m[1]) : 0;
    });
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });

  const [nextRaceSeq, setNextRaceSeq] = useState(() => {
    const nums = seedRaces.map(r => {
      const m = String(r.id).match(/^R(\d+)$/);
      return m ? Number(m[1]) : 0;
    });
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });

  const [nextRegistrationSeq, setNextRegistrationSeq] = useState(() => {
    const nums = seedRegistrations.map(r => {
      const m = String(r.id).match(/^REG(\d+)$/);
      return m ? Number(m[1]) : 0;
    });
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });

  // Keep next id counters in sync even if state is reset/replaced.
  // (Also helps ensure counters reflect deletions.)
  const getNextTournamentId = (): string => {
    let seq = nextTournamentSeq;
    let id = "T" + pad(seq);
    const existingTournamentIds = new Set(tournaments.map(tt => tt.id));
    while (existingTournamentIds.has(id)) {
      seq++;
      id = "T" + pad(seq);
    }
    setNextTournamentSeq(seq + 1);
    return id;
  };

  const getNextRaceId = (): string => {
    let seq = nextRaceSeq;
    let id = "R" + pad(seq);
    const existingRaceIds = new Set(races.map(rr => rr.id));
    while (existingRaceIds.has(id)) {
      seq++;
      id = "R" + pad(seq);
    }
    setNextRaceSeq(seq + 1);
    return id;
  };

  const getNextRegistrationId = (): string => {
    let seq = nextRegistrationSeq;
    let id = "REG" + pad(seq, 4);
    const existingRegistrationIds = new Set(registrations.map(rr => rr.id));
    while (existingRegistrationIds.has(id)) {
      seq++;
      id = "REG" + pad(seq, 4);
    }
    setNextRegistrationSeq(seq + 1);
    return id;
  };

  const validateTournament = (t: Omit<Tournament, "id" | "totalRaces">, excludeId?: string) => {
    const errors: string[] = [];

    // BR-002: Name not empty
    if (!t.name?.trim()) errors.push("Tên giải đấu không được để trống.");
    // BR-003: Name uniqueness
    else if (isTournamentNameDuplicate(t.name, tournaments, excludeId)) errors.push("Tên giải đấu đã tồn tại.");
    
    // BR-008: Location must exist
    if (!isValidLocation(t.location)) errors.push("Địa điểm không hợp lệ.");
    
    // BR-005, BR-006: Dates >= today
    if (!isSameOrAfterToday(t.startDate)) errors.push("Ngày bắt đầu không được ở quá khứ.");
    if (!isSameOrAfterToday(t.endDate)) errors.push("Ngày kết thúc không được ở quá khứ.");
    
    // BR-007: End date > start date
    if (t.endDate && t.startDate && new Date(t.endDate) < new Date(t.startDate)) {
      errors.push("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
    }
    
    // BR-012: No overlap at location
    if (isTournamentOverlapAtLocation(t.location, t.startDate, t.endDate, tournaments, excludeId)) {
      errors.push("Thời gian tổ chức trùng với giải đấu khác cùng địa điểm.");
    }

    return { valid: errors.length === 0, errors };
  };

  const validateRace = (r: Omit<Race, "id" | "tournamentName" | "refereeReportSubmitted">, excludeId?: string) => {
    const errors: string[] = [];

    // BR-033: Race must belong to tournament
    const tournament = tournaments.find(t => t.id === r.tournamentId);
    if (!tournament) errors.push("Giải đấu không hợp lệ.");
    else {
      // BR-034: Race date within tournament
      const raceDate = new Date(r.dateTime);
      const tournamentStart = new Date(tournament.startDate);
      const tournamentEnd = new Date(tournament.endDate);
      tournamentEnd.setHours(23, 59, 59);
      if (raceDate < tournamentStart || raceDate > tournamentEnd) {
        errors.push("Thời gian cuộc đua phải nằm trong khoảng thời gian giải đấu.");
      }
    }

    // BR-037: Round + order + category must exist
    if (!r.round?.trim()) errors.push("Tên vòng đua không được để trống.");
    if (!Number.isFinite(r.order) || r.order < 1) errors.push("Thứ tự cuộc đua không hợp lệ.");
    if (!r.category) errors.push("Hạng mục cuộc đua không được để trống.");

    // BR-038a: prevent duplicate order within same tournament on the same date
    const raceDateKey = r.dateTime.slice(0, 10);
    const duplicate = races.some(rr =>
      rr.tournamentId === r.tournamentId &&
      rr.order === r.order &&
      rr.dateTime.slice(0, 10) === raceDateKey &&
      (!excludeId || rr.id !== excludeId)
    );
    if (duplicate) errors.push("Thứ tự cuộc đua đã tồn tại trong ngày này.");



    // BR-042: Track valid
    if (!isValidTrack(r.track)) errors.push("Đường đua không hợp lệ.");

    // BR-035, BR-036: Distance validation
    if (!r.distance || !isValidDistance(r.distance)) {
      errors.push("Cự ly phải từ 800m đến 4000m.");
    }

    // BR-038: (legacy check) Round string uniqueness within tournament (kept as-is)
    if (isRaceOrderDuplicate(r.round, r.tournamentId, races, excludeId)) {
      errors.push("Vòng đua đã tồn tại trong giải đấu này.");
    }


    // BR-065: Track overlap
    if (hasTrackOverlap(r.track, r.dateTime, races, excludeId)) {
      errors.push("Trùng lịch với cuộc đua khác trên cùng đường đua.");
    }

    return { valid: errors.length === 0, errors };
  };

  const addTournament: DataCtx["addTournament"] = (t) => {
    const validation = validateTournament(t);
    if (!validation.valid) {
      return { success: false, message: validation.errors[0] };
    }

    const id = "T" + pad(nextTournamentSeq);

    const created: Tournament = { ...t, id, totalRaces: 0, status: "Draft" };
    setTournaments(prev => [created, ...prev]);
    return { success: true, tournament: created };
  };

  const updateTournament: DataCtx["updateTournament"] = (t) => {
    const existing = tournaments.find(e => e.id === t.id);
    if (!existing) return { success: false, message: "Giải đấu không tồn tại." };

    // Cannot edit Finished/Cancelled tournaments
    // Keep as non-exhaustive checks; avoid TS unreachable-comparison warnings.
    // Use an enum-like switch to keep TS control-flow checks happy.
    switch (existing.status) {
      case "Finished":
        return { success: false, message: "Không được chỉnh sửa giải đấu đã kết thúc." };
      case "Cancelled":
        return { success: false, message: "Không được chỉnh sửa giải đấu đã bị hủy." };
      default:
        break;
    }








    // BR-014, BR-015: Cannot change dates to past
    if (t.startDate !== existing.startDate && isInPast(t.startDate)) {
      return { success: false, message: "Không được đổi ngày bắt đầu về quá khứ." };
    }
    if (t.endDate !== existing.endDate && isInPast(t.endDate)) {
      return { success: false, message: "Không được đổi ngày kết thúc về quá khứ." };
    }

    // BR-018: Ongoing cannot revert to Draft
    if (existing.status === "Ongoing" && t.status === "Draft") {
      return { success: false, message: "Giải đấu đang diễn ra không thể quay về trạng thái Dự thảo." };
    }

    // If tournament is already Draft, allow editing in any status field change
    // as long as transitions are valid (handled by canTransitionTournamentStatus)


    // BR-019: Status flow
    // Allow no-op transitions (edit tournament but keep its current status).
    if (existing.status !== t.status) {
      if (!canTransitionTournamentStatus(existing.status, t.status)) {
        return { success: false, message: "Chuyển đổi trạng thái không hợp lệ." };
      }
    }


    // BR-019a: Cannot open registration unless tournament has at least 1 race
    if (existing.status === "Draft" && t.status === "Open Registration") {
      const raceCount = races.filter(r => r.tournamentId === t.id).length;
      if (raceCount < 1) {
        return { success: false, message: "Giải đấu phải có ít nhất 1 cuộc đua trước khi chuyển sang Mở đăng ký." };
      }
    }

    // BR-XXX: If editing date range, ensure:
    // 1) this tournament's races remain fully contained in the updated range
    // 2) (existing behavior) no other tournaments at same location have races that would conflict
    const isDateRangeChanged = t.startDate !== existing.startDate || t.endDate !== existing.endDate;

    if (isDateRangeChanged) {
      const newStart = new Date(t.startDate);
      const newEnd = new Date(t.endDate);
      newEnd.setHours(23, 59, 59);

      // 1) Containment check: all races that belong to this tournament must stay within its updated range.
      const thisTournamentRaces = races.filter(r => r.tournamentId === t.id);
      const outOfRangeRaces = thisTournamentRaces.filter(r => {
        const raceDate = new Date(r.dateTime);
        return raceDate < newStart || raceDate > newEnd;
      });

      if (outOfRangeRaces.length > 0) {
        return {
          success: false,
          message:
            "Không thể chỉnh sửa khoảng thời gian vì các cuộc đua thuộc giải đấu này sẽ bị nằm ngoài khoảng thời gian sau khi chỉnh.",
        };
      }

      // 2) Other-tournaments conflict at same location (existing intent)
      if (t.location === existing.location) {
        const conflictingRaces = races.filter(r => {
          const parent = tournaments.find(tt => tt.id === r.tournamentId);
          if (!parent) return false;
          if (parent.id === t.id) return false; // ignore races from current tournament
          if (parent.location !== existing.location) return false;

          const raceDate = new Date(r.dateTime);
          return raceDate >= newStart && raceDate <= newEnd;
        });

        if (conflictingRaces.length > 0) {
          return {
            success: false,
            message:
              "Không thể chỉnh sửa khoảng thời gian vì có cuộc đua đã được lên lịch trùng với các giải đấu cùng địa điểm.",
          };
        }
      }
    }



    // Validate other fields
    const validation = validateTournament({ name: t.name, location: t.location, startDate: t.startDate, endDate: t.endDate, status: t.status, description: t.description }, t.id);
    if (!validation.valid) {
      return { success: false, message: validation.errors[0] };
    }

    setTournaments(prev => prev.map(item => item.id === t.id ? t : item));
    return { success: true };
  };

  const deleteTournament: DataCtx["deleteTournament"] = (id) => {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return { success: false, message: "Giải đấu không tồn tại." };

    // BR-022: Cannot delete started tournament
    if (tournament.status === "Ongoing") {
      return { success: false, message: "Không được xóa giải đấu đang diễn ra." };
    }

    // BR-023: Cannot delete tournament with ongoing race
    const hasOngoingRace = races.some(r => r.tournamentId === id && r.status === "Ongoing");
    if (hasOngoingRace) {
      return { success: false, message: "Không được xóa giải đấu có cuộc đua đang diễn ra." };
    }

    // BR-024: Cannot delete tournament in open registration
    if (tournament.status === "Open Registration") {
      return { success: false, message: "Không được xóa giải đấu đang mở đăng ký." };
    }

    const removedRaceNames = races
      .filter(r => r.tournamentId === id)
      .map(r => `${r.round} - ${r.track}`);
    const remainingRaces = races.filter(r => r.tournamentId !== id);
    setTournaments(prev => prev.filter(t => t.id !== id));
    setRaces(remainingRaces);
    setRegistrations(prev => prev.filter(reg => !removedRaceNames.includes(reg.raceName)));
    setReferees(prev => refreshRefereeCounts(remainingRaces, prev));
    return { success: true };
  };

  const addRace: DataCtx["addRace"] = (r) => {
    const validation = validateRace(r);
    if (!validation.valid) {
      return { success: false, message: validation.errors[0] };
    }

    const tournament = tournaments.find(t => t.id === r.tournamentId);
    if (!tournament) {
      return { success: false, message: "Giải đấu không tồn tại." };
    }

    // BR-060: Race creation is allowed when tournament is Draft / Open Registration / Ongoing
    // (new race starts as Draft; later status transitions are controlled by updateRace)
    if (tournament.status !== "Draft" && tournament.status !== "Open Registration" && tournament.status !== "Ongoing") {
      return { success: false, message: "Giải đấu phải ở trạng thái Bản nháp, Mở đăng ký hoặc Đang diễn ra." };
    }




    const id = getNextRaceId();
    const created: Race = {
      ...r,
      id,
      tournamentName: tournament.name,
      status: "Draft",
      refereeReportSubmitted: false,
    };
    setRaces(prev => [created, ...prev]);
    setTournaments(prev => prev.map(t => t.id === r.tournamentId ? { ...t, totalRaces: t.totalRaces + 1 } : t));
    return { success: true, race: created };
  };

  const updateRace: DataCtx["updateRace"] = (race) => {
    const previous = races.find(r => r.id === race.id);
    if (!previous) return { success: false, message: "Cuộc đua không tồn tại." };


    // BR-046: Cannot change race date to past
    if (race.dateTime !== previous.dateTime && isInPast(race.dateTime)) {
      return { success: false, message: "Không được đổi thời gian sang quá khứ." };
    }

    // BR-049: Cannot change track when ongoing
    if (previous.status === "Ongoing" && race.track !== previous.track) {
      return { success: false, message: "Không được đổi đường đua khi cuộc đua đang diễn ra." };
    }

    // Race status flow (forward-only): Draft -> Open -> Ongoing -> Finished/Cancelled
    // and no backward transitions.
    if (!canTransitionRaceStatus(previous.status, race.status)) {
      return { success: false, message: "Chuyển đổi trạng thái không hợp lệ." };
    }

    if (previous.status !== "Open" && race.status === "Open") {
      if (!race.round?.trim() || !Number.isFinite(race.order) || race.order < 1 || !race.category || !race.track || !race.dateTime || !race.distance || race.distance < 800 || race.distance > 4000) {
        return { success: false, message: "Cuộc đua phải có đầy đủ thông tin trước khi mở đăng ký." };
      }
    }

    if (previous.status === "Cancelled") {
      if (race.status === "Ongoing") {
        return { success: false, message: "Cuộc đua đã hủy không thể chuyển sang Đang diễn ra." };
      }
      return { success: false, message: "Không được chỉnh sửa trạng thái của cuộc đua đã kết thúc." };
    }

    if (previous.status === "Finished") {
      return { success: false, message: "Không được chỉnh sửa trạng thái của cuộc đua đã kết thúc." };
    }


    // Validate race fields
    const validation = validateRace({
      tournamentId: race.tournamentId,
      round: race.round,
      order: race.order,
      category: race.category,
      track: race.track,
      dateTime: race.dateTime,
      distance: race.distance,
      status: race.status,
    }, race.id);
    if (!validation.valid) {
      return { success: false, message: validation.errors[0] };
    }

    setRaces(prev => {
      const updated = prev.map(r => r.id === race.id ? { ...race, tournamentName: tournaments.find(t => t.id === race.tournamentId)?.name ?? race.tournamentName } : r);
      if (previous.tournamentId !== race.tournamentId) {
        setTournaments(prevT => prevT.map(t => {
          if (t.id === previous.tournamentId) return { ...t, totalRaces: Math.max(0, t.totalRaces - 1) };
          if (t.id === race.tournamentId) return { ...t, totalRaces: t.totalRaces + 1 };
          return t;
        }));
      }
      setReferees(prev => refreshRefereeCounts(updated, prev));
      return updated;
    });
    return { success: true };
  };

  const deleteRace: DataCtx["deleteRace"] = (id) => {
    const removed = races.find(r => r.id === id);
    if (!removed) return { success: false, message: "Cuộc đua không tồn tại." };

    // Only allow deleting when status is Finished or Cancelled.
    // Also allow deleting when race is still Draft/Open (so long as it hasn't been started),
    // but block deletion when race is Ongoing.
    // (Draft/Open are safe to delete before the race date begins.)
    if (removed.status === "Ongoing") {
      return { success: false, message: "Không được xóa cuộc đua đang diễn ra." };
    }



    setRaces(prev => {
      const remaining = prev.filter(r => r.id !== id);
      setReferees(prevRef => refreshRefereeCounts(remaining, prevRef));
      return remaining;
    });
    setTournaments(prev => prev.map(t => t.id === removed.tournamentId ? { ...t, totalRaces: Math.max(0, t.totalRaces - 1) } : t));
    setRegistrations(prev => prev.filter(reg => reg.raceName !== `${removed.round} - ${removed.track}`));
    return { success: true };
  };

  const addHorse: DataCtx["addHorse"] = (h) => {
    const id = "H" + pad(horses.length + 1);
    const created: Horse = { ...h, id };
    setHorses(prev => [created, ...prev]);
    return created;
  };

  const updateHorse: DataCtx["updateHorse"] = (horse) => {
    setHorses(prev => prev.map(h => h.id === horse.id ? horse : h));
  };

  const deleteHorse: DataCtx["deleteHorse"] = (id) => {
    setHorses(prev => {
      const deletedName = prev.find(h => h.id === id)?.name;
      setRegistrations(prevRegs => deletedName ? prevRegs.filter(reg => reg.horseName !== deletedName) : prevRegs);
      return prev.filter(h => h.id !== id);
    });
  };

  const addJockey: DataCtx["addJockey"] = (j) => {
    const id = "J" + pad(jockeys.length + 1);
    const created: Jockey = { ...j, id };
    setJockeys(prev => [created, ...prev]);
    return created;
  };

  const updateJockey: DataCtx["updateJockey"] = (jockey) => {
    setJockeys(prev => prev.map(item => item.id === jockey.id ? jockey : item));
  };

  const deleteJockey: DataCtx["deleteJockey"] = (id) => {
    setJockeys(prev => {
      const deletedName = prev.find(j => j.id === id)?.name;
      setRegistrations(prevRegs => deletedName ? prevRegs.filter(reg => reg.jockeyName !== deletedName) : prevRegs);
      return prev.filter(j => j.id !== id);
    });
  };

  const updateRegistrationStatus: DataCtx["updateRegistrationStatus"] = (id, status) => {
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const registerForRace: DataCtx["registerForRace"] = ({ raceId, horseId, jockeyId }) => {
    const race = races.find(r => r.id === raceId);
    if (!race) return { success: false, message: "Cuộc đua không tồn tại." };

    const tournament = tournaments.find(t => t.id === race.tournamentId);
    if (!tournament) return { success: false, message: "Giải đấu không tồn tại." };
    if (tournament.status !== "Open Registration") {
      return { success: false, message: "Chỉ có thể đăng ký khi giải đấu đang mở đăng ký." };
    }
    if (race.status !== "Open") {
      return { success: false, message: "Chỉ có thể đăng ký cuộc đua đang mở đăng ký." };
    }

    const horse = horses.find(h => h.id === horseId);
    const jockey = jockeys.find(j => j.id === jockeyId);
    if (!horse || !jockey) return { success: false, message: "Ngựa hoặc nài ngựa không hợp lệ." };

    const duplicate = registrations.some(reg => reg.raceName === `${race.round} - ${race.track}` && reg.horseName === horse.name && reg.jockeyName === jockey.name);
    if (duplicate) {
      return { success: false, message: "Bạn đã đăng ký tổ hợp này cho cuộc đua này." };
    }

    const id = getNextRegistrationId();
    const registeredAt = new Date().toLocaleString("vi-VN", { hour12: false });
    const created: Registration = {
      id,
      raceName: `${race.round} - ${race.track}`,
      horseName: horse.name,
      jockeyName: jockey.name,
      registeredAt,
      status: "Chờ duyệt",
    };
    setRegistrations(prev => [created, ...prev]);
    return { success: true, message: "Đăng ký thành công. Vui lòng chờ duyệt." };
  };

  const assignReferee: DataCtx["assignReferee"] = (raceId, refereeId) => {
    setRaces(prev => {
      const updated = prev.map(r => r.id === raceId ? { ...r, refereeId } : r);
      setReferees(prevRef => refreshRefereeCounts(updated, prevRef));
      return updated;
    });
  };

  return (
    <Ctx.Provider
      value={{
        tournaments,
        races,
        horses,
        jockeys,
        referees,
        registrations,
        addTournament,
        updateTournament,
        deleteTournament,
        addRace,
        updateRace,
        deleteRace,
        addHorse,
        updateHorse,
        deleteHorse,
        addJockey,
        updateJockey,
        deleteJockey,
        updateRegistrationStatus,
        registerForRace,
        assignReferee,
        validateTournament,
        validateRace,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}


export const useData = () => useContext(Ctx);
