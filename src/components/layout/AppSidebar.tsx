import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Trophy, CalendarClock, Rabbit, UserCircle2,
  ShieldCheck, ClipboardList, Medal, Sparkles, Bell, Settings
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const mainItems = [
  { title: "Tổng quan", url: "/dashboard", icon: LayoutDashboard },
  { title: "Giải đấu", url: "/tournaments", icon: Trophy },
  { title: "Lịch đua", url: "/races", icon: CalendarClock },
  { title: "Ngựa", url: "/horses", icon: Rabbit },
  { title: "Nài ngựa", url: "/jockeys", icon: UserCircle2 },
  { title: "Trọng tài", url: "/referees", icon: ShieldCheck },
  { title: "Đăng ký", url: "/registrations", icon: ClipboardList },
];

const competitorItems = [
  { title: "Trang chính", url: "/competitor", icon: LayoutDashboard },
  { title: "Giải đấu mở đăng ký", url: "/tournaments", icon: Trophy },
  { title: "Lịch đua mở đăng ký", url: "/races", icon: CalendarClock },
];

const secondaryItems = [
  { title: "Kết quả & Xếp hạng", url: "/results", icon: Medal },
  { title: "Dự đoán & Thưởng", url: "/predictions", icon: Sparkles },
  { title: "Thông báo", url: "/notifications", icon: Bell },
  { title: "Cài đặt", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const items = user?.role === "competitor" ? competitorItems : mainItems;
  const showSecondary = user?.role !== "competitor";

  const renderItem = (item: typeof mainItems[number]) => {
    const active = pathname === item.url;
    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
          <NavLink to={item.url} className="flex items-center gap-3">
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border bg-slate-950/95">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-glow">
            <Trophy className="h-5 w-5 text-slate-950" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-base font-bold text-white">Horse Racing Prototype</div>
              <div className="text-[11px] text-slate-400">
                {user?.role === "competitor" ? "Bảng điều khiển thí sinh" : "Quản trị giải đua ngựa"}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 pt-3 pb-3">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Quản lý chính</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{items.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {showSecondary && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel>Phân tích & Hệ thống</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>{secondaryItems.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      {!collapsed && (
        <div className="mt-auto border-t border-sidebar-border px-4 py-4 text-xs text-slate-500">
          <div className="font-semibold text-slate-100">Track Status</div>
          <p className="mt-2 leading-snug">Đầy đủ tính năng prototype cho điều hành cuộc đua, theo dõi ngựa, nài ngựa và kết quả.</p>
        </div>
      )}
    </Sidebar>
  );
}
