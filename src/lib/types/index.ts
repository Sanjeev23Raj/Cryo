export interface TemperatureLog {
  id: string;
  freezer_id: string;
  temperature: number;
  timestamp: string; // ISO 8601 string
  created_at: string; // ISO 8601 string
}

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface TelemetryDataInput {
  freezerId: string;
  temperature: number;
  timestamp: string;
}
