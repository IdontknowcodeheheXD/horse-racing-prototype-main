import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { RegistrationDialog } from "@/components/forms/RegistrationDialog";

export default function CompetitorDashboard() {
  const { user } = useAuth();
  const { tournaments, races, horses, jockeys, registerForRace } = useData();

  const openTournaments = useMemo(
    () => tournaments.filter(t => t.status === "Open Registration" || t.status === "Ongoing"),
    [tournaments],
  );

  const visibleRaces = useMemo(
    () => {
      const openTournamentIds = new Set(openTournaments.map(t => t.id));
      return races
        .filter(r => openTournamentIds.has(r.tournamentId) && (r.status === "Open" || r.status === "Ongoing"))
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    },
    [openTournaments, races],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảng điều khiển thí sinh"
        description="Xem các giải đấu và lịch đua đang mở đăng ký. Chỉ hiển thị nội dung cho người dùng không phải admin."
      />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
        <Card className="shadow-card-soft">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Giải đấu đang mở đăng ký</h2>
                <p className="text-sm text-muted-foreground">Hiển thị các giải đấu thí sinh hiện có thể đăng ký.</p>
              </div>
              <div className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-300">{openTournaments.length} giải</div>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[90px]">Mã</TableHead>
                    <TableHead>Tên giải</TableHead>
                    <TableHead className="hidden lg:table-cell">Địa điểm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-right">Cuộc đua</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openTournaments.map(t => (
                    <TableRow key={t.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{t.description}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{t.location}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.startDate} → {t.endDate}</TableCell>
                      <TableCell className="text-right font-medium">{t.totalRaces}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {openTournaments.length === 0 && (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/80 p-5 text-sm text-slate-400">
                Hiện không có giải đấu nào đang mở đăng ký.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card-soft">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Lịch đua mở cho đăng ký</h2>
                <p className="text-sm text-muted-foreground">Cuộc đua liên quan đến các giải đấu đang mở đăng ký.</p>
              </div>
              <div className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-300">{visibleRaces.length} cuộc</div>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[90px]">Mã</TableHead>
                    <TableHead>Giải đấu</TableHead>
                    <TableHead className="hidden md:table-cell">Vòng</TableHead>
                    <TableHead className="hidden lg:table-cell">Đường đua</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="w-[110px]">Trạng thái</TableHead>
                    <TableHead className="w-[120px] text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRaces.map(r => {
                    const tournament = openTournaments.find(t => t.id === r.tournamentId);
                    const canRegister = tournament?.status === "Open Registration" && r.status === "Open";
                    return (
                      <TableRow key={r.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                        <TableCell className="text-sm font-medium truncate max-w-[140px]">{r.tournamentName}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{r.round}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{r.track}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.dateTime}</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell className="text-right">
                          {canRegister ? (
                            <RegistrationDialog
                              trigger={<Button size="sm" className="bg-gradient-primary text-primary-foreground">Đăng ký</Button>}
                              race={r}
                              tournament={tournament}
                              horses={horses}
                              jockeys={jockeys}
                              onSubmit={registerForRace}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">Chỉ xem</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {visibleRaces.length === 0 && (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/80 p-5 text-sm text-slate-400">
                Không có lịch đua nào đang mở đăng ký cho thí sinh.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
