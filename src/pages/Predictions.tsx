import { Sparkles, TrendingUp, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { week: "T1", predictions: 120, accuracy: 32 },
  { week: "T2", predictions: 180, accuracy: 41 },
  { week: "T3", predictions: 240, accuracy: 38 },
  { week: "T4", predictions: 310, accuracy: 45 },
  { week: "T5", predictions: 380, accuracy: 52 },
  { week: "T6", predictions: 420, accuracy: 48 },
];

const topPredictors = [
  { name: "Lê Quốc Bảo", points: 4520, correct: 38 },
  { name: "Trần Thu Hà", points: 3890, correct: 32 },
  { name: "Nguyễn Văn Minh", points: 3210, correct: 28 },
  { name: "Phạm Hải Yến", points: 2980, correct: 25 },
];

export default function Predictions() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dự đoán & Điểm thưởng" description="Theo dõi dự đoán của khán giả và bảng điểm thưởng" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Tổng dự đoán tuần" value="420" icon={Sparkles} trend={11} variant="accent" />
        <StatCard label="Tỷ lệ chính xác" value="48%" icon={TrendingUp} trend={4} variant="turf" />
        <StatCard label="Tổng điểm phát" value="14,600" icon={Trophy} variant="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card-soft">
          <CardHeader>
            <CardTitle className="font-display">Xu hướng dự đoán</CardTitle>
            <CardDescription>Số lượng dự đoán và tỷ lệ chính xác theo tuần</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Area type="monotone" dataKey="predictions" name="Dự đoán" stroke="hsl(var(--primary))" fill="url(#g1)" />
                <Area type="monotone" dataKey="accuracy" name="Chính xác (%)" stroke="hsl(var(--accent))" fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card-soft">
          <CardHeader>
            <CardTitle className="font-display">Top dự đoán</CardTitle>
            <CardDescription>Người chơi hàng đầu tháng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPredictors.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40">
                <div className="h-9 w-9 rounded-full bg-gradient-accent flex items-center justify-center font-display font-bold text-accent-foreground">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.correct} dự đoán đúng</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-accent">{p.points.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">điểm</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
