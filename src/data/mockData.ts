export type TournamentStatus = "Draft" | "Open Registration" | "Ongoing" | "Finished" | "Cancelled";
export type RaceStatus = "Draft" | "Open" | "Ongoing" | "Finished" | "Cancelled";
export type HorseStatus = "Hoạt động" | "Nghỉ thi đấu" | "Chấn thương";
export type JockeyStatus = "Hoạt động" | "Đình chỉ" | "Nghỉ phép";

// Track and location data
export const VALID_TRACKS = ["Đường A", "Đường B", "Đường C", "Đường D"];
export const VALID_LOCATIONS = [
  "Trường đua Đại Nam, Bình Dương",
  "Trường đua Phú Thọ, TP.HCM",
  "Trường đua Thiên Mã, Hà Nội",
  "Trường đua Đà Nẵng",
];

export interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  description: string;
  totalRaces: number;
}

export type RaceCategory = "Handicap" | "Stakes" | "Classic";

export interface Race {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: string;
  order: number; // 1st/2nd/3rd...
  category: RaceCategory;
  track: string;
  dateTime: string;
  distance: number;
  status: RaceStatus;
  refereeReportSubmitted: boolean;
  refereeId?: string;
}


export interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  certExpiry: string;
  owner: string;
  status: HorseStatus;
}

export interface Jockey {
  id: string;
  license: string;
  name: string;
  weight: number;
  ranking: number;
  status: JockeyStatus;
  racesThisWeek: number;
}

export interface Referee {
  id: string;
  name: string;
  assignedRaces: number;
  pendingReports: number;
  violations: number;
}

export interface Registration {
  id: string;
  raceName: string;
  horseName: string;
  jockeyName: string;
  registeredAt: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
}

export const tournaments: Tournament[] = [
  { id: "T001", name: "Cúp Mùa Xuân Đại Nam", location: "Trường đua Đại Nam, Bình Dương", startDate: "2026-03-15", endDate: "2026-03-22", status: "Ongoing", description: "Giải đua mùa xuân thường niên với 12 chặng đua hấp dẫn.", totalRaces: 12 },
  { id: "T002", name: "Giải Vô Địch Quốc Gia 2026", location: "Trường đua Phú Thọ, TP.HCM", startDate: "2026-06-10", endDate: "2026-06-20", status: "Open Registration", description: "Giải đấu cấp quốc gia quy tụ những kỵ sĩ và chiến mã hàng đầu.", totalRaces: 18 },
  { id: "T003", name: "Cúp Hoàng Gia", location: "Trường đua Thiên Mã, Hà Nội", startDate: "2026-08-01", endDate: "2026-08-08", status: "Draft", description: "Giải đua truyền thống với giải thưởng kỷ lục.", totalRaces: 10 },
  { id: "T004", name: "Cúp Tết Nguyên Đán 2026", location: "Trường đua Đại Nam, Bình Dương", startDate: "2026-01-28", endDate: "2026-02-04", status: "Finished", description: "Giải đua mở màn năm mới Bính Ngọ.", totalRaces: 8 },
  { id: "T005", name: "Giải Mở Rộng Miền Trung", location: "Trường đua Đà Nẵng", startDate: "2026-09-15", endDate: "2026-09-20", status: "Draft", description: "Giải đua giao hữu các đội miền Trung.", totalRaces: 6 },
];

