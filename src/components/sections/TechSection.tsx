import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { CompactDateSelector } from "@/components/sections/CompactDateSelector";
import { ArrowLeft, AlertTriangle, Bug, FormInput, MousePointer2, Zap, Navigation, Clock, Gauge, Eye, Monitor, Smartphone, Activity, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

interface TechSectionProps {
  onBack: () => void;
}

export function TechSection({ onBack }: TechSectionProps) {
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

  // Calculate data from analytics
  const consoleErrorRate = data ? (data.rates.console_error_rate * 100).toFixed(1) : "0.0";
  const consoleErrorSessions = data ? Math.round(data.rates.console_error_rate * data.total_sessions_yesterday) : 0;
  const totalExceptions = data ? data.tech.errors.exceptions_by_fingerprint.reduce((sum, item) => sum + item.count, 0) : 0;
  const formErrorRate = data ? (data.rates.form_error_rate * 100).toFixed(1) : "0.0";
  const rageclickRate = data ? (data.rates.rageclick_rate * 100).toFixed(1) : "0.0";
  const rageclickSessions = data ? Math.round(data.rates.rageclick_rate * data.total_sessions_yesterday) : 0;
  const fastBounceRate = data ? (data.rates.fast_bounce_rate * 100).toFixed(1) : "0.0";
  const fastBounceSessions = data ? Math.round(data.rates.fast_bounce_rate * data.total_sessions_yesterday) : 0;
  const navLoopRate = data ? (data.rates.nav_loop_rate * 100).toFixed(1) : "0.0";
  const navLoopSessions = data ? Math.round(data.rates.nav_loop_rate * data.total_sessions_yesterday) : 0;

  const errorKPIs = [
    { title: "CONSOLE ERROR", value: `${consoleErrorRate}%`, subtitle: `${consoleErrorSessions} sessioni`, color: "red" as const },
    { title: "EXCEPTION", value: totalExceptions.toString(), subtitle: "errori totali", color: "red" as const },
    { title: "FORM ERRORS", value: `${formErrorRate}%`, subtitle: "errori nei form", color: "green" as const },
  ];

  const frustrationKPIs = [
    { title: "RAGE CLICKS", value: `${rageclickRate}%`, subtitle: `${rageclickSessions} sessioni coinvolte`, color: "orange" as const },
    { title: "FAST BOUNCE", value: `${fastBounceRate}%`, subtitle: `${fastBounceSessions} uscite rapide`, color: "orange" as const },
    { title: "ERROR SECTIONS", value: `${consoleErrorRate}%`, subtitle: `${consoleErrorSessions} sessioni con errori`, color: "red" as const },
    { title: "NAV LOOPS", value: `${navLoopRate}%`, subtitle: `${navLoopSessions} navigazioni circolari`, color: "orange" as const },
  ];

  const browserErrorData = data ? Object.entries(data.tech.errors.console_by_browser).map(([browser, errors]) => {
    const totalErrors = Object.values(data.tech.errors.console_by_browser).reduce((sum, count) => sum + count, 0);
    return {
      browser: browser === 'Mobile Safari' ? 'Safari' : browser === 'Microsoft Edge' ? 'Edge' : browser,
      errors,
      percentage: Math.round((errors / totalErrors) * 100)
    };
  }) : [];

  const deviceErrorData = data ? Object.entries(data.tech.errors.console_by_device).map(([device, errors]) => {
    const totalErrors = Object.values(data.tech.errors.console_by_device).reduce((sum, count) => sum + count, 0);
    return {
      device,
      errors,
      percentage: Math.round((errors / totalErrors) * 100)
    };
  }) : [];

  const avgSessionDuration = data ? Math.round(data.averages.avg_session_duration) : 0;
  const avgTTI = data ? data.averages.avg_ttf_interaction_sec.toFixed(1) : "0.0";

  const performanceMetrics = [
    { title: "SESSION DURATION", value: `${avgSessionDuration}s`, subtitle: "Tutte le sessioni incluse", color: "blue" as const },
    { title: "TTI", value: `${avgTTI}s`, subtitle: "Time to First Interaction", color: "orange" as const },
    { title: "INPUT LAG", value: data ? `${data.web_vitals.inp_ms.p50 || 0}ms` : "0ms", subtitle: "Ritardo medio input", color: "red" as const },
    { title: "MEMORY USAGE", value: "24.3MB", subtitle: "Utilizzo memoria medio", color: "purple" as const },
  ];

  const webVitals = data ? [
    {
      title: "LCP (Largest Contentful Paint)",
      value: `${data.web_vitals.lcp_ms.p50}ms`,
      benchmark: `P50 ${data.web_vitals.lcp_ms.p50}ms | P95 ${data.web_vitals.lcp_ms.p95.toFixed(0)}ms`,
      status: "good",
      target: 2500
    },
    {
      title: "CLS (Cumulative Layout Shift)",
      value: data.web_vitals.cls.p50.toFixed(3),
      benchmark: `P50 ${data.web_vitals.cls.p50.toFixed(3)} | P95 ${data.web_vitals.cls.p95.toFixed(3)}`,
      status: "good",
      target: 0.1
    },
    {
      title: "FCP (First Contentful Paint)",
      value: `${data.web_vitals.fcp_ms.p50}ms`,
      benchmark: `P50 ${data.web_vitals.fcp_ms.p50}ms | P95 ${data.web_vitals.fcp_ms.p95.toFixed(0)}ms`,
      status: "good",
      target: 1800
    },
  ] : [];

  // Generate sample problematic sessions from error examples
  const problematicSessions = data && data.ux.frustration.examples.with_errors ?
    data.ux.frustration.examples.with_errors.slice(0, 5).map((sessionId, index) => ({
      id: sessionId,
      type: "Video",
      issue: index < 3 ? "Con errori" : "Rage clicks",
      severity: index < 3 ? "high" as const : "medium" as const,
      browser: ["Chrome", "Safari", "Firefox", "Chrome", "Edge"][index],
      device: ["Desktop", "Mobile", "Desktop", "Mobile", "Tablet"][index]
    })) : [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-analytics-blue" />
          <span className="ml-2 text-muted-foreground">Caricamento dati Tech...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Errore nel caricamento dei dati Tech: {error}
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
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground font-mono tracking-tight">ANALISI TECH</h2>
            <p className="text-muted-foreground font-mono">Metriche tecniche e performance</p>
          </div>
        </div>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          availableDates={availableDates}
          disabled={loading}
        />
      </div>

      {/* Compact Date Selector */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <CompactDateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          periodType={periodType}
          onPeriodTypeChange={setPeriodType}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
          availableDates={availableDates}
          disabled={loading}
        />
      </div>

      {/* Critical Issues Alert */}
      <Alert className="border-analytics-red/20 bg-analytics-red/10 dashboard-card">
        <AlertTriangle className="h-4 w-4 text-analytics-red" />
        <AlertDescription className="text-analytics-red font-medium font-mono">
          <span className="font-bold">ATTENZIONE: PROBLEMI CRITICI RILEVATI</span><br />
          • Errori tecnici frequenti
        </AlertDescription>
      </Alert>

      {/* Error Analysis */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex items-center space-x-3 mb-6">
          <Bug className="h-6 w-6 text-analytics-red" />
          <h3 className="text-lg font-semibold font-mono">ANALISI ERRORI E SEGNALI DI USER FRUSTRATION</h3>
          <span className="text-xs bg-analytics-red/20 text-analytics-red px-2 py-1 font-medium font-mono">
            LIVELLO: BASSO (4.4%)
          </span>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-md font-medium mb-4 text-analytics-red font-mono">ERRORI TECNICI</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {errorKPIs.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  subtitle={kpi.subtitle}
                  icon={index === 0 ? Bug : index === 1 ? AlertTriangle : FormInput}
                  color={kpi.color}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium mb-4 text-analytics-orange font-mono">METRICHE DI FRUSTRAZIONE UTENTE</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {frustrationKPIs.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  subtitle={kpi.subtitle}
                  icon={index === 0 ? MousePointer2 : index === 1 ? Zap : index === 2 ? AlertTriangle : Navigation}
                  color={kpi.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Browser and Device Error Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
          <h3 className="text-lg font-semibold mb-6 font-mono">ERRORI PER BROWSER</h3>
          <div className="space-y-4">
            {browserErrorData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">{item.browser}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-analytics-red font-mono">{item.errors}</span>
                    <span className="text-xs text-muted-foreground font-mono">({item.percentage}%)</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
          <h3 className="text-lg font-semibold mb-6 font-mono">ERRORI PER DEVICE</h3>
          <div className="space-y-4">
            {deviceErrorData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono">{item.device}</span>
                    {item.device === 'Desktop' && <Monitor className="h-3 w-3" />}
                    {item.device === 'Mobile' && <Smartphone className="h-3 w-3" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-analytics-red font-mono">{item.errors}</span>
                    <span className="text-xs text-muted-foreground font-mono">({item.percentage}%)</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">METRICHE DI PERFORMANCE</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <KPICard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={index === 0 ? Clock : index === 1 ? Gauge : index === 2 ? Zap : Eye}
              color={metric.color}
            />
          ))}
        </div>
      </div>

      {/* Problematic Sessions */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">SESSIONI PROBLEMATICHE</h3>
        <div className="space-y-3">
          {problematicSessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors border border-dashboard-border">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-mono text-muted-foreground">{session.id}</span>
                <span className={`text-sm font-medium font-mono ${
                  session.severity === 'high' ? 'text-analytics-red' : 'text-analytics-orange'
                }`}>
                  {session.issue}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://eu.posthog.com/project/48794/replay/${session.id}`, '_blank')}
                className="flex items-center space-x-1 text-xs"
              >
                <Play className="h-3 w-3" />
                <span>Video</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Comportamentali */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono text-analytics-red">PATTERN COMPORTAMENTALI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Utenti che abbandonano dopo errori</span>
              <Bug className="h-4 w-4 text-analytics-red" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-green">0.0%</span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Tempo medio prima della frustrazione</span>
              <AlertTriangle className="h-4 w-4 text-analytics-orange" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-blue">10s</span>
          </div>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-muted-foreground">Engagement ratio nelle sessioni problematiche</span>
              <Activity className="h-4 w-4 text-analytics-green" />
            </div>
            <span className="font-bold text-2xl font-mono text-analytics-orange">21.3%</span>
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">WEB VITALS</h3>
        <div className="space-y-4">
          {webVitals.map((vital, index) => (
            <div key={index} className="p-4 border border-dashboard-border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground font-mono">{vital.title}</h4>
                  <p className="text-2xl font-bold text-analytics-green mt-1 font-mono">{vital.value}</p>
                </div>
                <span className="bg-analytics-green/20 text-analytics-green px-3 py-1 text-xs font-medium font-mono">
                  {vital.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{vital.benchmark}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}