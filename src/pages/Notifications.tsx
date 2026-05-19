import { Bell, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications } from "@/data/mockData";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <PageHeader title="Thông báo" description="Cảnh báo hệ thống về xung đột lịch, GCN hết hạn và báo cáo chờ" />
      <Card className="shadow-card-soft">
        <CardContent className="p-2">
          {notifications.map(n => {
            const Icon = n.type === "destructive" ? ShieldAlert : n.type === "warning" ? AlertTriangle : Bell;
            const color = n.type === "destructive" ? "bg-destructive/10 text-destructive" : n.type === "warning" ? "bg-warning/15 text-warning-foreground" : "bg-primary/10 text-primary";
            return (
              <div key={n.id} className="flex gap-4 p-4 hover:bg-muted/30 rounded-lg">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-muted-foreground">{n.message}</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">{n.time}</div>
                </div>
                <Button variant="ghost" size="sm" className="self-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Đánh dấu đã đọc
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
