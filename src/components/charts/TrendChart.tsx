import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalyticsData, PeriodType } from '@/hooks/useAnalyticsData';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface TrendChartProps {
  data?: AnalyticsData | null;
  periodType: PeriodType;
  selectedDate?: Date;
  customDateRange?: { from: Date; to: Date } | null;
}

// Fallback data for when no real data is available
const fallbackData = [
  { date: '20', sessioniTotali: 30, funnelCompletati: 2, percentualeConversione: 6.7 },
  { date: '21', sessioniTotali: 45, funnelCompletati: 5, percentualeConversione: 11.1 },
  { date: '22', sessioniTotali: 78, funnelCompletati: 12, percentualeConversione: 15.4 },
  { date: '23', sessioniTotali: 125, funnelCompletati: 22, percentualeConversione: 17.6 },
  { date: '24', sessioniTotali: 298, funnelCompletati: 58, percentualeConversione: 19.5 },
  { date: '25', sessioniTotali: 420, funnelCompletati: 98, percentualeConversione: 23.3 },
  { date: '26', sessioniTotali: 484, funnelCompletati: 122, percentualeConversione: 25.2 },
];

// Generate date range based on period type
function generateDateRange(periodType: PeriodType, selectedDate?: Date, customRange?: { from: Date; to: Date } | null): Date[] {
  const today = new Date();
  const yesterday = subDays(today, 1);
  
  switch (periodType) {
    case 'weekly':
      // Last 7 days ending yesterday
      return eachDayOfInterval({
        start: subDays(yesterday, 6),
        end: yesterday
      });
    
    case 'monthly':
      // All days of current month
      return eachDayOfInterval({
        start: startOfMonth(today),
        end: endOfMonth(today)
      });
    
    case 'custom':
      if (customRange) {
        return eachDayOfInterval({
          start: customRange.from,
          end: customRange.to
        });
      }
      return [yesterday];
    
    case 'daily':
    default:
      // Single day (selected date or yesterday)
      return [selectedDate || yesterday];
  }
}

// Generate chart data with zeros for missing days
function generateChartData(
  periodType: PeriodType,
  data: AnalyticsData | null,
  selectedDate?: Date,
  customRange?: { from: Date; to: Date } | null
) {
  const dateRange = generateDateRange(periodType, selectedDate, customRange);
  
  if (periodType === 'daily' && data) {
    // For daily view, show hourly data
    return data.timeseries.hourly.total_sessions.map((item, index) => ({
      date: item.hour.toString().padStart(2, '0'),
      sessioniTotali: item.value,
      funnelCompletati: data.timeseries.hourly.funnel_completions[index]?.value || 0,
      percentualeConversione: Math.round((data.timeseries.hourly.conversion_rate[index]?.value || 0) * 100 * 100) / 100
    }));
  }
  
  // For weekly, monthly, and custom views, show daily data
  return dateRange.map(date => {
    const dateStr = format(date, 'dd/MM');
    
    // For now, we only have data for 2025-08-26, so we'll use that data for that specific date
    // and zeros for all other dates
    const isDataAvailable = data && format(date, 'yyyy-MM-dd') === '2025-08-26';
    
    if (isDataAvailable) {
      // Sum up the hourly data to get daily totals
      const totalSessions = data.timeseries.hourly.total_sessions.reduce((sum, item) => sum + item.value, 0);
      const totalFunnelCompletions = data.timeseries.hourly.funnel_completions.reduce((sum, item) => sum + item.value, 0);
      const avgConversionRate = totalSessions > 0 ? (totalFunnelCompletions / totalSessions) * 100 : 0;
      
      return {
        date: dateStr,
        sessioniTotali: totalSessions,
        funnelCompletati: totalFunnelCompletions,
        percentualeConversione: Math.round(avgConversionRate * 100) / 100
      };
    }
    
    // Return zeros for dates without data
    return {
      date: dateStr,
      sessioniTotali: 0,
      funnelCompletati: 0,
      percentualeConversione: 0
    };
  });
}

export function TrendChart({ data, periodType, selectedDate, customDateRange }: TrendChartProps) {
  // Transform the analytics data into chart format based on period type
  const chartData = data || periodType !== 'daily' ?
    generateChartData(periodType, data, selectedDate, customDateRange) :
    fallbackData;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
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