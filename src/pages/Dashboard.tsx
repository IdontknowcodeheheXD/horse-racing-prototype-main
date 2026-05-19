import { Trophy, CalendarClock, Rabbit, UserCircle2, FileWarning, AlertTriangle, Bell, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { horses, jockeys, referees, participationData, tournamentStats, notifications } from "@/data/mockData";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { tournaments, races } = useData();
  const upcomingRaces = races.filter(r => r.status === "Open").length;
  const pendingReports = races.filter(r => r.status === "Finished" && !r.refereeReportSubmitted).length;
  const expiredCerts = horses.filter(h => new Date(h.certExpiry) < new Date("2026-05-16")).length;
  const activeJockeys = jockeys.filter(j => j.status === "Hoạt động").length;
  const liveRaces = races.filter(r => r.status === "Ongoing").length;

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border border-white/10 bg-slate-950/70 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl">
        <CardContent className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-center p-6 sm:p-8">
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-sky-500/15 px-3 py-1 text-sm font-medium uppercase tracking-[0.3em] text-sky-200">
              Admin Prototype
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Bảng điều khiển quản lý giải đua</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Quản lý hệ thống vận hành cuộc đua ngựa với dữ liệu prototype thực tế. Xem tổng quan các giải đấu, lịch đua, thông báo và thông tin tài khoản admin ngay lập tức.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-elegant hover:opacity-95">Tạo giải đấu mới</Button>
              <Button variant="outline" className="border-slate-700 text-slate-100 hover:border-slate-500">Xem báo cáo</Button>
              <Button variant="outline" className="border-slate-700 text-slate-100 hover:border-slate-500">Cấu hình hệ thống</Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-card-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tài khoản</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{user?.name ?? "Quản trị viên"}</h2>
                <p className="text-sm text-slate-400">{user?.email ?? "admin@duongdua.vn"}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 px-3 py-2 text-sm font-semibold text-emerald-300">
                {user?.role.toUpperCase() ?? "ADMIN"}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Giải đấu hiện có</p>
                <p className="mt-2 text-2xl font-semibold text-white">{tournaments.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Đua trực tiếp</p>
                <p className="mt-2 text-2xl font-semibold text-white">{liveRaces}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard label="Tổng giải đấu" value={tournaments.length} icon={Trophy} trend={12} variant="primary" />
        <StatCard label="Cuộc đua sắp tới" value={upcomingRaces} icon={CalendarClock} trend={8} variant="accent" />
        <StatCard label="Ngựa đăng ký" value={horses.length} icon={Rabbit} trend={-3} variant="turf" />
        <StatCard label="Nài ngựa hoạt động" value={activeJockeys} icon={UserCircle2} trend={5} variant="primary" />
        <StatCard label="BC trọng tài chờ" value={pendingReports} icon={FileWarning} variant="destructive" hint="Cần xử lý gấp" />
      </div>

      {expiredCerts > 0 && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1 text-sm">
              <span className="font-semibold text-destructive">{expiredCerts} giấy chứng nhận sức khỏe đã hết hạn.</span>{" "}
              <span className="text-muted-foreground">Vui lòng kiểm tra và cập nhật trong mục Quản lý ngựa.</span>
            </div>
            <Button variant="outline" size="sm">Xem chi tiết</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card-soft">
          <CardHeader>
            <CardTitle className="font-display">Mức độ tham gia</CardTitle>
            <CardDescription>Số lượng ngựa và nài ngựa tham gia trong 6 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="horses" name="Ngựa" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="jockeys" name="Nài ngựa" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card-soft">
          <CardHeader>
            <CardTitle className="font-display">Trạng thái giải đấu</CardTitle>
            <CardDescription>Phân bổ theo tình trạng hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={tournamentStats} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {tournamentStats.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card-soft">
          <CardHeader>
            <CardTitle className="font-display">Cuộc đua sắp diễn ra</CardTitle>
            <CardDescription>5 cuộc đua gần nhất theo lịch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {races.slice(0, 5).map(r => (
              <div key={r.id} className="flex flex-col gap-3 rounded-3xl border border-border bg-slate-950/70 p-4 transition hover:border-sky-500/30 hover:bg-slate-950/90 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-turf text-turf-foreground font-display font-bold text-sm">
                  {r.round.split(" ")[1] || r.round[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{r.tournamentName}</div>
                  <div className="text-xs text-muted-foreground">{r.round} · {r.track} · {r.distance}m</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-xs text-muted-foreground">{r.dateTime}</div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card-soft">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2"><Bell className="h-4 w-4" /> Thông báo gần đây</CardTitle>
            <CardDescription>Cảnh báo cần chú ý</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map(n => {
              const Icon = n.type === "destructive" ? ShieldAlert : n.type === "warning" ? AlertTriangle : Bell;
              const color = n.type === "destructive" ? "text-destructive" : n.type === "warning" ? "text-warning" : "text-primary";
              return (
                <div key={n.id} className="flex gap-3 rounded-3xl border border-border p-4 transition hover:border-sky-500/30 hover:bg-slate-950/90">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.message}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-0.5">{n.time}</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
