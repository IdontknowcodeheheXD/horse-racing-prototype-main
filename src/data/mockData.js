export const tournaments = [
  { id: "T001", name: "Spring Derby Championship", startDate: "2026-05-18", endDate: "2026-05-24", location: "Saigon Racecourse", status: "In Progress" },
  { id: "T002", name: "National Thoroughbred Cup", startDate: "2026-06-12", endDate: "2026-06-18", location: "Hanoi Grand Track", status: "Confirmed" },
  { id: "T003", name: "Mekong Sprint Open", startDate: "2026-07-08", endDate: "2026-07-11", location: "Can Tho Turf Arena", status: "Draft" },
];

export const races = [
  { id: "R001", tournamentId: "T001", round: "Qualifier 1", raceDate: "2026-05-20T09:00", distance: 1200, track: "Turf A", maxHorseWeight: 500, maxLanes: 6, status: "Confirmed", refereeIds: ["RF001"], raceOrder: 1 },
  { id: "R002", tournamentId: "T001", round: "Qualifier 2", raceDate: "2026-05-20T11:00", distance: 1600, track: "Turf B", maxHorseWeight: 490, maxLanes: 4, status: "Confirmed", refereeIds: [], raceOrder: 2 },
  { id: "R003", tournamentId: "T001", round: "Final", raceDate: "2026-05-22T15:00", distance: 2000, track: "Main Track", maxHorseWeight: 510, maxLanes: 5, status: "Draft", refereeIds: ["RF002"], raceOrder: 3 },
  { id: "R004", tournamentId: "T002", round: "Opening Heat", raceDate: "2026-06-13T10:30", distance: 1400, track: "Hanoi Turf", maxHorseWeight: 500, maxLanes: 6, status: "Draft", refereeIds: [], raceOrder: 1 },
  { id: "R005", tournamentId: "T002", round: "Owner Trial Sprint", raceDate: "2026-06-16T09:30", distance: 1000, track: "Hanoi Sprint Lane", maxHorseWeight: 505, maxLanes: 6, status: "Open Registration", refereeIds: ["RF001"], raceOrder: 2 },
];

export const horses = [
  { id: "H001", name: "Silver Comet", owner: "Nguyen Racing Stable", breed: "Thoroughbred", age: 5, weight: 482, healthCertExpiry: "2026-11-30", status: "Active" },
  { id: "H002", name: "Red Monsoon", owner: "Lotus Horse Club", breed: "Arabian", age: 6, weight: 496, healthCertExpiry: "2026-06-10", status: "Active" },
  { id: "H003", name: "Black Thunder", owner: "Tran Family Stable", breed: "Thoroughbred", age: 7, weight: 515, healthCertExpiry: "2026-01-20", status: "Active" },
  { id: "H004", name: "Golden Arrow", owner: "Mekong Equestrian", breed: "Quarter Horse", age: 4, weight: 468, healthCertExpiry: "2026-09-15", status: "Active" },
  { id: "H005", name: "Blue Horizon", owner: "Hanoi Grand Stable", breed: "Thoroughbred", age: 5, weight: 488, healthCertExpiry: "2026-05-25", status: "In Recovery" },
  { id: "H006", name: "Storm Lantern", owner: "Saigon Race Syndicate", breed: "Arabian", age: 6, weight: 474, healthCertExpiry: "2027-02-18", status: "Active" },
  { id: "H007", name: "Morning Laurel", owner: "Nguyen Racing Stable", breed: "Thoroughbred", age: 4, weight: 492, healthCertExpiry: "2026-06-05", status: "Ineligible" },
  { id: "H008", name: "Crimson Gate", owner: "Nguyen Racing Stable", breed: "Arabian", age: 6, weight: 486, healthCertExpiry: "2027-01-12", status: "Suspended" },
];

export const jockeys = [
  { id: "J001", licenseNo: "VN-JK-2021-001", name: "Le Minh Quan", weight: 54, ranking: 1, status: "Active" },
  { id: "J002", licenseNo: "VN-JK-2020-014", name: "Tran Duc Manh", weight: 52, ranking: 2, status: "Active" },
  { id: "J003", licenseNo: "VN-JK-2022-008", name: "Pham Quoc Viet", weight: 55, ranking: 3, status: "Suspended" },
  { id: "J004", licenseNo: "VN-JK-2019-022", name: "Hoang Anh Khoa", weight: 53, ranking: 4, status: "Active" },
  { id: "J005", licenseNo: "VN-JK-2023-031", name: "Dang Thanh Binh", weight: 51, ranking: 5, status: "Banned" },
];

