import { Medal, Trophy, Award } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

const results = [
  { rank: 1, horse: "Thiên Lý Mã", jockey: "Nguyễn Hoàng Long", time: "1:28.45", weighted: 1.4845 },
  { rank: 2, horse: "Bạch Long", jockey: "Trần Đức Mạnh", time: "1:29.12", weighted: 1.4912 },
  { rank: 3, horse: "Xích Tốc", jockey: "Hoàng Anh Khoa", time: "1:29.88", weighted: 1.4988 },
  { rank: 4, horse: "Vân Long", jockey: "Lê Văn Tài", time: "1:30.05", weighted: 1.5005 },
  { rank: 5, horse: "Lôi Đình", jockey: "Đặng Thị Linh", time: "1:30.50", weighted: 1.5050 },
];

export default function Results() {
  const medalIcon = (r: number) => r === 1 ? Trophy : r === 2 ? Medal : Award;
  const medalColor = (r: number) => r === 1 ? "text-accent" : r === 2 ? "text-muted-foreground" : "text-primary-glow";

  return (
    <div className="space-y-6">
      <PageHeader title="Kết quả & Xếp hạng" description="Xếp hạng tính theo thời gian có trọng số · Tiebreaker: thời gian đua nhanh nhất" />

      <Alert className="border-warning/40 bg-warning/5">
        <ShieldAlert className="h-4 w-4 text-warning" />
        <AlertDescription>Kết quả chỉ được công bố sau khi trọng tài xác nhận báo cáo cuộc đua.</AlertDescription>
      </Alert>

      <Card className="shadow-elegant overflow-hidden">
        <CardHeader className="bg-gradient-hero text-primary-foreground">
          <CardTitle className="font-display text-2xl">Vòng 1 - Đường A · Cúp Mùa Xuân Đại Nam</CardTitle>
          <p className="text-sm opacity-90">Cự ly 1200m · Đã xác nhận bởi trọng tài Nguyễn Văn Khoa</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {results.map(r => {
              const Icon = medalIcon(r.rank);
              return (
                <div key={r.rank} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-center w-12">
                    {r.rank <= 3 ? <Icon className={`h-6 w-6 ${medalColor(r.rank)}`} /> : <span className="font-display text-xl text-muted-foreground">#{r.rank}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-lg">{r.horse}</div>
                    <div className="text-sm text-muted-foreground">Nài ngựa: {r.jockey}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold">{r.time}</div>
                    <div className="text-xs text-muted-foreground">Trọng số: {r.weighted}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
