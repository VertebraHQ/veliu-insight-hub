import { KPICard } from "@/components/KPICard";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft, TrendingUp, Users, Globe, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessSectionProps {
  onBack: () => void;
}

const funnelData = [
  { step: '1. Comprensione', sessions: 484, name: 'Utenti totali' },
  { step: '2. Interesse', sessions: 45, name: 'Sessioni interessate' },
  { step: '3. Considerazione', sessions: 250, name: 'In considerazione' },
];

const deviceData = [
  { name: 'Desktop', value: 60, color: '#3b82f6' },
  { name: 'Mobile', value: 30, color: '#10b981' },
  { name: 'Tablet', value: 10, color: '#f59e0b' },
];

const osData = [
  { name: 'Windows', value: 45, color: '#3b82f6' },
  { name: 'macOS', value: 25, color: '#10b981' },
  { name: 'Android', value: 20, color: '#f59e0b' },
  { name: 'iOS', value: 10, color: '#ef4444' },
];

const browserData = [
  { name: 'Chrome', value: 50, color: '#3b82f6' },
  { name: 'Safari', value: 25, color: '#10b981' },
  { name: 'Firefox', value: 15, color: '#f59e0b' },
  { name: 'Edge', value: 10, color: '#ef4444' },
];

const hourlyData = [
  { hour: '00', sessions: 12 },
  { hour: '01', sessions: 8 },
  { hour: '02', sessions: 5 },
  { hour: '03', sessions: 3 },
  { hour: '04', sessions: 2 },
  { hour: '05', sessions: 4 },
  { hour: '06', sessions: 8 },
  { hour: '07', sessions: 15 },
  { hour: '08', sessions: 25 },
  { hour: '09', sessions: 35 },
  { hour: '10', sessions: 45 },
  { hour: '11', sessions: 48 },
  { hour: '12', sessions: 42 },
  { hour: '13', sessions: 38 },
  { hour: '14', sessions: 40 },
  { hour: '15', sessions: 44 },
  { hour: '16', sessions: 46 },
  { hour: '17', sessions: 50 },
  { hour: '18', sessions: 45 },
  { hour: '19', sessions: 35 },
  { hour: '20', sessions: 28 },
  { hour: '21', sessions: 22 },
  { hour: '22', sessions: 18 },
  { hour: '23', sessions: 15 },
];

const landingPaths = [
  { page: '/', visits: 156 },
  { page: '/prodotti', visits: 89 },
  { page: '/about', visits: 67 },
  { page: '/contatti', visits: 45 },
  { page: '/blog', visits: 34 },
];

const exitPaths = [
  { page: '/checkout', visits: 78 },
  { page: '/prodotti', visits: 56 },
  { page: '/', visits: 45 },
  { page: '/about', visits: 34 },
  { page: '/contatti', visits: 23 },
];

export function BusinessSection({ onBack }: BusinessSectionProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold text-foreground">Analisi Business</h2>
        <p className="text-muted-foreground">Funnel di conversione e distribuzione del traffico</p>
      </div>

      {/* Funnel Analysis */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Funnel di Conversione - 5 Fasi</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {funnelData.map((item, index) => (
              <KPICard
                key={index}
                title={item.step}
                value={item.sessions}
                subtitle={`${item.name}`}
                color={index === 0 ? "blue" : index === 1 ? "orange" : "green"}
              />
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="step" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="sessions" fill="hsl(var(--analytics-blue))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device, OS, Browser Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { title: "Distribuzione Device", data: deviceData },
          { title: "Distribuzione OS", data: osData },
          { title: "Distribuzione Browser", data: browserData }
        ].map((chart, index) => (
          <div key={index} className="bg-card rounded-xl border shadow-card p-6">
            <h3 className="text-lg font-semibold mb-4">{chart.title}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {chart.data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Hourly Sessions */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Connessioni per Ora</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip />
            <Bar dataKey="sessions" fill="hsl(var(--analytics-blue))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Landing and Exit Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-card p-6">
          <h3 className="text-lg font-semibold mb-6">Top Landing Paths</h3>
          <div className="space-y-3">
            {landingPaths.map((path, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{path.page}</span>
                <span className="font-medium text-analytics-blue">{path.visits}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-xl border shadow-card p-6">
          <h3 className="text-lg font-semibold mb-6">Top Exit Paths</h3>
          <div className="space-y-3">
            {exitPaths.map((path, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">{path.page}</span>
                <span className="font-medium text-analytics-red">{path.visits}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Quality */}
      <div className="bg-card rounded-xl border shadow-card p-6">
        <h3 className="text-lg font-semibold mb-6">Data Quality</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            title="Affidabilità"
            value="95.5%"
            color="green"
          />
          <KPICard
            title="Accuratezza"
            value="98.0%"
            color="green"
          />
          <KPICard
            title="Completezza"
            value="97.8%"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}