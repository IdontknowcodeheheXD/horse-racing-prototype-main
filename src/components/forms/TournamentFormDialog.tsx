import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import type { Tournament, TournamentStatus } from "@/data/mockData";

interface TournamentFormDialogProps {
  trigger: React.ReactNode;
  initialTournament?: Tournament;
  onSubmit?: (tournament: Tournament) => { success: boolean; message?: string } | void;
  title?: string;
  submitLabel?: string;
}

export function TournamentFormDialog({
  trigger,
  initialTournament,
  onSubmit,
  title,
  submitLabel,
}: TournamentFormDialogProps) {
  const { addTournament } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialTournament?.name ?? "");
  const [location, setLocation] = useState(initialTournament?.location ?? "");
  const [startDate, setStartDate] = useState(initialTournament?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialTournament?.endDate ?? "");
  const [description, setDescription] = useState(initialTournament?.description ?? "");
  const [status, setStatus] = useState<TournamentStatus>(initialTournament?.status ?? "Draft");

  useEffect(() => {
    if (open) {
      setName(initialTournament?.name ?? "");
      setLocation(initialTournament?.location ?? "");
      setStartDate(initialTournament?.startDate ?? "");
      setEndDate(initialTournament?.endDate ?? "");
      setDescription(initialTournament?.description ?? "");
      setStatus(initialTournament?.status ?? "Draft");
    }
  }, [open, initialTournament]);


  const reset = () => {
    setName(initialTournament?.name ?? "");
    setLocation(initialTournament?.location ?? "");
    setStartDate(initialTournament?.startDate ?? "");
    setEndDate(initialTournament?.endDate ?? "");
    setDescription(initialTournament?.description ?? "");
    setStatus(initialTournament?.status ?? "Draft");
  };


  const isEditing = Boolean(initialTournament);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) return toast.error("Tên giải đấu cần ít nhất 3 ký tự.");
    if (!location.trim()) return toast.error("Vui lòng nhập địa điểm tổ chức.");
    if (!startDate || !endDate) return toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc.");
    if (new Date(endDate) < new Date(startDate)) return toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (new Date(startDate) < today) return toast.error("Ngày bắt đầu không được ở quá khứ.");

    const tournamentData = {
      name: name.trim(),
      location: location.trim(),
      startDate,
      endDate,
      description: description.trim(),
      status,
    };


    if (onSubmit && initialTournament) {
      const result = onSubmit({
        ...initialTournament,
        ...tournamentData,
      });

      if (result && result.success === false) {
        return toast.error(result.message || "Không thể cập nhật giải đấu.");
      }
      toast.success(`Đã cập nhật giải đấu "${name.trim()}".`);
    } else {
      const result = addTournament(tournamentData);
      if (!result.success) {
        return toast.error(result.message || "Không thể tạo giải đấu.");
      }
      toast.success(`Đã tạo giải đấu "${name.trim()}".`);
    }

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title ?? (isEditing ? "Chỉnh sửa giải đấu" : "Tạo giải đấu mới")}</DialogTitle>
          <DialogDescription>Nhập thông tin cơ bản. Sau khi lưu, bạn có thể quản lý các cuộc đua liên quan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmitForm} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="t-name">Tên giải đấu *</Label>
            <Input id="t-name" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Cúp Mùa Thu 2026" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-loc">Địa điểm *</Label>
            <Input id="t-loc" value={location} onChange={e => setLocation(e.target.value)} placeholder="Trường đua, tỉnh/thành" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-start">Ngày bắt đầu *</Label>
              <Input id="t-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-end">Ngày kết thúc *</Label>
              <Input id="t-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-desc">Mô tả</Label>
            <Textarea id="t-desc" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Giới thiệu ngắn về giải đấu..." />
          </div>

          {isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="t-status">Trạng thái *</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TournamentStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"Draft"}>Draft</SelectItem>
                  <SelectItem value={"Open Registration"}>Open Registration</SelectItem>
                  <SelectItem value={"Ongoing"}>Ongoing</SelectItem>
                  <SelectItem value={"Finished"}>Finished</SelectItem>
                  <SelectItem value={"Cancelled"}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground">{submitLabel ?? (isEditing ? "Lưu thay đổi" : "Tạo giải đấu")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
