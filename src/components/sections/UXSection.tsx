import { KPICard } from "@/components/KPICard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, MousePointer, Eye, Navigation, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UXSectionProps {
  onBack: () => void;
}

const qualityScores = [
  { metric: "Usabilità", score: 94.3, color: "green" },
  { metric: "Accessibilità", score: 44.2, color: "orange" },
  { metric: "Performance", score: 10.5, color: "red" },
];

const pageViewData = [
  { page: 'Homepage', views: 5640, bounceRate: 23.4 },
  { page: 'Prodotti', views: 723, bounceRate: 45.2 },
  { page: 'Chi siamo', views: 456, bounceRate: 34.1 },
  { page: 'Contatti', views: 234, bounceRate: 12.3 },
  { page: 'Blog', views: 189, bounceRate: 28.7 },
];

const clickDistributionData = [
  { element: 'Header Menu', clicks: 1250, color: '#3b82f6' },
  { element: 'CTA Button', clicks: 890, color: '#10b981' },
  { element: 'Footer Links', clicks: 650, color: '#f59e0b' },
  { element: 'Sidebar', clicks: 420, color: '#ef4444' },
  { element: 'Content Links', clicks: 320, color: '#8b5cf6' },
];

const userPaths = [
  { id: 1, path: "Home → Prodotti → Checkout", occurrences: 145, completionRate: 78 },
  { id: 2, path: "Home → Chi siamo → Contatti", occurrences: 89, completionRate: 92 },
  { id: 3, path: "Blog → Prodotti → Home", occurrences: 67, completionRate: 45 },
  { id: 4, path: "Prodotti → Carrello → Checkout", occurrences: 56, completionRate: 85 },
  { id: 5, path: "Home → Blog → Home", occurrences: 34, completionRate: 67 },
];

const navigationData = [
  { metric: "Profondità media sessione", value: "3.2", unit: "pagine" },
  { metric: "Tempo medio per pagina", value: "2:34", unit: "minuti" },
  { metric: "Tasso di rimbalzo", value: "28.5%", unit: "" },
  { metric: "Pagine per sessione", value: "4.1", unit: "pagine" },
];

export function UXSection({ onBack }: UXSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold text-foreground">Analisi UX</h2>
        <p className="text-muted-foreground">Esperienza utente e heatmaps</p>
      </div>

      {/* Quality Scores */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Quality Score</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualityScores.map((score, index) => (
            <div key={index} className="space-y-4">
              <KPICard
                title={score.metric}
                value={`${score.score}%`}
                color={score.color as any}
              />
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    score.color === 'green' ? 'bg-analytics-green' :
                    score.color === 'orange' ? 'bg-analytics-orange' : 'bg-analytics-red'
                  }`}
                  style={{ width: `${score.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-card p-6">
          <h3 className="text-lg font-semibold mb-6">KPI Click e Pagine</h3>
          <div className="space-y-4">
            {pageViewData.map((page, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{page.page}</span>
                  <div className="flex space-x-4">
                    <span className="text-analytics-blue font-medium">{page.views} views</span>
                    <span className="text-analytics-orange text-sm">{page.bounceRate}% bounce</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div 
                    className="h-1 rounded-full bg-analytics-blue transition-all duration-500"
                    style={{ width: `${(page.views / 5640) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-card p-6">
          <h3 className="text-lg font-semibold mb-6">Distribuzione Click</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={clickDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="clicks"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {clickDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Click']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Placeholder */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Heatmap Placeholder</h3>
        <div className="bg-gradient-to-br from-analytics-blue/10 via-analytics-green/10 to-analytics-orange/10 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
          <div className="text-center space-y-3">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-medium">Heatmap Interattiva</p>
            <p className="text-sm text-muted-foreground">Visualizzazione click e movimenti mouse</p>
          </div>
        </div>
      </div>

      {/* User Path Analysis */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Analisi Path Utenti</h3>
        <div className="space-y-4">
          {userPaths.map((path) => (
            <div key={path.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{path.path}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {path.occurrences} occorrenze • {path.completionRate}% completamento
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-analytics-blue">{path.occurrences}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-analytics-green transition-all duration-500"
                  style={{ width: `${path.completionRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Schema */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Schema Navigazione</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationData.map((item, index) => (
            <KPICard
              key={index}
              title={item.metric}
              value={item.value}
              subtitle={item.unit}
              icon={index === 0 ? Navigation : index === 1 ? Activity : index === 2 ? MousePointer : Eye}
              color={index % 2 === 0 ? "blue" : "green"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}