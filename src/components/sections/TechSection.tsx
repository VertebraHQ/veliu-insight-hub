import { KPICard } from "@/components/KPICard";
import { ArrowLeft, AlertTriangle, Bug, FormInput, MousePointer2, Zap, Navigation, Clock, Gauge, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TechSectionProps {
  onBack: () => void;
}

const errorKPIs = [
  { title: "Console Error", value: "5.0%", subtitle: "34 sessioni", color: "red" as const },
  { title: "Exception", value: "39", subtitle: "errori totali", color: "red" as const },
  { title: "Form Errors", value: "0.0%", subtitle: "errori nei form", color: "green" as const },
];

const frustrationKPIs = [
  { title: "Rage Clicks", value: "0.4%", subtitle: "2 sessioni coinvolte", color: "orange" as const },
  { title: "Fast Bounce", value: "3.3%", subtitle: "16 uscite rapide", color: "orange" as const },
  { title: "Error Sections", value: "5.0%", subtitle: "24 sessioni con errori", color: "red" as const },
  { title: "Nav Loops", value: "8.7%", subtitle: "42 navigazioni circolari", color: "orange" as const },
];

const problematicSessions = [
  { 
    id: "d349bc5e-c3ff-7517-8884-493bc1e60a10", 
    type: "Video", 
    issue: "Con errori", 
    severity: "high" 
  },
  { 
    id: "d398e7f7-c687-700a-af09-ee959f988f77", 
    type: "Video", 
    issue: "Con errori", 
    severity: "high" 
  },
  { 
    id: "d394e702-e340-7b1c-9024-3e960b649b3a", 
    type: "Video", 
    issue: "Con errori", 
    severity: "high" 
  },
  { 
    id: "03988e0c-e817-797e-d0f7-3e12005cf35", 
    type: "Video", 
    issue: "Rage clicks", 
    severity: "medium" 
  },
  { 
    id: "059be8d5-1ce8-7739-9418-d8987c1f5ec8", 
    type: "Video", 
    issue: "Rage clicks", 
    severity: "medium" 
  },
];

const performanceMetrics = [
  { title: "Session Duration", value: "178s", subtitle: "Media durata sessione", color: "blue" as const },
  { title: "TTI", value: "10.0s", subtitle: "Time to First Interaction", color: "orange" as const },
  { title: "Fast Bounce Rate", value: "3.3%", subtitle: "Sessioni con abbandono rapido", color: "green" as const },
];

const webVitals = [
  { 
    title: "LCP (Largest Contentful Paint)", 
    value: "1782ms", 
    benchmark: "P50 1762ms | P95 4823ms",
    status: "good" 
  },
  { 
    title: "CLS (Cumulative Layout Shift)", 
    value: "0.000", 
    benchmark: "P50 0.000 | P95 0.000",
    status: "good" 
  },
  { 
    title: "FCP (First Contentful Paint)", 
    value: "1062ms", 
    benchmark: "P50 1062ms | P95 4424ms",
    status: "good" 
  },
];

const behaviors = [
  { metric: "Utenti che abbandonano dopo errori", percentage: 0.0 },
  { metric: "Tempo medio prima della frustrazione", percentage: 10 },
  { metric: "Engagement ratio nelle sessioni problematiche", percentage: 21.3 },
];

export function TechSection({ onBack }: TechSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold text-foreground">Analisi Tech</h2>
        <p className="text-muted-foreground">Metriche tecniche e performance</p>
      </div>

      {/* Critical Issues Alert */}
      <Alert className="border-analytics-red/20 bg-analytics-red/10">
        <AlertTriangle className="h-4 w-4 text-analytics-red" />
        <AlertDescription className="text-analytics-red font-medium">
          <span className="font-bold">ATTENZIONE: Problemi Critici Rilevati</span><br />
          • Errori tecnici frequenti
        </AlertDescription>
      </Alert>

      {/* Error Analysis */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bug className="h-6 w-6 text-analytics-red" />
          <h3 className="text-lg font-semibold">Analisi Errori e Segnali di User Frustration</h3>
          <span className="text-xs bg-analytics-red/20 text-analytics-red px-2 py-1 rounded-full font-medium">
            LIVELLO: BASSO (4.4%)
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-4 text-analytics-red">Errori Tecnici</h4>
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
            <h4 className="text-md font-medium mb-4 text-analytics-orange">Metriche di Frustrazione Utente</h4>
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

      {/* Behavioral Patterns */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Pattern Comportamentali</h3>
        <div className="space-y-4">
          {behaviors.map((behavior, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{behavior.metric}</span>
                <span className="font-bold text-analytics-blue">{behavior.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-analytics-blue transition-all duration-500"
                  style={{ width: `${behavior.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problematic Sessions */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Sessioni Problematiche</h3>
        <div className="space-y-3">
          {problematicSessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  session.severity === 'high' ? 'bg-analytics-red' : 'bg-analytics-orange'
                }`} />
                <span className="text-sm font-mono text-muted-foreground">{session.id}</span>
                <span className="text-xs bg-analytics-blue/20 text-analytics-blue px-2 py-1 rounded">
                  {session.type}
                </span>
              </div>
              <span className={`text-sm font-medium ${
                session.severity === 'high' ? 'text-analytics-red' : 'text-analytics-orange'
              }`}>
                {session.issue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-analytics-blue/10 rounded-lg">
            <Eye className="h-5 w-5 text-analytics-blue" />
          </div>
          <h3 className="text-lg font-semibold">Raccomandazioni per Ridurre Errori e Frustrazione</h3>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-analytics-blue/5 border border-analytics-blue/20 rounded-lg">
            <p className="text-sm text-analytics-blue">
              <span className="font-medium">• Risolvere gli errori javascript critici</span><br />
              Implementare un sistema di error tracking più robusto
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Metriche di Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performanceMetrics.map((metric, index) => (
            <KPICard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={index === 0 ? Clock : index === 1 ? Gauge : Zap}
              color={metric.color}
            />
          ))}
        </div>
      </div>

      {/* Web Vitals */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Web Vitals</h3>
        <div className="space-y-4">
          {webVitals.map((vital, index) => (
            <div key={index} className="p-4 border border-dashboard-border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">{vital.title}</h4>
                  <p className="text-2xl font-bold text-analytics-green mt-1">{vital.value}</p>
                </div>
                <span className="bg-analytics-green/20 text-analytics-green px-3 py-1 rounded-full text-xs font-medium">
                  {vital.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{vital.benchmark}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}