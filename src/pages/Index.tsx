import { Link } from "react-router-dom";
import { Trophy, CalendarClock, Rabbit, UserCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Index() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_18%),linear-gradient(180deg,_#020617_0%,_#0b1220_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-sky-500/20 px-4 py-1 text-sm font-medium uppercase tracking-[0.24em] text-sky-100 shadow-sm shadow-sky-500/10">
              Horse Racing Prototype
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Quản lý hành trình giải đua ngựa chuyên nghiệp, ngay trong prototype.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Theo dõi giải đấu, lịch đua, ngựa, nài ngựa và kết quả trong một giao diện quản trị hiện đại, trực quan và được thiết kế cho các đội ngũ điều hành.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-elegant hover:opacity-95">
                  Xem bảng điều khiển
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-slate-600 text-slate-100 hover:border-slate-400">
                  Đăng nhập admin
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between rounded-3xl bg-slate-900/80 p-4 text-slate-100">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Ngày thi đấu</p>
                <p className="text-3xl font-semibold">18 May 2026</p>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-semibold uppercase text-emerald-200">
                LIVE
              </div>
            </div>
            <div className="space-y-4">
              {[
                { title: "Giải đấu Miền Nam", detail: "Đường đua Tân An - 2.2km", status: "Sắp bắt đầu" },
                { title: "Cuộc đua Đặc biệt", detail: "Đường đua Long Thành - 1.8km", status: "Đang diễn ra" },
                { title: "Vòng chung kết", detail: "Đường đua Phú Thọ - 2.5km", status: "Chuẩn bị" },
              ].map((race) => (
                <div key={race.title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 transition hover:border-sky-500/30 hover:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{race.detail}</p>
                      <h2 className="mt-2 text-lg font-semibold text-white">{race.title}</h2>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
                      {race.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            { title: "Theo dõi giải đấu", description: "Điều hành lịch đua, đăng ký và báo cáo tức thì.", icon: Trophy },
            { title: "Quản lý đội ngũ", description: "Quản lý ngựa, nài ngựa và trọng tài trong cùng một hệ thống.", icon: UserCircle2 },
            { title: "Phân tích kết quả", description: "Xem báo cáo hiệu suất, xếp hạng và thông báo quan trọng.", icon: CalendarClock },
          ].map((item) => (
            <Card key={item.title} className="border-white/10 bg-slate-950/80 shadow-xl shadow-slate-950/30">
              <CardHeader>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4 text-lg font-semibold text-white">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-14 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Prototype highlight</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Giao diện tối tân cho đội ngũ đua ngựa</h2>
            </div>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-elegant hover:opacity-95">
                Thử nghiệm ngay
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Lịch sử đua", "Trạng thái ngựa", "Thống kê bảo mật", "Thông báo trực tiếp"].map((feature) => (
              <div key={feature} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-slate-300">
                <p className="font-semibold text-white">{feature}</p>
                <p className="mt-2 text-sm text-slate-400">Tích hợp trực quan để điều hành giải đấu nhanh và chính xác.</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
