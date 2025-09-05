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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2025-09-04'));
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
        throw new Error(`File not found: ${fileName}`);
      }
      
      const jsonData: AnalyticsData = await response.json();
      setData(jsonData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to aggregate data for weekly/monthly periods
  const loadAggregatedData = useCallback(async (type: PeriodType, range?: DateRange) => {
    setLoading(true);
    setError(null);

    try {
      // For now, we'll use the single available file for all period types
      // In a real implementation, this would aggregate multiple files based on the period
      const response = await fetch('/records/aggregates-2025-08-26.json');
      
      if (!response.ok) {
        throw new Error('Data not available for the selected period');
      }
      
      const jsonData: AnalyticsData = await response.json();
      
      // For weekly/monthly/custom periods, we still use the same data structure
      // The TrendChart component will handle the transformation to show daily aggregates
      // instead of hourly data
      setData(jsonData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setData(null);
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