import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import type { Jockey, JockeyStatus } from "@/data/mockData";

const STATUS_OPTIONS: JockeyStatus[] = ["Hoạt động", "Đình chỉ", "Nghỉ phép"];

interface JockeyFormDialogProps {
  trigger: React.ReactNode;
  initialJockey?: Jockey;
  onSubmit?: (jockey: Jockey) => void;
  title?: string;
  submitLabel?: string;
}

export function JockeyFormDialog({
  trigger,
  initialJockey,
  onSubmit,
  title,
  submitLabel,
}: JockeyFormDialogProps) {
  const { addJockey } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialJockey?.name ?? "");
  const [license, setLicense] = useState(initialJockey?.license ?? "");
  const [weight, setWeight] = useState<number | "">(initialJockey?.weight ?? "");
  const [ranking, setRanking] = useState<number | "">(initialJockey?.ranking ?? "");
  const [racesThisWeek, setRacesThisWeek] = useState<number | "">(initialJockey?.racesThisWeek ?? "");
  const [status, setStatus] = useState<JockeyStatus>(initialJockey?.status ?? "Hoạt động");

  useEffect(() => {
    if (open) {
      setName(initialJockey?.name ?? "");
      setLicense(initialJockey?.license ?? "");
      setWeight(initialJockey?.weight ?? "");
      setRanking(initialJockey?.ranking ?? "");
      setRacesThisWeek(initialJockey?.racesThisWeek ?? "");
      setStatus(initialJockey?.status ?? "Hoạt động");
    }
  }, [open, initialJockey]);

  const reset = () => {
    setName(initialJockey?.name ?? "");
    setLicense(initialJockey?.license ?? "");
    setWeight(initialJockey?.weight ?? "");
    setRanking(initialJockey?.ranking ?? "");
    setRacesThisWeek(initialJockey?.racesThisWeek ?? "");
    setStatus(initialJockey?.status ?? "Hoạt động");
  };

  const isEditing = Boolean(initialJockey);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) return toast.error("Vui lòng nhập tên kỵ sĩ.");
    if (!license.trim()) return toast.error("Vui lòng nhập số giấy phép.");
    if (!weight || Number(weight) <= 0) return toast.error("Vui lòng nhập cân nặng hợp lệ.");
    if (!ranking || Number(ranking) <= 0) return toast.error("Vui lòng nhập xếp hạng hợp lệ.");
    if (racesThisWeek === "" || Number(racesThisWeek) < 0) return toast.error("Vui lòng nhập số cuộc đua trong tuần.");

    const payload = {
      ...(initialJockey ? { id: initialJockey.id } : {}),
      name: name.trim(),
      license: license.trim(),
      weight: Number(weight),
      ranking: Number(ranking),
      racesThisWeek: Number(racesThisWeek),
      status,
    } as Jockey;

    if (onSubmit) {
      onSubmit(payload);
      toast.success(`Đã ${isEditing ? "cập nhật" : "thêm"} kỵ sĩ "${payload.name}".`);
    } else {
      addJockey(payload);
      toast.success(`Đã thêm kỵ sĩ "${payload.name}".`);
    }

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title ?? (isEditing ? "Chỉnh sửa kỵ sĩ" : "Thêm kỵ sĩ mới")}</DialogTitle>
          <DialogDescription>Quản lý hồ sơ, giấy phép và trạng thái thi đấu của kỵ sĩ.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onFormSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="jockey-name">Họ tên *</Label>
            <Input id="jockey-name" value={name} onChange={e => setName(e.target.value)} placeholder="Tên kỵ sĩ" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jockey-license">Số giấy phép *</Label>
            <Input id="jockey-license" value={license} onChange={e => setLicense(e.target.value)} placeholder="Số giấy phép" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="jockey-weight">Cân nặng (kg) *</Label>
              <Input id="jockey-weight" type="number" min={40} value={weight} onChange={e => setWeight(e.target.value === "" ? "" : Number(e.target.value))} placeholder="52" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jockey-ranking">Xếp hạng *</Label>
              <Input id="jockey-ranking" type="number" min={1} value={ranking} onChange={e => setRanking(e.target.value === "" ? "" : Number(e.target.value))} placeholder="5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jockey-races">Số cuộc đua/tuần *</Label>
            <Input id="jockey-races" type="number" min={0} value={racesThisWeek} onChange={e => setRacesThisWeek(e.target.value === "" ? "" : Number(e.target.value))} placeholder="2" />
          </div>
          <div className="space-y-1.5">
            <Label>Trạng thái *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground">{submitLabel ?? (isEditing ? "Lưu lại" : "Thêm kỵ sĩ")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
