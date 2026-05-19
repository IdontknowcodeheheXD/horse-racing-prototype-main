import { Plus, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { RaceFormDialog } from "@/components/forms/RaceFormDialog";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";
import { toast } from "sonner";

export default function Races() {
  const { races, tournaments, updateRace, deleteRace } = useData();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const visibleTournamentIds = new Set(
    tournaments
      .filter(t => t.status === "Open Registration" || t.status === "Ongoing")
      .map(t => t.id),
  );

  const visibleRaces = isAdmin
    ? races
    : races.filter(r => visibleTournamentIds.has(r.tournamentId) && (r.status === "Open" || r.status === "Ongoing"));

  const conflicts = new Set<string>();
  visibleRaces.forEach((a, i) => visibleRaces.forEach((b, j) => {
    if (i !== j && a.dateTime === b.dateTime && a.track === b.track) conflicts.add(a.id);
  }));

  const handleDelete = (race: typeof races[number]) => {
    deleteRace(race.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lịch đua"
        description="Quản lý lịch trình các cuộc đua, tự động phát hiện xung đột"
        actions={isAdmin ? (
          <RaceFormDialog
            trigger={<Button className="bg-gradient-primary text-primary-foreground shadow-elegant"><Plus className="h-4 w-4 mr-1" /> Lên lịch đua mới</Button>}
          />
        ) : undefined}
      />

      <Card className="shadow-card-soft">
        <CardContent className="p-4">
          <div className="rounded-lg border border-border overflow-x-auto overflow-hidden">
            <Table className="table-fixed min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[80px]">Mã</TableHead>
                  <TableHead className="min-w-[180px]">Giải đấu</TableHead>
                  <TableHead className="w-[90px]">Vòng</TableHead>
                  <TableHead className="hidden md:table-cell w-[110px]">Loại</TableHead>
                  <TableHead className="w-[110px]">Đường đua</TableHead>
                  <TableHead className="w-[150px]">Thời gian</TableHead>
                  <TableHead className="hidden md:table-cell w-[80px]">Cự ly</TableHead>
                  <TableHead className="w-[120px]">Trạng thái</TableHead>
                  <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRaces.map(r => (
                  <TableRow key={r.id} className={conflicts.has(r.id) ? "bg-destructive/5" : "hover:bg-muted/30"}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        {conflicts.has(r.id) && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                        {r.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm truncate max-w-[180px]">{r.tournamentName}</TableCell>
                    <TableCell className="font-medium truncate max-w-[90px]">{r.round}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[110px]">{r.category}</TableCell>
                    <TableCell className="truncate max-w-[110px]">{r.track}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">{r.dateTime}</TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">{r.distance}m</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {isAdmin ? (
                        r.status === "Finished" || r.status === "Cancelled" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground cursor-not-allowed"
                            disabled
                            title="Không thể chỉnh sửa cuộc đua đã kết thúc"
                            aria-label="Không thể chỉnh sửa cuộc đua đã kết thúc"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <RaceFormDialog
                            trigger={<Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>}
                            initialRace={r}
                            title="Chỉnh sửa cuộc đua"
                            submitLabel="Lưu thay đổi"
                            onSubmit={(updatedRace) => {
                              const tournament = tournaments.find(t => t.id === updatedRace.tournamentId);
                              return updateRace({
                                ...r,
                                ...updatedRace,
                                tournamentName: tournament?.name ?? r.tournamentName,
                              });
                            }}
                          />
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">Chỉ xem</span>
                      )}
                      {isAdmin && (
                        <ConfirmDialog
                          trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
                          title="Xác nhận xóa cuộc đua"
                          description={`Bạn có chắc muốn xóa cuộc đua ${r.id} (${r.round})?`}
                          confirmLabel="Xóa"
                          onConfirm={() => handleDelete(r)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {conflicts.size > 0 && (
            <div className="mt-3 text-xs text-destructive flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Phát hiện {conflicts.size} cuộc đua trùng lịch (cùng giờ, cùng đường đua).
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
