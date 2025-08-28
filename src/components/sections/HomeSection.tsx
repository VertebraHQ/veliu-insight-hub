import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { TrendChart } from "@/components/charts/TrendChart";
import { Users, Target, TrendingUp, Percent, BarChart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HomeSectionProps {
  onSectionChange: (section: string) => void;
}

const sectionBoxes = [
  {
    id: "business",
    title: "BUSINESS",
    description: "Analisi funnel e distribuzione del traffico",
    icon: BarChart,
    color: "blue" as const,
  },
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
  blue: "bg-analytics-blue/10 border-analytics-blue/20 hover:bg-analytics-blue/20 text-analytics-blue",
  green: "bg-analytics-green/10 border-analytics-green/20 hover:bg-analytics-green/20 text-analytics-green",
  orange: "bg-analytics-orange/10 border-analytics-orange/20 hover:bg-analytics-orange/20 text-analytics-orange",
};

export function HomeSection({ onSectionChange }: HomeSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header with Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <DateSelector />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Sessioni Totali"
          value="484"
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Sessioni Analizzate"
          value="482"
          icon={Target}
          color="green"
        />
        <KPICard
          title="Funnel Completati"
          value="0"
          icon={TrendingUp}
          color="orange"
        />
        <KPICard
          title="Conversion Rate"
          value="0%"
          icon={Percent}
          color="red"
        />
      </div>

      {/* Main Trend Chart */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <TrendChart />
      </div>

      {/* Analysis Sections */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Analisi Dettagliate</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sectionBoxes.map((box) => {
            const Icon = box.icon;
            return (
              <Button
                key={box.id}
                variant="outline"
                onClick={() => onSectionChange(box.id)}
                className={cn(
                  "h-auto p-8 flex flex-col items-center text-center space-y-4 transition-all duration-200 hover:scale-105 border-2",
                  colorClasses[box.color]
                )}
              >
                <div className="p-4 rounded-2xl bg-current/10">
                  <Icon className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">{box.title}</h4>
                  <p className="text-sm opacity-80">{box.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}