export const races: Race[] = [
  // Keep sample text short so it always fits the table (UI truncation still applies).
  { id: "R001", tournamentId: "T001", tournamentName: "Cúp Xuân Đại Nam", round: "V1", order: 1, category: "Handicap", track: "Đường A", dateTime: "2026-03-16 09:00", distance: 1200, status: "Finished", refereeReportSubmitted: true },
  { id: "R002", tournamentId: "T001", tournamentName: "Cúp Xuân Đại Nam", round: "V1", order: 2, category: "Handicap", track: "Đường B", dateTime: "2026-03-16 11:00", distance: 1600, status: "Finished", refereeReportSubmitted: false },
  { id: "R003", tournamentId: "T001", tournamentName: "Cúp Xuân Đại Nam", round: "V2", order: 1, category: "Handicap", track: "Đường A", dateTime: "2026-03-18 09:00", distance: 1400, status: "Ongoing", refereeReportSubmitted: false },
  { id: "R004", tournamentId: "T001", tournamentName: "Cúp Xuân Đại Nam", round: "V2", order: 2, category: "Handicap", track: "Đường C", dateTime: "2026-03-18 14:00", distance: 2000, status: "Open", refereeReportSubmitted: false },
  { id: "R005", tournamentId: "T002", tournamentName: "VĐQG 2026", round: "QF", order: 1, category: "Stakes", track: "Đường A", dateTime: "2026-06-12 10:00", distance: 1800, status: "Open", refereeReportSubmitted: false },
  { id: "R006", tournamentId: "T002", tournamentName: "VĐQG 2026", round: "SF", order: 1, category: "Stakes", track: "Đường B", dateTime: "2026-06-15 15:00", distance: 2400, status: "Open", refereeReportSubmitted: false },
  { id: "R007", tournamentId: "T003", tournamentName: "Cúp Hoàng Gia", round: "V1", order: 1, category: "Classic", track: "Đường A", dateTime: "2026-08-02 09:30", distance: 1200, status: "Draft", refereeReportSubmitted: false },
];


export const horses: Horse[] = [
  { id: "H001", name: "Thiên Lý Mã", breed: "Thoroughbred", age: 5, weight: 480, certExpiry: "2026-12-15", owner: "Trần Văn An", status: "Hoạt động" },
  { id: "H002", name: "Bạch Long", breed: "Arabian", age: 6, weight: 460, certExpiry: "2026-04-20", owner: "Nguyễn Thị Hoa", status: "Hoạt động" },
  { id: "H003", name: "Hắc Phong", breed: "Thoroughbred", age: 7, weight: 510, certExpiry: "2025-11-30", owner: "Lê Hoàng Nam", status: "Hoạt động" },
  { id: "H004", name: "Xích Tốc", breed: "Quarter Horse", age: 4, weight: 470, certExpiry: "2027-02-10", owner: "Phạm Minh Tuấn", status: "Hoạt động" },
  { id: "H005", name: "Kim Mã", breed: "Thoroughbred", age: 8, weight: 495, certExpiry: "2026-08-05", owner: "Hoàng Văn Bình", status: "Chấn thương" },
  { id: "H006", name: "Vân Long", breed: "Arabian", age: 5, weight: 455, certExpiry: "2026-06-18", owner: "Đỗ Thị Mai", status: "Hoạt động" },
  { id: "H007", name: "Phi Yến", breed: "Thoroughbred", age: 6, weight: 475, certExpiry: "2025-09-12", owner: "Vũ Quang Huy", status: "Nghỉ thi đấu" },
  { id: "H008", name: "Lôi Đình", breed: "Quarter Horse", age: 5, weight: 490, certExpiry: "2027-01-25", owner: "Trần Văn An", status: "Hoạt động" },
];

export const jockeys: Jockey[] = [
  { id: "J001", license: "VN-JK-2021-001", name: "Nguyễn Hoàng Long", weight: 54, ranking: 1, status: "Hoạt động", racesThisWeek: 3 },
  { id: "J002", license: "VN-JK-2020-014", name: "Trần Đức Mạnh", weight: 52, ranking: 2, status: "Hoạt động", racesThisWeek: 2 },
  { id: "J003", license: "VN-JK-2022-008", name: "Lê Văn Tài", weight: 55, ranking: 3, status: "Hoạt động", racesThisWeek: 4 },
  { id: "J004", license: "VN-JK-2019-022", name: "Phạm Quốc Việt", weight: 53, ranking: 4, status: "Đình chỉ", racesThisWeek: 0 },
  { id: "J005", license: "VN-JK-2023-031", name: "Hoàng Anh Khoa", weight: 51, ranking: 5, status: "Hoạt động", racesThisWeek: 2 },
  { id: "J006", license: "VN-JK-2021-045", name: "Đặng Thị Linh", weight: 50, ranking: 6, status: "Nghỉ phép", racesThisWeek: 0 },
];