export const registrations = [
  { id: "REG001", raceId: "R001", horseId: "H001", jockeyId: "J001", owner: "Nguyen Racing Stable", registeredAt: "2026-05-17T08:15", status: "Confirmed", lane: 1 },
  { id: "REG002", raceId: "R001", horseId: "H002", jockeyId: "J002", owner: "Lotus Horse Club", registeredAt: "2026-05-18T09:45", status: "Pending", lane: 2 },
  { id: "REG003", raceId: "R002", horseId: "H003", jockeyId: "J001", owner: "Tran Family Stable", registeredAt: "2026-05-19T14:30", status: "Pending", lane: 3 },
  { id: "REG004", raceId: "R002", horseId: "H004", jockeyId: "J001", owner: "Mekong Equestrian", registeredAt: "2026-05-17T10:00", status: "Confirmed", lane: 1 },
  { id: "REG005", raceId: "R003", horseId: "H006", jockeyId: "J001", owner: "Saigon Race Syndicate", registeredAt: "2026-05-19T11:00", status: "Confirmed", lane: 2 },
  { id: "REG006", raceId: "R004", horseId: "H005", jockeyId: "J004", owner: "Hanoi Grand Stable", registeredAt: "2026-06-10T12:00", status: "Pending", lane: 1 },
  { id: "REG007", raceId: "R005", horseId: "H007", jockeyId: "J004", owner: "Nguyen Racing Stable", registeredAt: "2026-05-19T10:00", status: "Pending", lane: 1 },
  { id: "REG008", raceId: "R005", horseId: "H001", jockeyId: "J001", owner: "Nguyen Racing Stable", registeredAt: "2026-05-19T10:30", status: "Pending", lane: 2 },
];

export const referees = [
  { id: "RF001", name: "Nguyen Van Khoa", level: "Senior Steward", status: "Active" },
  { id: "RF002", name: "Tran Thi Phuong", level: "Track Judge", status: "Active" },
  { id: "RF003", name: "Le Quang Hai", level: "Chief Steward", status: "Active" },
  { id: "RF004", name: "Pham Duc Thang", level: "Assistant Judge", status: "Suspended" },
];

export const refereeReports = [
  { id: "REP001", raceId: "R001", refereeId: "RF001", violations: "No violation. Start and finish confirmed.", confirmedResult: true, submittedAt: "2026-05-20T10:05", status: "Submitted" },
  { id: "REP002", raceId: "R002", refereeId: "RF003", violations: "", confirmedResult: false, submittedAt: "", status: "Pending" },
  { id: "REP003", raceId: "R005", refereeId: "RF001", violations: "", confirmedResult: false, submittedAt: "", status: "Pending" },
];

export const violationReports = [
  { id: "V001", raceId: "R002", horseId: "H003", jockeyId: "J001", refereeId: "RF003", violationType: "Lane interference", severity: "Disqualified", note: "Horse crossed lane boundary in final turn.", createdAt: "2026-05-20T11:50" },
];

export const raceResults = [
  { id: "RES001", raceId: "R001", horseId: "H001", jockeyId: "J001", finishTime: "01:12.48", rank: 1, violationFlag: false, officialStatus: "Official" },
  { id: "RES002", raceId: "R001", horseId: "H002", jockeyId: "J002", finishTime: "01:13.21", rank: 2, violationFlag: false, officialStatus: "Official" },
  { id: "RES003", raceId: "R002", horseId: "H003", jockeyId: "J001", finishTime: "01:39.88", rank: 1, violationFlag: true, officialStatus: "Disqualified" },
  { id: "RES004", raceId: "R002", horseId: "H004", jockeyId: "J001", finishTime: "01:41.08", rank: 2, violationFlag: false, officialStatus: "Draft" },
];

export const rankings = [
  { tournamentId: "T001", horseId: "H001", jockeyId: "J001", points: 25, bestTime: "01:12.48" },
  { tournamentId: "T001", horseId: "H002", jockeyId: "J002", points: 18, bestTime: "01:13.21" },
  { tournamentId: "T001", horseId: "H004", jockeyId: "J001", points: 15, bestTime: "01:41.08" },
];

export const prizes = [
  { id: "P001", tournamentId: "T001", rank: 1, prizeName: "Gold Cup", prizeValue: "150,000,000 VND", status: "Published" },
  { id: "P002", tournamentId: "T001", rank: 2, prizeName: "Silver Saddle", prizeValue: "80,000,000 VND", status: "Draft" },
  { id: "P003", tournamentId: "T001", rank: 3, prizeName: "Bronze Medal", prizeValue: "40,000,000 VND", status: "Draft" },
];

export const notifications = [
  { id: "N001", type: "Race Schedule", title: "Qualifier 1 schedule confirmed", message: "Race R001 starts at 09:00 on Turf A.", status: "Sent", createdAt: "2026-05-18T09:00" },
  { id: "N002", type: "Race Delay", title: "Qualifier 2 delayed", message: "Track inspection may delay R002 by 30 minutes.", status: "Draft", createdAt: "2026-05-19T13:15" },
  { id: "N003", type: "Prize Announcement", title: "Spring Derby prize pool", message: "Prize pool for top three rankings is ready.", status: "Draft", createdAt: "2026-05-19T15:20" },
];

export const predictions = [
  { id: "PR001", spectatorId: "SP001", raceId: "R001", predictedHorseIds: ["H001", "H002", "H004"], submittedAt: "2026-05-19T07:30", result: "Top 2 matched", rewardPoints: 20 },
];

export const rewardHistory = [
  { id: "RW001", spectatorId: "SP001", raceId: "R001", description: "Correct first place and one top-3 horse", points: 20, createdAt: "2026-05-20T10:20" },
];
