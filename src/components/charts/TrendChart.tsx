import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '20', sessioniTotali: 30, funnelCompletati: 2, percentualeConversione: 6.7 },
  { date: '21', sessioniTotali: 45, funnelCompletati: 5, percentualeConversione: 11.1 },
  { date: '22', sessioniTotali: 78, funnelCompletati: 12, percentualeConversione: 15.4 },
  { date: '23', sessioniTotali: 125, funnelCompletati: 22, percentualeConversione: 17.6 },
  { date: '24', sessioniTotali: 298, funnelCompletati: 58, percentualeConversione: 19.5 },
  { date: '25', sessioniTotali: 420, funnelCompletati: 98, percentualeConversione: 23.3 },
  { date: '26', sessioniTotali: 484, funnelCompletati: 122, percentualeConversione: 25.2 },
];

export function TrendChart() {
  return (
    <div className="w-full h-80">
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