import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Trophy, Loader2, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const demoCredentials = [
  { label: "Email admin", value: "admin@duongdua.vn" },
  { label: "Mật khẩu admin", value: "admin123" },
  { label: "Email thí sinh", value: "competitor@duongdua.vn" },
  { label: "Mật khẩu thí sinh", value: "competitor123" },
];

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: { pathname?: string } } };
  const [email, setEmail] = useState("admin@duongdua.vn");
  const [password, setPassword] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    const redirectTo = user.role === "competitor" ? "/competitor" : loc.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Đăng nhập thành công");
    const target = result.user?.role === "competitor" ? "/competitor" : loc.state?.from?.pathname || "/dashboard";
    nav(target, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),_transparent_18%),linear-gradient(180deg,_#020617_0%,_#09101d_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.7)] backdrop-blur-xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-sky-200 shadow-sm shadow-sky-500/10">
              Đường Đua Prototype
            </div>
            <div className="mt-8 space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Đăng nhập vào hệ thống</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Sử dụng tài khoản admin hoặc thí sinh để truy cập phần giao diện phù hợp.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="flex items-center gap-3 text-sky-300">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-semibold text-white">Bảo mật admin</p>
                </div>
                <p className="mt-3 text-sm text-slate-400">Tài khoản được lưu tạm trong phiên prototype và chỉ sử dụng nội bộ.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="flex items-center gap-3 text-cyan-300">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-sm font-semibold text-white">Dữ liệu mẫu</p>
                </div>
                <p className="mt-3 text-sm text-slate-400">Dữ liệu hiển thị ở bảng điều khiển được lấy trực tiếp từ prototype mock data.</p>
              </div>
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-6 text-slate-300 shadow-inner shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Thông tin đăng nhập prototype</p>
              <div className="mt-4 space-y-3 text-sm">
                {demoCredentials.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-950/70 px-4 py-3">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-medium text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="relative overflow-hidden border border-white/10 bg-slate-900/95 shadow-elegant">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-slate-950 shadow-glow">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">Đăng nhập hệ thống</h2>
                  <p className="text-sm leading-6 text-slate-400">Sử dụng tài khoản admin hoặc thí sinh để truy cập dashboard phù hợp.</p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@duongdua.vn"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((value) => !value)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100"
                      aria-label="Hiện/ẩn mật khẩu"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-elegant hover:opacity-95"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Demo prototype</span>
                  <ArrowRightCircle className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-3 text-sm text-slate-400">Sử dụng dữ liệu mẫu để kiểm tra giao diện admin nhanh và trực quan.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
