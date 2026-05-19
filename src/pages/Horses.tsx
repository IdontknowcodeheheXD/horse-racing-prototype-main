import { useState } from "react";
import { Plus, Search, ShieldAlert, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HorseFormDialog } from "@/components/forms/HorseFormDialog";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";

const today = new Date("2026-05-16");

export default function Horses() {
  const { horses, updateHorse, deleteHorse } = useData();
  const [q, setQ] = useState("");
  const [breed, setBreed] = useState<string>("all");

  const breeds = Array.from(new Set(horses.map(h => h.breed)));
  const filtered = horses.filter(h => {
    const matchQ = h.name.toLowerCase().includes(q.toLowerCase()) || h.owner.toLowerCase().includes(q.toLowerCase()) || h.id.toLowerCase().includes(q.toLowerCase());
    const matchB = breed === "all" || h.breed === breed;
    return matchQ && matchB;
  });

  const handleDelete = (horse: typeof horses[number]) => {
    deleteHorse(horse.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý ngựa"
        description="Hồ sơ chi tiết và tình trạng sức khỏe của các chiến mã"
        actions={
          <HorseFormDialog
            trigger={<Button className="bg-gradient-primary text-primary-foreground shadow-elegant"><Plus className="h-4 w-4 mr-1" /> Thêm ngựa mới</Button>}
          />
        }
      />

      <Card className="shadow-card-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm theo mã, tên hoặc chủ sở hữu..." className="pl-9" />
            </div>
            <Select value={breed} onValueChange={setBreed}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Giống ngựa" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giống</SelectItem>
                {breeds.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead className="hidden md:table-cell">Giống</TableHead>
                  <TableHead className="hidden md:table-cell">Tuổi</TableHead>
                  <TableHead className="hidden lg:table-cell">Cân nặng</TableHead>
                  <TableHead>GCN sức khỏe</TableHead>
                  <TableHead className="hidden lg:table-cell">Chủ sở hữu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(h => {
                  const expired = new Date(h.certExpiry) < today;
                  return (
                    <TableRow key={h.id} className={cn(expired && "bg-destructive/5", "hover:bg-muted/30")}>
                      <TableCell className="font-mono text-xs">{h.id}</TableCell>
                      <TableCell className="font-medium font-display">{h.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{h.breed}</TableCell>
                      <TableCell className="hidden md:table-cell">{h.age}</TableCell>
                      <TableCell className="hidden lg:table-cell">{h.weight} kg</TableCell>
                      <TableCell>
                        <div className={cn("flex items-center gap-1.5 text-sm", expired ? "text-destructive font-medium" : "text-muted-foreground")}>
                          {expired && <ShieldAlert className="h-3.5 w-3.5" />}
                          {h.certExpiry}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{h.owner}</TableCell>
                      <TableCell><StatusBadge status={h.status} /></TableCell>
                      <TableCell className="text-right">
                        <HorseFormDialog
                          trigger={<Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>}
                          initialHorse={h}
                          title="Chỉnh sửa ngựa"
                          submitLabel="Lưu thay đổi"
                          onSubmit={updateHorse}
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(h)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
