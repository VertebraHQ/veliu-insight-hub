import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

// Types based on the JSON structure
export interface AnalyticsData {
  total_sessions_yesterday: number;
  sessions_analyzed: number;
  rates: {
    rageclick_rate: number;
    console_error_rate: number;
    form_error_rate: number;
    fast_bounce_rate: number;
    nav_loop_rate: number;
  };
  averages: {
    avg_ttf_interaction_sec: number;
    avg_span_sec: number;
    avg_recording_sec: number;
    avg_active_sec: number;
    avg_engagement_ratio: number;
    avg_session_duration: number;
  };
  distributions: {
    os: Record<string, number>;
    browser: Record<string, number>;
    country: Record<string, number>;
    referrer: Record<string, number>;
    device_type: Record<string, number>;
    viewport_bucket: Record<string, number>;
    region: Record<string, number>;
  };
  clickmap_global: Record<string, number>;
  data_quality: {
    sessions_clock_skew: number;
    missing_timestamp_events: number;
    properties_parse_errors: number;
    sessions_without_pageview: number;
    sampling_rate: number;
  };
  web_vitals: {
    lcp_ms: { p50: number; p95: number };
    cls: { p50: number; p95: number };
    inp_ms: { p50: number; p95: number };
    fcp_ms: { p50: number; p95: number };
    ttfb_ms: { p50: number | null; p95: number | null };
    last_lcp_ms: { p50: number | null; p95: number | null };
  };
  funnel: {
    name: string;
    steps: string[];
    hits_by_step: number[];
    sessions: number;
    converted_sessions: number;
    conversion_rate: number;
    step_rates: number[];
  };
  timeseries: {
    hourly: {
      total_sessions: Array<{ hour: number; value: number }>;
      sessions_analyzed: Array<{ hour: number; value: number }>;
      funnel_completions: Array<{ hour: number; value: number }>;
      conversion_rate: Array<{ hour: number; value: number }>;
    };
  };
  ux: {
    session_quality_score: {
      weights: {
        scroll_depth: number;
        session_duration: number;
        pages_per_session: number;
        successful_interactions: number;
        funnel_step_completion_rate: number;
        rage_clicks: number;
        console_errors: number;
        exit_on_error: number;
        fast_bounce: number;
        microtask_completions: number;
        dead_clicks: number;
        cta_attempt_vs_complete: number;
      };
      stats: {
        min: number;
        q1: number;
        median: number;
        q3: number;
        max: number;
        mean: number;
        std_dev: number;
      };
      classification: {
        distribution: {
          good: number;
          neutral: number;
          bad: number;
        };
        percentages: {
          good: number;
          neutral: number;
          bad: number;
        };
      };
    };
    frustration: {
      examples: {
        with_errors: string[];
        with_rageclicks: string[];
      };
    };
    paths: {
      nodes: Array<{
        id: string;
        label: string;
        path_group: string;
        sessions: number;
      }>;
      edges: Array<{
        from: string;
        to: string;
        sessions: number;
      }>;
      entries: Array<{
        node: string;
        sessions: number;
      }>;
      exits: Array<{
        node: string;
        sessions: number;
      }>;
      loops: Array<{
        a: string;
        b: string;
        sessions: number;
      }>;
    };
  };
  tech: {
    errors: {
      console_by_browser: Record<string, number>;
      console_by_device: Record<string, number>;
      exceptions_by_fingerprint: Array<{
        fingerprint: string;
        count: number;
      }>;
    };
  };
  top_paths: Record<string, number>;
  search_tracking?: {
    global_data: Record<string, number>;
    trends: {
      sessions_with_searches: number;
      total_searches_in_analyzed_sessions: number;
    };
    top_search_categories: Record<string, number>;
    image_searches_total: number;
    text_searches_total: number;
  };
  sessions_with_searches?: number;
  total_searches_in_analyzed_sessions?: number;
  top_search_categories?: Record<string, number>;
  image_searches_total?: number;
  text_searches_total?: number;
  top_text_queries?: Record<string, number>;
  meta: {
    generated_at_utc: string;
    timezone: string;
    date_local: string;
    range_utc: {
      from: string;
      to: string;
    };
  };
}

