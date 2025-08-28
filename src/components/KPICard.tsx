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
  blue: "border-analytics-blue/20 bg-analytics-blue/5 text-analytics-blue",
  green: "border-analytics-green/20 bg-analytics-green/5 text-analytics-green",
  orange: "border-analytics-orange/20 bg-analytics-orange/5 text-analytics-orange",
  red: "border-analytics-red/20 bg-analytics-red/5 text-analytics-red",
  purple: "border-analytics-purple/20 bg-analytics-purple/5 text-analytics-purple",
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
      "group relative overflow-hidden border bg-dashboard-surface/60 p-6 shadow-card transition-all duration-150 hover:shadow-card-hover hover:scale-[1.02]",
      colorClasses[color],
      "dashboard-card",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-xs font-medium",
              trend.isPositive ? "text-analytics-green" : "text-analytics-red"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-lg", iconColorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02] pointer-events-none" />
    </div>
  );
}