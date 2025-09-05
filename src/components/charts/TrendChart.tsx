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
      // From yesterday back 7 days (yesterday to 7 days ago)
      return eachDayOfInterval({
        start: subDays(yesterday, 6),
        end: yesterday
      });
    
    case 'monthly':
      // Current month from 1st to today
      return eachDayOfInterval({
        start: startOfMonth(today),
        end: today
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

// Generate chart data with complete date range and zeros for missing days
function generateChartData(
  periodType: PeriodType,
  data: AnalyticsData | null,
  selectedDate?: Date,
  customRange?: { from: Date; to: Date } | null
) {
  if (periodType === 'daily' && data) {
    // For daily view, show hourly data
    return data.timeseries.hourly.total_sessions.map((item, index) => ({
      date: item.hour.toString().padStart(2, '0'),
      sessioniTotali: item.value,
      funnelCompletati: data.timeseries.hourly.funnel_completions[index]?.value || 0,
      percentualeConversione: Math.round((data.timeseries.hourly.conversion_rate[index]?.value || 0) * 100 * 100) / 100
    }));
  }
  
  // For weekly, monthly, and custom views, always show the complete date range
  const fullDateRange = generateDateRange(periodType, selectedDate, customRange);
  
  // Create a map of available data by date
  const dataByDate = new Map<string, { sessions: number; funnel: number; conversion: number }>();
  
  if (data && data.timeseries.hourly.total_sessions.length > 0) {
    // Check if we have aggregated data from multiple days
    const metaDateLocal = data.meta.date_local;
    
    if (metaDateLocal.includes(' - ')) {
      // Multiple days - map the aggregated data to actual dates
      const [fromDateStr, toDateStr] = metaDateLocal.split(' - ');
      const fromDate = new Date(fromDateStr);
      const toDate = new Date(toDateStr);
      const actualDateRange = eachDayOfInterval({ start: fromDate, end: toDate });
      
      data.timeseries.hourly.total_sessions.forEach((item, index) => {
        const dayIndex = item.hour;
        const date = actualDateRange[dayIndex];
        if (date) {
          const dateKey = format(date, 'yyyy-MM-dd');
          dataByDate.set(dateKey, {
            sessions: item.value,
            funnel: data.timeseries.hourly.funnel_completions[index]?.value || 0,
            conversion: data.timeseries.hourly.conversion_rate[index]?.value || 0
          });
        }
      });
    } else {
      // Single day data - use the actual date from metadata
      const singleDate = new Date(metaDateLocal);
      const dateKey = format(singleDate, 'yyyy-MM-dd');
      dataByDate.set(dateKey, {
        sessions: data.total_sessions_yesterday,
        funnel: data.funnel.converted_sessions,
        conversion: data.funnel.conversion_rate
      });
    }
  }
  
  // Generate chart data for the complete date range
  return fullDateRange.map(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = dataByDate.get(dateKey);
    
    return {
      date: format(date, 'dd/MM'),
      sessioniTotali: dayData?.sessions || 0,
      funnelCompletati: dayData?.funnel || 0,
      percentualeConversione: dayData ? Math.round(dayData.conversion * 100 * 100) / 100 : 0
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