export type Origin = string;

export interface MetricDataPoint {
  name: string;
  value: number;
  origin: string;
}

export interface MetricStatistic {
  name: string;
  mean: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
}

export interface MetricStatisticDbEntry {
  date: string;
  metricStats: MetricStatistic[];
}

export interface MetricStatisticsDb {
  entries: MetricStatisticDbEntry[];
}