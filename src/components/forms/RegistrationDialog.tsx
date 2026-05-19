import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Horse, Jockey, Race, Tournament } from "@/data/mockData";

interface RegistrationDialogProps {
  trigger: React.ReactNode;
  race: Race;
  tournament: Tournament;
  horses: Horse[];
  jockeys: Jockey[];
  onSubmit: (data: { raceId: string; horseId: string; jockeyId: string }) => { success: boolean; message?: string };
}

export function RegistrationDialog({ trigger, race, tournament, horses, jockeys, onSubmit }: RegistrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [horseId, setHorseId] = useState("");
  const [jockeyId, setJockeyId] = useState("");

  useEffect(() => {
    if (!open) {
      setHorseId("");
      setJockeyId("");
    }
  }, [open]);

  const availableHorses = horses.filter(h => h.status === "Hoạt động" && new Date(h.certExpiry) > new Date());
  const availableJockeys = jockeys.filter(j => j.status === "Hoạt động");

  const handleSubmit = () => {
    if (!horseId) return toast.error("Vui lòng chọn ngựa.");
    if (!jockeyId) return toast.error("Vui lòng chọn nài ngựa.");

    const result = onSubmit({ raceId: race.id, horseId, jockeyId });
    if (!result.success) {
      toast.error(result.message || "Đăng ký không thành công.");
      return;
    }

    toast.success(result.message || "Đăng ký thành công.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Đăng ký cuộc đua</DialogTitle>
          <DialogDescription>
            Đăng ký cho cuộc đua <strong>{race.round}</strong> tại {race.track} ({tournament.name}).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Cuộc đua</Label>
            <Input readOnly value={`${race.round} — ${race.track} (${race.dateTime})`} />
          </div>

          <div className="space-y-1.5">
            <Label>Ngựa</Label>
            <Select value={horseId} onValueChange={setHorseId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngựa" />
              </SelectTrigger>
              <SelectContent>
                {availableHorses.map((horse) => (
                  <SelectItem key={horse.id} value={horse.id}>
                    {horse.name} ({horse.breed})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Nài ngựa</Label>
            <Select value={jockeyId} onValueChange={setJockeyId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nài ngựa" />
              </SelectTrigger>
              <SelectContent>
                {availableJockeys.map((jockey) => (
                  <SelectItem key={jockey.id} value={jockey.id}>
                    {jockey.name} ({jockey.license})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button type="button" className="bg-gradient-primary text-primary-foreground" onClick={handleSubmit}>
            Đăng ký
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