// Function to create empty/zero analytics data structure
function createEmptyAnalyticsData(): AnalyticsData {
  return {
    total_sessions_yesterday: 0,
    sessions_analyzed: 0,
    rates: {
      rageclick_rate: 0,
      console_error_rate: 0,
      form_error_rate: 0,
      fast_bounce_rate: 0,
      nav_loop_rate: 0,
    },
    averages: {
      avg_ttf_interaction_sec: 0,
      avg_span_sec: 0,
      avg_recording_sec: 0,
      avg_active_sec: 0,
      avg_engagement_ratio: 0,
      avg_session_duration: 0,
    },
    distributions: {
      os: {},
      browser: {},
      country: {},
      referrer: {},
      device_type: {},
      viewport_bucket: {},
      region: {},
    },
    clickmap_global: {},
    data_quality: {
      sessions_clock_skew: 0,
      missing_timestamp_events: 0,
      properties_parse_errors: 0,
      sessions_without_pageview: 0,
      sampling_rate: 0,
    },
    web_vitals: {
      lcp_ms: { p50: 0, p95: 0 },
      cls: { p50: 0, p95: 0 },
      inp_ms: { p50: 0, p95: 0 },
      fcp_ms: { p50: 0, p95: 0 },
      ttfb_ms: { p50: null, p95: null },
      last_lcp_ms: { p50: null, p95: null },
    },
    funnel: {
      name: "N/A",
      steps: [],
      hits_by_step: [],
      sessions: 0,
      converted_sessions: 0,
      conversion_rate: 0,
      step_rates: [],
    },
    timeseries: {
      hourly: {
        total_sessions: [],
        sessions_analyzed: [],
        funnel_completions: [],
        conversion_rate: [],
      },
    },
    ux: {
      session_quality_score: {
        weights: {
          scroll_depth: 0,
          session_duration: 0,
          pages_per_session: 0,
          successful_interactions: 0,
          funnel_step_completion_rate: 0,
          rage_clicks: 0,
          console_errors: 0,
          exit_on_error: 0,
          fast_bounce: 0,
          microtask_completions: 0,
          dead_clicks: 0,
          cta_attempt_vs_complete: 0,
        },
        stats: {
          min: 0,
          q1: 0,
          median: 0,
          q3: 0,
          max: 0,
          mean: 0,
          std_dev: 0,
        },
        classification: {
          distribution: {
            good: 0,
            neutral: 0,
            bad: 0,
          },
          percentages: {
            good: 0,
            neutral: 0,
            bad: 0,
          },
        },
      },
      frustration: {
        examples: {
          with_errors: [],
          with_rageclicks: [],
        },
      },
      paths: {
        nodes: [],
        edges: [],
        entries: [],
        exits: [],
        loops: [],
      },
    },
    tech: {
      errors: {
        console_by_browser: {},
        console_by_device: {},
        exceptions_by_fingerprint: [],
      },
    },
    top_paths: {},
    search_tracking: {
      global_data: {},
      trends: {
        sessions_with_searches: 0,
        total_searches_in_analyzed_sessions: 0,
      },
      top_search_categories: {},
      image_searches_total: 0,
      text_searches_total: 0,
    },
    sessions_with_searches: 0,
    total_searches_in_analyzed_sessions: 0,
    top_search_categories: {},
    image_searches_total: 0,
    text_searches_total: 0,
    top_text_queries: {},
    meta: {
      generated_at_utc: new Date().toISOString(),
      timezone: "UTC",
      date_local: format(new Date(), 'yyyy-MM-dd'),
      range_utc: {
        from: new Date().toISOString(),
        to: new Date().toISOString(),
      },
    },
  };
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}

interface UseAnalyticsDataReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  availableDates: string[];
  selectedDate: Date;
  periodType: PeriodType;
  customDateRange: DateRange | null;
  setSelectedDate: (date: Date) => void;
  setPeriodType: (type: PeriodType) => void;
  setCustomDateRange: (range: DateRange | null) => void;
  refreshData: () => void;
}

