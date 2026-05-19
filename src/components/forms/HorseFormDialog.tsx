import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import type { Horse, HorseStatus } from "@/data/mockData";

const STATUS_OPTIONS: HorseStatus[] = ["Hoạt động", "Nghỉ thi đấu", "Chấn thương"];

interface HorseFormDialogProps {
  trigger: React.ReactNode;
  initialHorse?: Horse;
  onSubmit?: (horse: Horse) => void;
  title?: string;
  submitLabel?: string;
}

export function HorseFormDialog({
  trigger,
  initialHorse,
  onSubmit,
  title,
  submitLabel,
}: HorseFormDialogProps) {
  const { addHorse } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialHorse?.name ?? "");
  const [breed, setBreed] = useState(initialHorse?.breed ?? "");
  const [age, setAge] = useState<number | "">(initialHorse?.age ?? "");
  const [weight, setWeight] = useState<number | "">(initialHorse?.weight ?? "");
  const [certExpiry, setCertExpiry] = useState(initialHorse?.certExpiry ?? "");
  const [owner, setOwner] = useState(initialHorse?.owner ?? "");
  const [status, setStatus] = useState<HorseStatus>(initialHorse?.status ?? "Hoạt động");

  useEffect(() => {
    if (open) {
      setName(initialHorse?.name ?? "");
      setBreed(initialHorse?.breed ?? "");
      setAge(initialHorse?.age ?? "");
      setWeight(initialHorse?.weight ?? "");
      setCertExpiry(initialHorse?.certExpiry ?? "");
      setOwner(initialHorse?.owner ?? "");
      setStatus(initialHorse?.status ?? "Hoạt động");
    }
  }, [open, initialHorse]);

  const reset = () => {
    setName(initialHorse?.name ?? "");
    setBreed(initialHorse?.breed ?? "");
    setAge(initialHorse?.age ?? "");
    setWeight(initialHorse?.weight ?? "");
    setCertExpiry(initialHorse?.certExpiry ?? "");
    setOwner(initialHorse?.owner ?? "");
    setStatus(initialHorse?.status ?? "Hoạt động");
  };

  const isEditing = Boolean(initialHorse);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 2) return toast.error("Vui lòng nhập tên ngựa.");
    if (!breed.trim()) return toast.error("Vui lòng nhập giống ngựa.");
    if (!age || Number(age) <= 0) return toast.error("Vui lòng nhập tuổi hợp lệ.");
    if (!weight || Number(weight) <= 0) return toast.error("Vui lòng nhập cân nặng hợp lệ.");
    if (!certExpiry) return toast.error("Vui lòng nhập hạn GCN.");
    if (!owner.trim()) return toast.error("Vui lòng nhập chủ sở hữu.");

    const payload = {
      ...(initialHorse ? { id: initialHorse.id } : {}),
      name: name.trim(),
      breed: breed.trim(),
      age: Number(age),
      weight: Number(weight),
      certExpiry,
      owner: owner.trim(),
      status,
    } as Horse;

    if (onSubmit) {
      onSubmit(payload);
      toast.success(`Đã ${isEditing ? "cập nhật" : "thêm"} ngựa "${payload.name}".`);
    } else {
      addHorse(payload);
      toast.success(`Đã thêm ngựa "${payload.name}".`);
    }

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title ?? (isEditing ? "Chỉnh sửa ngựa" : "Thêm ngựa mới")}</DialogTitle>
          <DialogDescription>Quản lý thông tin chiến mã và hồ sơ sức khỏe.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onFormSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="horse-name">Tên ngựa *</Label>
            <Input id="horse-name" value={name} onChange={e => setName(e.target.value)} placeholder="Tên chiến mã" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="horse-breed">Giống *</Label>
            <Input id="horse-breed" value={breed} onChange={e => setBreed(e.target.value)} placeholder="Giống ngựa" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="horse-age">Tuổi *</Label>
              <Input id="horse-age" type="number" min={1} value={age} onChange={e => setAge(e.target.value === "" ? "" : Number(e.target.value))} placeholder="6" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horse-weight">Cân nặng (kg) *</Label>
              <Input id="horse-weight" type="number" min={100} value={weight} onChange={e => setWeight(e.target.value === "" ? "" : Number(e.target.value))} placeholder="520" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="horse-cert">Hạn GCN *</Label>
            <Input id="horse-cert" type="date" value={certExpiry} onChange={e => setCertExpiry(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="horse-owner">Chủ sở hữu *</Label>
            <Input id="horse-owner" value={owner} onChange={e => setOwner(e.target.value)} placeholder="Tên chủ sở hữu" />
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
            <Button type="submit" className="bg-gradient-primary text-primary-foreground">{submitLabel ?? (isEditing ? "Lưu lại" : "Thêm ngựa")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
