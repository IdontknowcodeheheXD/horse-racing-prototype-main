import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

interface RefereeAssignmentDialogProps {
  trigger: React.ReactNode;
  refereeId: string;
}

export function RefereeAssignmentDialog({ trigger, refereeId }: RefereeAssignmentDialogProps) {
  const { races, assignReferee } = useData();
  const [open, setOpen] = useState(false);
  const [raceId, setRaceId] = useState(races[0]?.id ?? "");

  useEffect(() => {
    if (open) {
      setRaceId(races[0]?.id ?? "");
    }
  }, [open, races]);

  const onAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raceId) return toast.error("Vui lòng chọn cuộc đua.");
    assignReferee(raceId, refereeId);
    toast.success("Đã phân công trọng tài.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Phân công trọng tài</DialogTitle>
          <DialogDescription>Chọn cuộc đua để giao cho trọng tài phụ trách.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onAssign} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Cuộc đua *</Label>
            <Select value={raceId} onValueChange={setRaceId}>
              <SelectTrigger><SelectValue placeholder="Chọn cuộc đua" /></SelectTrigger>
              <SelectContent>
                {races.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.id} — {r.round} ({r.track})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground" disabled={!raceId}>Phân công</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