export function useAnalyticsData(): UseAnalyticsDataReturn {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2025-09-06'));
  const [periodType, setPeriodType] = useState<PeriodType>('daily');
  const [customDateRange, setCustomDateRange] = useState<DateRange | null>(null);

  // Function to load available dates by scanning the records directory
  const loadAvailableDates = useCallback(async () => {
    try {
      // Try to discover available files by attempting to fetch known patterns
      // Since we can't directly list directory contents in a browser environment,
      // we'll try a range of recent dates and see which files exist
      const dates: string[] = [];
      const today = new Date();
      
      // Check the last 30 days for available files
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateString = format(checkDate, 'yyyy-MM-dd');
        const fileName = `aggregates-${dateString}.json`;
        
        try {
          const response = await fetch(`/records/${fileName}`, { method: 'HEAD' });
          if (response.ok) {
            dates.push(dateString);
          }
        } catch {
          // File doesn't exist, continue checking
        }
      }
      
      // Sort dates in descending order (most recent first)
      dates.sort((a, b) => b.localeCompare(a));
      setAvailableDates(dates);
      
      // If we found dates and no date is selected yet, select the most recent one
      if (dates.length > 0 && !selectedDate) {
        setSelectedDate(new Date(dates[0]));
      }
    } catch (err) {
      console.error('Error loading available dates:', err);
      // Fallback to known dates if scanning fails
      setAvailableDates(['2025-09-04', '2025-08-26']);
    }
  }, [selectedDate]);

  // Function to load data for a specific date
  const loadDataForDate = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);

    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const fileName = `aggregates-${dateString}.json`;
      
      // Try to load the JSON file
      const response = await fetch(`/records/${fileName}`);
      
      if (!response.ok) {
        // If file not found, show user-friendly message and provide empty data
        const emptyData = createEmptyAnalyticsData();
        emptyData.meta.date_local = dateString;
        setData(emptyData);
        setError(`Data non disponibile per la data ${format(date, 'dd/MM/yyyy')}. Tutti i campi sono stati impostati a 0.`);
        return;
      }
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON (e.g., HTML error page), provide empty data
        const emptyData = createEmptyAnalyticsData();
        emptyData.meta.date_local = dateString;
        setData(emptyData);
        setError(`Data non disponibile per la data ${format(date, 'dd/MM/yyyy')}. Tutti i campi sono stati impostati a 0.`);
        return;
      }
      
      const jsonData: AnalyticsData = await response.json();
      setData(jsonData);
    } catch (err) {
      // Handle any other errors (network issues, JSON parsing errors, etc.)
      const dateString = format(date, 'yyyy-MM-dd');
      const emptyData = createEmptyAnalyticsData();
      emptyData.meta.date_local = dateString;
      setData(emptyData);
      
      if (err instanceof Error && err.message.includes('JSON')) {
        setError(`Data non disponibile per la data ${format(date, 'dd/MM/yyyy')}. Tutti i campi sono stati impostati a 0.`);
      } else {
        setError(`Errore nel caricamento dei dati per la data ${format(date, 'dd/MM/yyyy')}. Tutti i campi sono stati impostati a 0.`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to get date range for period type
  const getDateRangeForPeriod = (type: PeriodType, customRange?: DateRange): DateRange => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    switch (type) {
      case 'weekly':
        // From yesterday back 7 days (yesterday to 7 days ago)
        const weekStart = new Date(yesterday);
        weekStart.setDate(yesterday.getDate() - 6);
        return { from: weekStart, to: yesterday };
      
      case 'monthly':
        // Current month from 1st to today
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: monthStart, to: today };
      
      case 'custom':
        return customRange || { from: today, to: today };
      
      default:
        return { from: today, to: today };
    }
  };

  // Function to aggregate multiple daily data files
  const aggregateMultipleDays = (dailyDataArray: AnalyticsData[], availableDates: string[], allRequestedDates: string[]): AnalyticsData => {
    if (dailyDataArray.length === 0) {
      return createEmptyAnalyticsData();
    }

    if (dailyDataArray.length === 1) {
      // For single day, keep the original data but update metadata to show actual date
      const singleData = { ...dailyDataArray[0] };
      
      // Update metadata to show just the available date
      singleData.meta.date_local = availableDates[0];
      
      singleData.timeseries.hourly = {
        total_sessions: [{ hour: 0, value: singleData.total_sessions_yesterday }],
        sessions_analyzed: [{ hour: 0, value: singleData.sessions_analyzed }],
        funnel_completions: [{ hour: 0, value: singleData.funnel.converted_sessions }],
        conversion_rate: [{ hour: 0, value: singleData.funnel.conversion_rate }]
      };
      return singleData;
    }

    // Start with the first day's data as base
    const aggregated = { ...dailyDataArray[0] };
    
    // Aggregate totals
    aggregated.total_sessions_yesterday = dailyDataArray.reduce((sum, data) => sum + data.total_sessions_yesterday, 0);
    aggregated.sessions_analyzed = dailyDataArray.reduce((sum, data) => sum + data.sessions_analyzed, 0);
    
    // Aggregate search data
    aggregated.sessions_with_searches = dailyDataArray.reduce((sum, data) => sum + (data.sessions_with_searches || 0), 0);
    aggregated.total_searches_in_analyzed_sessions = dailyDataArray.reduce((sum, data) => sum + (data.total_searches_in_analyzed_sessions || 0), 0);
    aggregated.image_searches_total = dailyDataArray.reduce((sum, data) => sum + (data.image_searches_total || 0), 0);
    aggregated.text_searches_total = dailyDataArray.reduce((sum, data) => sum + (data.text_searches_total || 0), 0);
    
    // Aggregate search_tracking data
    if (!aggregated.search_tracking) {
      aggregated.search_tracking = {
        global_data: {},
        trends: {
          sessions_with_searches: 0,
          total_searches_in_analyzed_sessions: 0,
        },
        top_search_categories: {},
        image_searches_total: 0,
        text_searches_total: 0,
      };
    }
    
    aggregated.search_tracking.trends.sessions_with_searches = dailyDataArray.reduce((sum, data) =>
      sum + (data.search_tracking?.trends?.sessions_with_searches || data.sessions_with_searches || 0), 0);
    aggregated.search_tracking.trends.total_searches_in_analyzed_sessions = dailyDataArray.reduce((sum, data) =>
      sum + (data.search_tracking?.trends?.total_searches_in_analyzed_sessions || data.total_searches_in_analyzed_sessions || 0), 0);
    aggregated.search_tracking.image_searches_total = dailyDataArray.reduce((sum, data) =>
      sum + (data.search_tracking?.image_searches_total || data.image_searches_total || 0), 0);
    aggregated.search_tracking.text_searches_total = dailyDataArray.reduce((sum, data) =>
      sum + (data.search_tracking?.text_searches_total || data.text_searches_total || 0), 0);
    
    // Aggregate search categories
    aggregated.top_search_categories = {};
    aggregated.search_tracking.top_search_categories = {};
    dailyDataArray.forEach(data => {
      // Legacy format
      if (data.top_search_categories) {
        Object.entries(data.top_search_categories).forEach(([category, count]) => {
          aggregated.top_search_categories![category] = (aggregated.top_search_categories![category] || 0) + (count as number);
        });
      }
      // New format
      if (data.search_tracking?.top_search_categories) {
        Object.entries(data.search_tracking.top_search_categories).forEach(([category, count]) => {
          aggregated.search_tracking!.top_search_categories[category] = (aggregated.search_tracking!.top_search_categories[category] || 0) + (count as number);
        });
      }
    });
    
    // Aggregate text queries
    aggregated.top_text_queries = {};
    dailyDataArray.forEach(data => {
      if (data.top_text_queries) {
        Object.entries(data.top_text_queries).forEach(([query, count]) => {
          aggregated.top_text_queries![query] = (aggregated.top_text_queries![query] || 0) + (count as number);
        });
      }
    });
    
    // Aggregate funnel data
    aggregated.funnel.sessions = dailyDataArray.reduce((sum, data) => sum + data.funnel.sessions, 0);
    aggregated.funnel.converted_sessions = dailyDataArray.reduce((sum, data) => sum + data.funnel.converted_sessions, 0);
    aggregated.funnel.conversion_rate = aggregated.funnel.sessions > 0 ?
      aggregated.funnel.converted_sessions / aggregated.funnel.sessions : 0;

    // For timeseries, we'll create daily aggregates instead of hourly
    const dailyTimeseries = dailyDataArray.map((data, index) => ({
      day: index,
      total_sessions: data.total_sessions_yesterday,
      sessions_analyzed: data.sessions_analyzed,
      funnel_completions: data.funnel.converted_sessions,
      conversion_rate: data.funnel.conversion_rate
    }));

    // Transform to the expected hourly format but with daily data
    aggregated.timeseries.hourly = {
      total_sessions: dailyTimeseries.map(day => ({ hour: day.day, value: day.total_sessions })),
      sessions_analyzed: dailyTimeseries.map(day => ({ hour: day.day, value: day.sessions_analyzed })),
      funnel_completions: dailyTimeseries.map(day => ({ hour: day.day, value: day.funnel_completions })),
      conversion_rate: dailyTimeseries.map(day => ({ hour: day.day, value: day.conversion_rate }))
    };

    // Calculate weighted averages for rates
    const totalSessions = aggregated.sessions_analyzed;
    if (totalSessions > 0) {
      aggregated.rates.rageclick_rate = dailyDataArray.reduce((sum, data) =>
        sum + (data.rates.rageclick_rate * data.sessions_analyzed), 0) / totalSessions;
      aggregated.rates.console_error_rate = dailyDataArray.reduce((sum, data) =>
        sum + (data.rates.console_error_rate * data.sessions_analyzed), 0) / totalSessions;
      aggregated.rates.fast_bounce_rate = dailyDataArray.reduce((sum, data) =>
        sum + (data.rates.fast_bounce_rate * data.sessions_analyzed), 0) / totalSessions;
    }

    // Calculate data quality percentage
    const totalQualitySessions = dailyDataArray.reduce((sum, data) =>
      sum + (data.sessions_analyzed - data.data_quality.sessions_clock_skew), 0);
    aggregated.data_quality.sampling_rate = totalSessions > 0 ? totalQualitySessions / totalSessions : 0;

    return aggregated;
  };

  // Function to aggregate data for weekly/monthly periods
  const loadAggregatedData = useCallback(async (type: PeriodType, range?: DateRange) => {
    setLoading(true);
    setError(null);

    try {
      const dateRange = getDateRangeForPeriod(type, range);
      const dailyDataArray: AnalyticsData[] = [];
      const availableDates: string[] = [];
      
      // Generate list of dates to fetch
      const dates: string[] = [];
      const currentDate = new Date(dateRange.from);
      
      while (currentDate <= dateRange.to) {
        dates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Try to fetch data for each date
      for (const dateString of dates) {
        try {
          const fileName = `aggregates-${dateString}.json`;
          const response = await fetch(`/records/${fileName}`);
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const dayData: AnalyticsData = await response.json();
              dailyDataArray.push(dayData);
              availableDates.push(dateString);
            }
          }
        } catch (err) {
          // Skip this date if file doesn't exist or can't be loaded
          console.warn(`Could not load data for ${dateString}`);
        }
      }

      if (dailyDataArray.length === 0) {
        // No data found for the period
        const emptyData = createEmptyAnalyticsData();
        const periodLabel = type === 'weekly' ? 'settimanale' :
                           type === 'monthly' ? 'mensile' :
                           type === 'custom' ? 'personalizzato' : 'selezionato';
        setData(emptyData);
        setError(`Nessun dato disponibile per il periodo ${periodLabel}. Tutti i campi sono stati impostati a 0.`);
        return;
      }

      // Aggregate the daily data
      const aggregatedData = aggregateMultipleDays(dailyDataArray, availableDates, dates);
      
      // For multiple days, keep the original requested date range in metadata
      if (dailyDataArray.length > 1) {
        aggregatedData.meta.date_local = `${format(dateRange.from, 'yyyy-MM-dd')} - ${format(dateRange.to, 'yyyy-MM-dd')}`;
        aggregatedData.meta.range_utc.from = dateRange.from.toISOString();
        aggregatedData.meta.range_utc.to = dateRange.to.toISOString();
      }
      // For single day, the metadata is already set correctly in aggregateMultipleDays
      
      // Add warning if we have partial data for the requested period
      if (dailyDataArray.length < dates.length) {
        const periodLabel = type === 'weekly' ? 'settimanale' :
                           type === 'monthly' ? 'mensile' :
                           type === 'custom' ? 'personalizzato' : 'selezionato';
        setError(`Dati parziali per il periodo ${periodLabel}: disponibili ${dailyDataArray.length} di ${dates.length} giorni richiesti.`);
      }
      
      setData(aggregatedData);
    } catch (err) {
      // Handle any other errors and provide empty data
      const emptyData = createEmptyAnalyticsData();
      const periodLabel = type === 'weekly' ? 'settimanale' :
                         type === 'monthly' ? 'mensile' :
                         type === 'custom' ? 'personalizzato' : 'selezionato';
      setData(emptyData);
      setError(`Errore nel caricamento dei dati per il periodo ${periodLabel}. Tutti i campi sono stati impostati a 0.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Main data loading effect
  useEffect(() => {
    if (periodType === 'daily') {
      loadDataForDate(selectedDate);
    } else if (periodType === 'custom' && customDateRange) {
      loadAggregatedData(periodType, customDateRange);
    } else {
      loadAggregatedData(periodType);
    }
  }, [selectedDate, periodType, customDateRange, loadDataForDate, loadAggregatedData]);

  // Load available dates on mount
  useEffect(() => {
    loadAvailableDates();
  }, [loadAvailableDates]);

  const refreshData = useCallback(() => {
    if (periodType === 'daily') {
      loadDataForDate(selectedDate);
    } else if (periodType === 'custom' && customDateRange) {
      loadAggregatedData(periodType, customDateRange);
    } else {
      loadAggregatedData(periodType);
    }
  }, [selectedDate, periodType, customDateRange, loadDataForDate, loadAggregatedData]);

  return {
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
    refreshData,
  };
}