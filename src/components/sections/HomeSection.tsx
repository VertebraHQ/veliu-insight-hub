import { KPICard } from "@/components/KPICard";
import { TrendSelector } from "@/components/TrendSelector";
import { DataQualityTooltip } from "@/components/DataQualityTooltip";
import { TrendChart } from "@/components/charts/TrendChart";
import { Users, Target, TrendingUp, Percent, BarChart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HomeSectionProps {
  onSectionChange: (section: string) => void;
}

const sectionBoxes = [
  {
    id: "ux",
    title: "UX",
    description: "Esperienza utente e heatmaps",
    icon: Users,
    color: "green" as const,
  },
  {
    id: "tech",
    title: "TECH",
    description: "Metriche tecniche e performance",
    icon: Zap,
    color: "orange" as const,
  },
];

const colorClasses = {
  green: "bg-analytics-green/10 border-analytics-green/20 hover:bg-analytics-green/20 text-analytics-green",
  orange: "bg-analytics-orange/10 border-analytics-orange/20 hover:bg-analytics-orange/20 text-analytics-orange",
};

export function HomeSection({ onSectionChange }: HomeSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-foreground font-mono tracking-tight">DASHBOARD</h2>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="SESSIONI TOTALI"
          value="484"
          icon={Users}
          color="blue"
        />
        <div className="group relative overflow-hidden border bg-dashboard-surface/60 p-6 shadow-card transition-all duration-150 hover:shadow-card-hover hover:scale-[1.02] dashboard-card border-analytics-green/20 bg-analytics-green/5 text-analytics-green">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground font-mono">DATA QUALITY</p>
              <div className="mt-2">
                <DataQualityTooltip value="96.2%" />
              </div>
            </div>
            <div className="p-2 rounded-lg text-analytics-green">
              <Target className="h-6 w-6" />
            </div>
          </div>
        </div>
        <KPICard
          title="FUNNEL COMPLETATI"
          value="0"
          icon={TrendingUp}
          color="orange"
        />
        <KPICard
          title="CONVERSION RATE"
          value="0%"
          icon={Percent}
          color="red"
        />
      </div>

      {/* Main Trend Chart */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground font-mono">TREND PRINCIPALE</h3>
          <TrendSelector />
        </div>
        <TrendChart />
      </div>

      {/* Analysis Sections */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6 font-mono tracking-tight">ANALISI DETTAGLIATE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionBoxes.map((box) => {
            const Icon = box.icon;
            return (
              <Button
                key={box.id}
                variant="outline"
                onClick={() => onSectionChange(box.id)}
                className={cn(
                  "h-auto p-8 flex flex-col items-center text-center space-y-4 transition-all duration-150 hover:scale-105 border-2 dashboard-card",
                  colorClasses[box.color]
                )}
              >
                <div className="p-4 bg-current/10">
                  <Icon className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold font-mono">{box.title}</h4>
                  <p className="text-sm opacity-80 font-mono">{box.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}