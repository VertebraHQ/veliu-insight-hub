import { KPICard } from "@/components/KPICard";
import { TrendSelector } from "@/components/TrendSelector";
import { DateSelector } from "@/components/DateSelector";
import { DataQualityTooltip } from "@/components/DataQualityTooltip";
import { TrendChart } from "@/components/charts/TrendChart";
import { Users, Target, TrendingUp, Percent, BarChart, Zap, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

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
  const {
    data,
    loading,
    error,
    availableDates,
    selectedDate,
    periodType,
    customDateRange,
    setSelectedDate,
    setPeriodType,
    setCustomDateRange,
    refreshData
  } = useAnalyticsData();

  // Calculate derived values from data
  const dataQualityPercentage = data ?
    Math.round(data.data_quality.sampling_rate * 100 * 100) / 100 : 0;
  
  const conversionRate = data ?
    Math.round(data.funnel.conversion_rate * 100 * 100) / 100 : 0;

  const funnelCompletedCount = data ?
    data.funnel.converted_sessions : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-analytics-blue" />
          <span className="ml-2 text-muted-foreground">Caricamento dati...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Alert - show if there's an error but still display data */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="ml-2"
            >
              Riprova
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">DASHBOARD</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {periodType === 'daily' && (
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                availableDates={availableDates}
                disabled={loading}
              />
            )}
            <TrendSelector
              periodType={periodType}
              onPeriodTypeChange={setPeriodType}
              customDateRange={customDateRange}
              onCustomDateRangeChange={setCustomDateRange}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Data Info */}
      {data && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground bg-dashboard-surface/30 border border-dashboard-border rounded-lg p-4">
          <div>
            <span className="font-medium text-analytics-blue">Dati per:</span> {data.meta.date_local} |
            <span className="font-medium text-analytics-green ml-2">Timezone:</span> {data.meta.timezone}
          </div>
          {periodType !== 'daily' && (
            <div className="text-xs">
              <span className="font-medium text-analytics-orange">Modalità:</span> {
                periodType === 'weekly' ? 'Visualizzazione Settimanale' :
                periodType === 'monthly' ? 'Visualizzazione Mensile' :
                periodType === 'custom' ? 'Periodo Personalizzato' : ''
              }
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="SESSIONI TOTALI"
          value={data?.total_sessions_yesterday || 0}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="DATA QUALITY"
          value={`${dataQualityPercentage}%`}
          icon={Target}
          color="green"
        />
        <KPICard
          title="FUNNEL COMPLETATI"
          value={funnelCompletedCount}
          icon={TrendingUp}
          color="orange"
        />
        <KPICard
          title="CONVERSION RATE"
          value={`${conversionRate}%`}
          icon={Percent}
          color="red"
        />
      </div>

      {/* Main Trend Chart */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">TREND PRINCIPALE</h3>
        </div>
        <TrendChart
          data={data}
          periodType={periodType}
          selectedDate={selectedDate}
          customDateRange={customDateRange}
        />
      </div>

      {/* Analysis Sections */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6 tracking-tight">ANALISI DETTAGLIATE</h3>
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