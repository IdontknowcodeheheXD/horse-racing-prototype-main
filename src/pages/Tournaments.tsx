import { useState } from "react";
import { Plus, Search, MapPin, Calendar, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { TournamentFormDialog } from "@/components/forms/TournamentFormDialog";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";
import { toast } from "sonner";
import { VALID_LOCATIONS, TournamentStatus } from "@/data/mockData";

export default function Tournaments() {
  const { tournaments, updateTournament, deleteTournament } = useData();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | "">("");
  const [locationFilter, setLocationFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const isAdmin = user?.role === "admin";
  const visibleTournaments = isAdmin
    ? tournaments
    : tournaments.filter(t => t.status === "Open Registration" || t.status === "Ongoing");

  const filtered = visibleTournaments
    .filter(t => t.name.toLowerCase().includes(q.toLowerCase()) || t.location.toLowerCase().includes(q.toLowerCase()))
    .filter(t => !statusFilter || t.status === statusFilter)
    .filter(t => !locationFilter || t.location === locationFilter)
    .filter(t => !startDateFilter || new Date(t.startDate) >= new Date(startDateFilter))
    .filter(t => !endDateFilter || new Date(t.endDate) <= new Date(endDateFilter))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const handleDelete = (tournament: typeof tournaments[number]) => {
    const result = deleteTournament(tournament.id);
    if (!result.success) {
      toast.error(result.message || "Không thể xóa giải đấu.");
      return;
    }
    toast.success("Đã xóa giải đấu.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý giải đấu"
        description="Tạo, chỉnh sửa và theo dõi tất cả giải đua ngựa"
        actions={isAdmin ? (
          <TournamentFormDialog
            trigger={<Button className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"><Plus className="h-4 w-4 mr-1" /> Tạo giải đấu mới</Button>}
          />
        ) : undefined}
      />

      <Card className="shadow-card-soft">
        <CardContent className="p-4">
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm theo tên hoặc địa điểm..." className="pl-9" />
          </div>

          <div className="grid gap-3 mb-6 md:grid-cols-4">
            <Select value={statusFilter || undefined} onValueChange={value => setStatusFilter(value as TournamentStatus | "")}>
              <SelectTrigger className="min-w-[160px]">
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>

                <SelectItem value="Draft">Bản nháp</SelectItem>
                <SelectItem value="Open Registration">Mở đăng ký</SelectItem>
                <SelectItem value="Ongoing">Đang diễn ra</SelectItem>
                <SelectItem value="Finished">Hoàn thành</SelectItem>
                <SelectItem value="Cancelled">Bị huỷ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter || undefined} onValueChange={setLocationFilter}>

              <SelectTrigger className="min-w-[160px]">
                <SelectValue placeholder="Lọc địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả địa điểm</SelectItem>

                {VALID_LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={startDateFilter} onChange={e => setStartDateFilter(e.target.value)} placeholder="Từ ngày" />
            <Input type="date" value={endDateFilter} onChange={e => setEndDateFilter(e.target.value)} placeholder="Đến ngày" />
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[100px]">Mã</TableHead>
                  <TableHead>Tên giải đấu</TableHead>
                  <TableHead className="hidden lg:table-cell">Địa điểm</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="hidden md:table-cell">Cuộc đua</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(t => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{t.description}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />{t.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{t.startDate} → {t.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium">{t.totalRaces}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-right">
                      {isAdmin ? (
                        t.status === "Finished" || t.status === "Cancelled" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground cursor-not-allowed"
                            disabled
                            title="Không thể chỉnh sửa giải đấu đã kết thúc"
                            aria-label="Không thể chỉnh sửa giải đấu đã kết thúc"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <TournamentFormDialog
                            trigger={<Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>}
                            initialTournament={t}
                            title="Chỉnh sửa giải đấu"
                            submitLabel="Lưu thay đổi"
                            onSubmit={updateTournament}
                          />
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">Chỉ xem</span>
                      )}
                      {isAdmin && (
                        <ConfirmDialog
                          trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
                          title="Xác nhận xóa giải đấu"
                          description={`Bạn có chắc muốn xóa giải đấu ${t.name}? Điều này sẽ xoá cả lịch đua liên quan.`}
                          confirmLabel="Xóa"
                          onConfirm={() => handleDelete(t)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
