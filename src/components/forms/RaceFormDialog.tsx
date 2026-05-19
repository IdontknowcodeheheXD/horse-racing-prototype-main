import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import type { Race, RaceCategory, RaceStatus } from "@/data/mockData";

const TRACKS = ["Đường A", "Đường B", "Đường C", "Đường D"];
const CATEGORIES: RaceCategory[] = ["Handicap", "Stakes", "Classic"];


interface RaceFormDialogProps {
  trigger: React.ReactNode;
  defaultTournamentId?: string;
  initialRace?: Race;
  onSubmit?: (race: Race) => { success: boolean; message?: string } | void;
  title?: string;
  submitLabel?: string;
}

export function RaceFormDialog({
  trigger,
  defaultTournamentId,
  initialRace,
  onSubmit,
  title,
  submitLabel,
}: RaceFormDialogProps) {
  const { tournaments, races, addRace } = useData();
  const [open, setOpen] = useState(false);
  const [tournamentId, setTournamentId] = useState(defaultTournamentId ?? initialRace?.tournamentId ?? "");
  const [round, setRound] = useState(initialRace?.round ?? "");
  const [order, setOrder] = useState<number>(initialRace?.order ?? 1);
  const [category, setCategory] = useState<RaceCategory>(initialRace?.category ?? "Handicap");
  const [track, setTrack] = useState(initialRace?.track ?? "");
  const [status, setStatus] = useState<RaceStatus>(initialRace?.status ?? "Draft");

  const [dateTime, setDateTime] = useState(initialRace?.dateTime ? initialRace.dateTime.replace(" ", "T") : "");
  const [distance, setDistance] = useState<number | "">(initialRace?.distance ?? "");

  useEffect(() => {
    if (open) {
      setTournamentId(initialRace?.tournamentId ?? defaultTournamentId ?? "");
      setRound(initialRace?.round ?? "");
      setOrder(initialRace?.order ?? 1);
      setCategory(initialRace?.category ?? "Handicap");
      setTrack(initialRace?.track ?? "");
      setStatus(initialRace?.status ?? "Draft");
      setDateTime(initialRace?.dateTime ? initialRace.dateTime.replace(" ", "T") : "");
      setDistance(initialRace?.distance ?? "");
    }
  }, [open, initialRace, defaultTournamentId]);


  const selectedTournament = tournaments.find((t) => t.id === tournamentId);

  const conflict = useMemo(() => {
    if (!dateTime || !track) return null;
    const formatted = dateTime.replace("T", " ").slice(0, 16);

    // Important: only block on true duplicates.
    // When editing, the current race itself may match the slot; exclude it.
    // Additionally, only treat races in the same tournament as conflicts.
    return (
      races.find(
        (r) =>
          r.tournamentId === initialRace?.tournamentId &&
          r.track === track &&
          r.dateTime === formatted &&
          r.id !== initialRace?.id &&
          // If the user is not changing anything that affects the conflict criteria,
          // don't block on the existing stored race in the same slot.
          !(isEditing && r.id === initialRace?.id),
      ) ?? null
    );
  }, [dateTime, track, races, initialRace?.id]);

  const reset = () => {
    setTournamentId(defaultTournamentId ?? initialRace?.tournamentId ?? "");
    setRound(initialRace?.round ?? "");
    setOrder(initialRace?.order ?? 1);
    setCategory(initialRace?.category ?? "Handicap");
    setTrack(initialRace?.track ?? "");
    setStatus(initialRace?.status ?? "Draft");
    setDateTime(initialRace?.dateTime ? initialRace.dateTime.replace(" ", "T") : "");
    setDistance(initialRace?.distance ?? "");
  };

  const isEditing = Boolean(initialRace);

  const statusOptions = useMemo<RaceStatus[]>(() => {
    const currentStatus = initialRace?.status ?? "Draft";
    switch (currentStatus) {
      case "Draft":
        return ["Draft", "Open", "Cancelled"];
      case "Open":
        return ["Open", "Ongoing", "Cancelled"];
      case "Ongoing":
        return ["Ongoing", "Finished", "Cancelled"];
      default:
        return [currentStatus];
    }
  }, [initialRace?.status]);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!tournamentId) return toast.error("Vui lòng chọn giải đấu.");
    if (!round.trim()) return toast.error("Vui lòng nhập tên vòng đua.");
    if (!track) return toast.error("Vui lòng chọn đường đua.");
    if (!dateTime) return toast.error("Vui lòng chọn thời gian.");
    if (!distance || Number(distance) < 800 || Number(distance) > 4000) {
      return toast.error("Cự ly hợp lệ: 800m – 4000m.");
    }

    if (selectedTournament) {
      const raceDate = new Date(dateTime);
      const startDate = new Date(selectedTournament.startDate);
      const endDate = new Date(selectedTournament.endDate);
      endDate.setHours(23, 59, 59);
      if (raceDate < startDate || raceDate > endDate) {
        return toast.error("Thời gian phải nằm trong khoảng giải đấu diễn ra.");
      }
    }

    if (conflict) {
      return toast.error(`Trùng lịch với cuộc đua ${conflict.id} trên ${track}.`);
    }

    const formatted = dateTime.replace("T", " ").slice(0, 16);
    const raceInput = {
      tournamentId,
      round: round.trim(),
      order,
      category,
      track,
      dateTime: formatted,
      distance: Number(distance),
      status,
    };


    if (onSubmit) {
      const raceToSubmit = { id: initialRace?.id ?? "", ...raceInput } as Race;
      const result = onSubmit(raceToSubmit);
      if (result && !result.success) {
        return toast.error(result.message || "Không thể cập nhật cuộc đua.");
      }
      toast.success(isEditing ? "Đã cập nhật cuộc đua." : `Đã lên lịch ${raceInput.round} – ${raceInput.track}`);
    } else {
      const result = addRace(raceInput);
      if (!result.success) {
        return toast.error(result.message || "Không thể tạo cuộc đua.");
      }
      toast.success(`Đã lên lịch ${raceInput.round} – ${raceInput.track}`);
    }

    reset();
    setOpen(false);
  };

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) reset();
			}}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title ?? (isEditing ? "Chỉnh sửa cuộc đua" : "Lên lịch cuộc đua mới")}</DialogTitle>
          <DialogDescription>Cuộc đua thuộc về một giải đấu. Hệ thống tự động kiểm tra xung đột lịch.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onFormSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Giải đấu *</Label>
            <Select value={tournamentId} onValueChange={setTournamentId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn giải đấu" />
              </SelectTrigger>
              <SelectContent>
                {tournaments
                  .filter((tournament) => tournament.status !== "Finished")
                  .map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name} ({tournament.startDate} → {tournament.endDate})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="r-order">Thứ tự *</Label>
              <Input
                id="r-order"
                type="number"
                min={1}
                step={1}
                value={order}
                onChange={(e) => setOrder(e.target.value === "" ? 1 : Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-round">Tên vòng đua *</Label>
              <Input id="r-round" value={round} onChange={(event) => setRound(event.target.value)} placeholder="Vòng 1, Tứ kết..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Hạng mục *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as RaceCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hạng mục" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Đường đua *</Label>
              <Select value={track} onValueChange={setTrack}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đường" />
                </SelectTrigger>
                <SelectContent>
                  {TRACKS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEditing ? (
              <div className="space-y-1.5">
                <Label>Trạng thái</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div />
            )}
          </div>


          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="r-dt">Thời gian *</Label>
              <Input id="r-dt" type="datetime-local" value={dateTime} onChange={(event) => setDateTime(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r-dist">Cự ly (m) *</Label>
              <Input
                id="r-dist"
                type="number"
                min={800}
                max={4000}
                step={100}
                value={distance}
                onChange={(event) => setDistance(event.target.value === "" ? "" : Number(event.target.value))}
                placeholder="1200"
              />
            </div>
          </div>

          {conflict && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                Trùng lịch với <strong>{conflict.id}</strong> ({conflict.tournamentName} – {conflict.round}) cùng giờ trên {track}.
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" disabled={!!conflict} className="bg-gradient-primary text-primary-foreground">
              {submitLabel ?? (isEditing ? "Lưu thay đổi" : "Lên lịch")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
