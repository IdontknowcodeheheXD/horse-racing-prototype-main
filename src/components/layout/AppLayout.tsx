import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const initials = (user?.name ?? "QT").split(" ").map(w => w[0]).slice(-2).join("").toUpperCase();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    nav("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.1),_transparent_18%),linear-gradient(180deg,_#020617_0%,_#0b1220_100%)] text-slate-100">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="relative h-18 flex items-center gap-3 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl px-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)] sticky top-0 z-40">
            <SidebarTrigger />
            <div className="relative hidden md:block flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Tìm kiếm giải đấu, ngựa, nài ngựa..." className="pl-9 bg-slate-950/70 text-slate-100" />
            </div>
            <div className="flex-1 md:hidden" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">Horse Racing Prototype</span>
            </div>
            <Button variant="ghost" size="icon" className="relative" aria-label="Thông báo">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground">3</Badge>
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 border-l border-white/10 ml-1 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 text-slate-950 text-xs font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block leading-tight text-left">
                    <div className="text-sm font-medium text-slate-100">{user?.name ?? "Quản trị viên"}</div>
                    <div className="text-[11px] text-slate-400">{user?.email ?? ""}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.role === "competitor" ? "Tài khoản thí sinh" : "Tài khoản quản trị"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
            <div className="h-full min-h-[calc(100vh-5rem)] rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
