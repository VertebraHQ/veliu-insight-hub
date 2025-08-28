import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "orange" | "red" | "purple";
  className?: string;
}

const colorClasses = {
  blue: "border-analytics-blue/30",
  green: "border-analytics-green/30", 
  orange: "border-analytics-orange/30",
  red: "border-analytics-red/30",
  purple: "border-analytics-purple/30",
};

const iconColorClasses = {
  blue: "text-analytics-blue",
  green: "text-analytics-green",
  orange: "text-analytics-orange",
  red: "text-analytics-red",
  purple: "text-analytics-purple",
};

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = "blue", 
  className 
}: KPICardProps) {
  return (
    <div className={cn(
      "group relative border bg-dashboard-surface/70 p-8 transition-all duration-150 hover:bg-dashboard-surface-hover/70",
      colorClasses[color],
      "brutal-box",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">{title}</p>
          <p className="text-4xl font-black text-foreground tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center text-sm font-bold tracking-wide",
              trend.isPositive ? "text-analytics-green" : "text-analytics-red"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 border border-dashboard-border bg-dashboard-surface/40", iconColorClasses[color])}>
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  );
}