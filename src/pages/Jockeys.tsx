import { Plus, Pencil, Trash2, AlertTriangle, Medal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { JockeyFormDialog } from "@/components/forms/JockeyFormDialog";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";

const MAX_RACES_PER_WEEK = 4;

export default function Jockeys() {
  const { jockeys, updateJockey, deleteJockey } = useData();

  const handleDelete = (jockey: typeof jockeys[number]) => {
    deleteJockey(jockey.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý nài ngựa"
        description="Hồ sơ kỵ sĩ, xếp hạng và giới hạn tham gia thi đấu"
        actions={
          <JockeyFormDialog
            trigger={<Button className="bg-gradient-primary text-primary-foreground shadow-elegant"><Plus className="h-4 w-4 mr-1" /> Thêm nài ngựa</Button>}
          />
        }
      />

      <Card className="shadow-card-soft">
        <CardContent className="p-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Mã</TableHead>
                  <TableHead>Số giấy phép</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead className="hidden md:table-cell">Cân nặng</TableHead>
                  <TableHead>Xếp hạng</TableHead>
                  <TableHead>Giới hạn tuần</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jockeys.map(j => {
                  const overLimit = j.racesThisWeek >= MAX_RACES_PER_WEEK;
                  return (
                    <TableRow key={j.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs">{j.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{j.license}</TableCell>
                      <TableCell className="font-medium">{j.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{j.weight} kg</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {j.ranking <= 3 && <Medal className={cn("h-4 w-4", j.ranking === 1 ? "text-accent" : j.ranking === 2 ? "text-muted-foreground" : "text-primary-glow")} />}
                          <span className="font-display font-bold">#{j.ranking}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn("text-sm flex items-center gap-1.5", overLimit ? "text-destructive font-medium" : "")}>
                          {overLimit && <AlertTriangle className="h-3.5 w-3.5" />}
                          {j.racesThisWeek} / {MAX_RACES_PER_WEEK}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={j.status} /></TableCell>
                      <TableCell className="text-right">
                        <JockeyFormDialog
                          trigger={<Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>}
                          initialJockey={j}
                          title="Chỉnh sửa kỵ sĩ"
                          submitLabel="Lưu thay đổi"
                          onSubmit={updateJockey}
                        />
                        <ConfirmDialog
                          trigger={<Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
                          title="Xác nhận xóa kỵ sĩ"
                          description={`Bạn có chắc muốn xóa kỵ sĩ ${j.name}?`}
                          confirmLabel="Xóa"
                          onConfirm={() => handleDelete(j)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