export const referees: Referee[] = [
  { id: "RF001", name: "Ông Nguyễn Văn Khoa", assignedRaces: 8, pendingReports: 2, violations: 0 },
  { id: "RF002", name: "Bà Trần Thị Phương", assignedRaces: 6, pendingReports: 1, violations: 1 },
  { id: "RF003", name: "Ông Lê Quang Hải", assignedRaces: 10, pendingReports: 3, violations: 0 },
  { id: "RF004", name: "Ông Phạm Đức Thắng", assignedRaces: 5, pendingReports: 0, violations: 2 },
];

export const registrations: Registration[] = [
  { id: "RG001", raceName: "Vòng 2 - Đường A", horseName: "Thiên Lý Mã", jockeyName: "Nguyễn Hoàng Long", registeredAt: "2026-03-14 10:30", status: "Đã duyệt" },
  { id: "RG002", raceName: "Vòng 2 - Đường C", horseName: "Bạch Long", jockeyName: "Trần Đức Mạnh", registeredAt: "2026-03-14 11:15", status: "Chờ duyệt" },
  { id: "RG003", raceName: "Tứ kết - Đường A", horseName: "Hắc Phong", jockeyName: "Lê Văn Tài", registeredAt: "2026-03-15 09:00", status: "Chờ duyệt" },
  { id: "RG004", raceName: "Bán kết - Đường B", horseName: "Xích Tốc", jockeyName: "Hoàng Anh Khoa", registeredAt: "2026-03-15 14:20", status: "Đã duyệt" },
  { id: "RG005", raceName: "Vòng 1 - Đường A", horseName: "Vân Long", jockeyName: "Nguyễn Hoàng Long", registeredAt: "2026-03-16 08:00", status: "Từ chối" },
  { id: "RG006", raceName: "Vòng 2 - Đường A", horseName: "Lôi Đình", jockeyName: "Lê Văn Tài", registeredAt: "2026-03-16 09:45", status: "Chờ duyệt" },
];

export const participationData = [
  { month: "T1", horses: 24, jockeys: 18 },
  { month: "T2", horses: 32, jockeys: 22 },
  { month: "T3", horses: 48, jockeys: 28 },
  { month: "T4", horses: 38, jockeys: 24 },
  { month: "T5", horses: 52, jockeys: 30 },
  { month: "T6", horses: 65, jockeys: 35 },
];

export const tournamentStats = [
  { name: "Draft", value: 2, color: "hsl(var(--accent))" },
  { name: "Open Registration", value: 1, color: "hsl(var(--turf))" },
  { name: "Ongoing", value: 1, color: "hsl(var(--turf))" },
  { name: "Finished", value: 1, color: "hsl(var(--muted-foreground))" },
];

export const notifications = [
  { id: 1, type: "warning" as const, title: "Xung đột lịch thi đấu", message: "Vòng 2 - Đường A và Đường C cùng ngày 18/03", time: "5 phút trước" },
  { id: 2, type: "destructive" as const, title: "Giấy chứng nhận hết hạn", message: "Ngựa Hắc Phong (H003) — hết hạn 30/11/2025", time: "1 giờ trước" },
  { id: 3, type: "warning" as const, title: "Báo cáo trọng tài chưa nộp", message: "Cuộc đua R002 - Vòng 1 Đường B", time: "2 giờ trước" },
  { id: 4, type: "default" as const, title: "Đăng ký mới", message: "3 đăng ký mới chờ duyệt cho Vòng 2", time: "3 giờ trước" },
];
