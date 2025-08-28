import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { CompactDateSelector } from "@/components/sections/CompactDateSelector";
import { ArrowLeft, AlertTriangle, Bug, FormInput, MousePointer2, Zap, Navigation, Clock, Gauge, Eye, Monitor, Smartphone, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface TechSectionProps {
  onBack: () => void;
}

const errorKPIs = [
  { title: "CONSOLE ERROR", value: "5.0%", subtitle: "34 sessioni", color: "red" as const },
  { title: "EXCEPTION", value: "39", subtitle: "errori totali", color: "red" as const },
  { title: "FORM ERRORS", value: "0.0%", subtitle: "errori nei form", color: "green" as const },
];

const frustrationKPIs = [
  { title: "RAGE CLICKS", value: "0.4%", subtitle: "2 sessioni coinvolte", color: "orange" as const },
  { title: "FAST BOUNCE", value: "3.3%", subtitle: "16 uscite rapide", color: "orange" as const },
  { title: "ERROR SECTIONS", value: "5.0%", subtitle: "24 sessioni con errori", color: "red" as const },
  { title: "NAV LOOPS", value: "8.7%", subtitle: "42 navigazioni circolari", color: "orange" as const },
];

const browserErrorData = [
  { browser: "Chrome", errors: 45, percentage: 67 },
  { browser: "Safari", errors: 12, percentage: 18 },
  { browser: "Firefox", errors: 7, percentage: 10 },
  { browser: "Edge", errors: 3, percentage: 5 },
];

const deviceErrorData = [
  { device: "Desktop", errors: 52, percentage: 78 },
  { device: "Mobile", errors: 12, percentage: 18 },
  { device: "Tablet", errors: 3, percentage: 4 },
];

const performanceMetrics = [
  { title: "SESSION DURATION", value: "178s", subtitle: "Tutte le sessioni incluse", color: "blue" as const },
  { title: "TTI", value: "10.0s", subtitle: "Time to First Interaction", color: "orange" as const },
  { title: "INPUT LAG", value: "45ms", subtitle: "Ritardo medio input", color: "red" as const },
  { title: "MEMORY USAGE", value: "24.3MB", subtitle: "Utilizzo memoria medio", color: "purple" as const },
];

const webVitals = [
  { 
    title: "LCP (Largest Contentful Paint)", 
    value: "1782ms", 
    benchmark: "P50 1762ms | P95 4823ms",
    status: "good",
    target: 2500 
  },
  { 
    title: "CLS (Cumulative Layout Shift)", 
    value: "0.000", 
    benchmark: "P50 0.000 | P95 0.000",
    status: "good",
    target: 0.1 
  },
  { 
    title: "FCP (First Contentful Paint)", 
    value: "1062ms", 
    benchmark: "P50 1062ms | P95 4424ms",
    status: "good",
    target: 1800 
  },
];

const problematicSessions = [
  { 
    id: "d349bc5e-c3ff-7517-8884-493bc1e60a10", 
    type: "Video", 
    issue: "Con errori", 
    severity: "high",
    browser: "Chrome",
    device: "Desktop"
  },
  { 
    id: "d398e7f7-c687-700a-af09-ee959f988f77", 
    type: "Video", 
    issue: "Con errori", 
    severity: "high",
    browser: "Safari",
    device: "Mobile"
  },
  { 
    id: "d394e702-e340-7b1c-9024-3e960b649b3a", 
    type: "Video", 
    issue: "Con errori", 
    severity: "high",
    browser: "Firefox",
    device: "Desktop"
  },
  { 
    id: "03988e0c-e817-797e-d0f7-3e12005cf35", 
    type: "Video", 
    issue: "Rage clicks", 
    severity: "medium",
    browser: "Chrome",
    device: "Mobile"
  },
  { 
    id: "059be8d5-1ce8-7739-9418-d8987c1f5ec8", 
    type: "Video", 
    issue: "Rage clicks", 
    severity: "medium",
    browser: "Edge",
    device: "Tablet"
  },
];

export function TechSection({ onBack }: TechSectionProps) {
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
        <DateSelector />
      </div>

      {/* Compact Date Selector */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <CompactDateSelector />
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
                <div className={`w-3 h-3 ${
                  session.severity === 'high' ? 'bg-analytics-red' : 'bg-analytics-orange'
                }`} />
                <span className="text-sm font-mono text-muted-foreground">{session.id}</span>
                <span className="text-xs bg-analytics-blue/20 text-analytics-blue px-2 py-1 font-mono">
                  {session.type}
                </span>
                <span className="text-xs bg-dashboard-surface text-foreground px-2 py-1 border border-dashboard-border font-mono">
                  {session.browser}
                </span>
                <span className="text-xs bg-dashboard-surface text-foreground px-2 py-1 border border-dashboard-border font-mono">
                  {session.device}
                </span>
              </div>
              <span className={`text-sm font-medium font-mono ${
                session.severity === 'high' ? 'text-analytics-red' : 'text-analytics-orange'
              }`}>
                {session.issue}
              </span>
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