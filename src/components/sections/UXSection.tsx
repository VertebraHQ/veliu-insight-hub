import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { DateSelector } from "@/components/DateSelector";
import { ArrowLeft, MousePointer, Eye, Navigation, Activity, Maximize2, Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UXSectionProps {
  onBack: () => void;
}

const deviceData = [
  { name: 'Desktop', value: 60 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 10 },
];

const osData = [
  { name: 'Windows', value: 45 },
  { name: 'macOS', value: 25 },
  { name: 'Android', value: 20 },
  { name: 'iOS', value: 10 },
];

const browserData = [
  { name: 'Chrome', value: 50 },
  { name: 'Safari', value: 25 },
  { name: 'Firefox', value: 15 },
  { name: 'Edge', value: 10 },
];

const regionData = [
  { name: 'Lombardia', value: 35 },
  { name: 'Lazio', value: 18 },
  { name: 'Veneto', value: 12 },
  { name: 'Emilia-Romagna', value: 10 },
  { name: 'Toscana', value: 8 },
  { name: 'Piemonte', value: 7 },
  { name: 'Altri', value: 10 },
];

const qualityScores = [
  { metric: "Usabilità", score: 25, maxScore: 30, color: "green" },
  { metric: "Accessibilità", score: 12, maxScore: 30, color: "orange" },
  { metric: "Performance", score: 3, maxScore: 30, color: "red" },
];

const userPaths = [
  { 
    id: 1, 
    path: ["Home", "Prodotti", "Checkout"], 
    occurrences: 145, 
    completionRate: 78,
    size: "large"
  },
  { 
    id: 2, 
    path: ["Home", "Chi siamo", "Contatti"], 
    occurrences: 89, 
    completionRate: 92,
    size: "medium"
  },
  { 
    id: 3, 
    path: ["Blog", "Prodotti", "Home"], 
    occurrences: 67, 
    completionRate: 45,
    size: "medium"
  },
  { 
    id: 4, 
    path: ["Prodotti", "Carrello", "Checkout"], 
    occurrences: 56, 
    completionRate: 85,
    size: "small"
  },
  { 
    id: 5, 
    path: ["Home", "Blog", "Home"], 
    occurrences: 34, 
    completionRate: 67,
    size: "small"
  },
];

const pathMetrics = [
  { title: "Pagine per Sessione", value: "4.1", color: "blue" },
  { title: "Tempo Medio", value: "2:34", color: "green" },
  { title: "Completamento Percorso", value: "74%", color: "orange" },
];

export function UXSection({ onBack }: UXSectionProps) {
  const [distributionTab, setDistributionTab] = useState<"device" | "os" | "browser">("device");
  const [heatmapDevice, setHeatmapDevice] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [isHeatmapFullscreen, setIsHeatmapFullscreen] = useState(false);

  const getDistributionData = () => {
    switch (distributionTab) {
      case "os": return osData;
      case "browser": return browserData;
      default: return deviceData;
    }
  };

  const renderPathBlock = (path: any) => {
    const sizeClasses = {
      large: "col-span-2 row-span-2 p-6",
      medium: "col-span-1 row-span-1 p-4",
      small: "col-span-1 row-span-1 p-3"
    };

    return (
      <div key={path.id} className={cn(
        "bg-dashboard-surface/60 border border-dashboard-border dashboard-card relative group",
        sizeClasses[path.size as keyof typeof sizeClasses]
      )}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {path.path.map((step: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="px-3 py-1 bg-analytics-blue/20 text-analytics-blue text-xs font-mono border border-analytics-blue/30">
                  {step}
                </div>
                {index < path.path.length - 1 && (
                  <div className="relative mx-2 group/arrow">
                    <div className="text-muted-foreground">→</div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border px-2 py-1 text-xs opacity-0 group-hover/arrow:opacity-100 transition-opacity">
                      68%<br/>
                      <span className="text-xs text-muted-foreground">{Math.round(path.occurrences * 0.68)} utenti</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground font-mono">{path.occurrences} occorrenze</div>
            <div className="flex items-center space-x-2">
              <Progress value={path.completionRate} className="flex-1 h-1" />
              <span className="text-xs font-mono text-analytics-green">{path.completionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground font-mono tracking-tight">ANALISI UX</h2>
            <p className="text-muted-foreground font-mono">Esperienza utente e heatmaps</p>
          </div>
        </div>
        <DateSelector />
      </div>

      {/* 1. Quality Scores */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">QUALITY SCORE</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualityScores.map((score, index) => (
            <div key={index} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium font-mono text-sm">{score.metric}</span>
                  <span className="font-bold text-lg font-mono">{score.score}%</span>
                </div>
                <Progress value={(score.score / score.maxScore) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  da 0 a {score.maxScore}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Click Analytics & Heatmap */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">CLICK ANALYTICS</h3>
        <KPICard
          title="CLICK TOTALI SITO"
          value="3,540"
          subtitle="nelle ultime 24 ore"
          icon={MousePointer}
          color="blue"
        />
      </div>

      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold font-mono">HEATMAP INTERATTIVA</h3>
          <div className="flex items-center space-x-2">
            <div className="flex bg-dashboard-surface border border-dashboard-border">
              {[
                { id: "desktop", icon: Monitor, label: "Desktop" },
                { id: "mobile", icon: Smartphone, label: "Mobile" },
                { id: "tablet", icon: Tablet, label: "Tablet" }
              ].map((device) => {
                const Icon = device.icon;
                return (
                  <Button
                    key={device.id}
                    variant={heatmapDevice === device.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setHeatmapDevice(device.id as any)}
                    className={cn(
                      "font-mono text-xs px-3 py-2 border-0",
                      heatmapDevice === device.id && "bg-analytics-blue text-white"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </Button>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHeatmapFullscreen(!isHeatmapFullscreen)}
              className="font-mono text-xs"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className={cn(
          "border border-dashboard-border bg-gradient-to-br from-analytics-blue/10 via-analytics-green/10 to-analytics-orange/10 overflow-auto",
          isHeatmapFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : "h-96"
        )}>
          <div className="min-h-[800px] p-8 space-y-6">
            <div className="text-center space-y-3">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground font-medium font-mono">HEATMAP SIMULAZIONE - {heatmapDevice.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground font-mono">Scroll verticale abilitato per navigazione reale</p>
            </div>
            <div className="space-y-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-dashboard-surface/30 p-4 border border-dashboard-border">
                  <div className="h-8 bg-analytics-blue/20 mb-2"></div>
                  <div className="h-4 bg-analytics-green/20 mb-1"></div>
                  <div className="h-4 bg-analytics-orange/20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isHeatmapFullscreen && (
          <Button
            variant="ghost"
            onClick={() => setIsHeatmapFullscreen(false)}
            className="fixed top-8 right-8 z-50 font-mono"
          >
            ✕ CHIUDI
          </Button>
        )}
      </div>

      {/* 3. Analisi Path Utenti - New Design */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">ANALISI PATH UTENTI</h3>
        
        {/* Path Metrics above */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard title="Pagine per Sessione" value="2.5" color="blue" />
          <KPICard title="Tempo Medio Percorso" value="3m 58s" color="green" />
          <KPICard title="Completamento Percorso" value="97%" color="orange" />
          <KPICard title="Passaggi Medi" value="3.2" color="purple" />
        </div>

        {/* Main path (large block) */}
        <div className="mb-6">
          <h4 className="text-sm font-mono text-muted-foreground mb-4">Percorso Principale (25% utenti)</h4>
          <div className="bg-dashboard-surface/30 border border-dashboard-border p-6">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-analytics-blue/20 border border-analytics-blue/30 flex items-center justify-center mb-2">
                  <span className="text-xs font-mono text-analytics-blue">🏠</span>
                </div>
                <div className="text-xs font-mono font-bold text-analytics-blue">Homepage</div>
                <div className="text-xs font-mono text-analytics-blue">100%</div>
              </div>
              <div className="relative group/arrow">
                <div className="text-muted-foreground">→</div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border px-2 py-1 text-xs opacity-0 group-hover/arrow:opacity-100 transition-opacity">
                  68%<br/>
                  <span className="text-xs text-muted-foreground">163 utenti</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-analytics-blue/20 border border-analytics-blue/30 flex items-center justify-center mb-2">
                  <span className="text-xs font-mono text-analytics-blue">📦</span>
                </div>
                <div className="text-xs font-mono font-bold text-analytics-blue">Prodotti</div>
                <div className="text-xs font-mono text-analytics-blue">68%</div>
              </div>
              <div className="relative group/arrow">
                <div className="text-muted-foreground">→</div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border px-2 py-1 text-xs opacity-0 group-hover/arrow:opacity-100 transition-opacity">
                  37%<br/>
                  <span className="text-xs text-muted-foreground">89 utenti</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-analytics-blue/20 border border-analytics-blue/30 flex items-center justify-center mb-2">
                  <span className="text-xs font-mono text-analytics-blue">📞</span>
                </div>
                <div className="text-xs font-mono font-bold text-analytics-blue">Contatti</div>
                <div className="text-xs font-mono text-analytics-blue">25%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Other paths - horizontal layout */}
        <div className="space-y-4">
          <div>
            <h5 className="text-xs font-mono text-muted-foreground mb-3">Percorso Informativo (18% utenti)</h5>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="text-analytics-blue">🏠 Home</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-analytics-blue">🔧 Servizi</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-analytics-blue">👥 Chi Siamo</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-analytics-blue">📞 Contatti</span>
            </div>
          </div>
          
          <div>
            <h5 className="text-xs font-mono text-muted-foreground mb-3">Percorso Contenuti (15% utenti)</h5>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="text-analytics-blue">🏠 Home</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-analytics-blue">📝 Blog</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-analytics-blue">📦 Prodotti</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Comportamentali */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-analytics-blue/10">
            <Activity className="h-5 w-5 text-analytics-blue" />
          </div>
          <h3 className="text-lg font-semibold font-mono">PATTERN COMPORTAMENTALI</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Utenti che abbandonano dopo errori</span>
            <span className="font-bold text-analytics-green font-mono">0.0%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Tempo medio prima della frustrazione</span>
            <span className="font-bold text-analytics-blue font-mono">10s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Engagement ratio nelle sessioni problematiche</span>
            <span className="font-bold text-analytics-orange font-mono">21.3%</span>
          </div>
        </div>
      </div>

      {/* 4. Device/OS/Browser Distribution */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">DISTRIBUZIONE DEVICE/OS/BROWSER</h3>
        <div className="space-y-6">
          <div className="flex bg-dashboard-surface border border-dashboard-border">
            {[
              { id: "device", label: "DEVICE" },
              { id: "os", label: "OS" },
              { id: "browser", label: "BROWSER" }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={distributionTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setDistributionTab(tab.id as any)}
                className={cn(
                  "font-mono text-xs px-6 py-2 border-0",
                  distributionTab === tab.id && "bg-analytics-blue text-white"
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          
          <div className="space-y-4">
            {getDistributionData().map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">{item.name}</span>
                  <span className="font-bold text-analytics-blue font-mono">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="bg-dashboard-surface/60 border border-dashboard-border shadow-card p-6 dashboard-card">
        <h3 className="text-lg font-semibold mb-6 font-mono">DISTRIBUZIONE REGIONI ITALIA</h3>
        <div className="space-y-4">
          {regionData.map((region, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">{region.name}</span>
                <span className="font-bold text-analytics-blue font-mono">{region.value}%</span>
              </div>
              <Progress value={region.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}