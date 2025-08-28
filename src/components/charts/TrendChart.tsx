import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '20', sessioniTotali: 30, funnelCompletati: 0, percentualeConversione: 0 },
  { date: '21', sessioniTotali: 35, funnelCompletati: 2, percentualeConversione: 0.1 },
  { date: '22', sessioniTotali: 45, funnelCompletati: 3, percentualeConversione: 0.2 },
  { date: '23', sessioniTotali: 120, funnelCompletati: 8, percentualeConversione: 0.3 },
  { date: '24', sessioniTotali: 250, funnelCompletati: 15, percentualeConversione: 0.4 },
  { date: '25', sessioniTotali: 400, funnelCompletati: 25, percentualeConversione: 0.6 },
  { date: '26', sessioniTotali: 484, funnelCompletati: 0, percentualeConversione: 0 },
];

export function TrendChart() {
  return (
    <div className="w-full h-80 p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Trend Principale</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sessioniTotali" 
            stroke="hsl(var(--analytics-blue))" 
            strokeWidth={2}
            name="Sessioni Totali"
            dot={{ fill: "hsl(var(--analytics-blue))", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="funnelCompletati" 
            stroke="hsl(var(--analytics-green))" 
            strokeWidth={2}
            name="Funnel Completati"
            dot={{ fill: "hsl(var(--analytics-green))", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="percentualeConversione" 
            stroke="hsl(var(--analytics-orange))" 
            strokeWidth={2}
            name="% Conversione"
            dot={{ fill: "hsl(var(--analytics-orange))", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}