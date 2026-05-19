import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  "Sắp diễn ra": "bg-accent/15 text-accent border-accent/30",
  "Đang diễn ra": "bg-turf/15 text-turf border-turf/30",
  "Đã kết thúc": "bg-muted text-muted-foreground border-border",
  "Đã lên lịch": "bg-primary/10 text-primary border-primary/20",
  "Đã hoàn tất": "bg-accent/15 text-accent border-accent/30",
  "Đã xác nhận": "bg-success/15 text-success border-success/30",
  "Hoạt động": "bg-success/15 text-success border-success/30",
  "Đình chỉ": "bg-destructive/15 text-destructive border-destructive/30",
  "Nghỉ phép": "bg-muted text-muted-foreground border-border",
  "Nghỉ thi đấu": "bg-muted text-muted-foreground border-border",
  "Chấn thương": "bg-destructive/15 text-destructive border-destructive/30",
  "Chờ duyệt": "bg-warning/20 text-warning-foreground border-warning/40",
  "Đã duyệt": "bg-success/15 text-success border-success/30",
  "Từ chối": "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusMap[status] || "bg-muted text-muted-foreground")}>
      {status}
    </Badge>
  );
}
