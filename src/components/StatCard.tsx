import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  variant?: "primary" | "accent" | "turf" | "destructive";
  hint?: ReactNode;
}

const variantStyles = {
  primary: "bg-gradient-primary text-primary-foreground",
  accent: "bg-gradient-accent text-accent-foreground",
  turf: "bg-gradient-turf text-turf-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

export function StatCard({ label, value, icon: Icon, trend, variant = "primary", hint }: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-card-soft hover:shadow-elegant transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="font-display text-3xl font-bold mt-1.5 text-foreground">{value}</p>
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trend >= 0 ? "text-success" : "text-destructive")}>
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(trend)}% so với tháng trước</span>
              </div>
            )}
            {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
          </div>
          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-md", variantStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
