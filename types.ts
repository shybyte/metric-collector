export type Origin = string;

export interface MetricDataPoint {
  name: string;
  value: number;
  origin: string;
}

export interface MetricStatistic {
  name: string;
  mean: number;
  standardDeviation: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export interface MetricStatisticDbEntry {
  date: string;
  metricStats: MetricStatistic[];
}

export interface MetricStatisticsDb {
  origin: string;
  entries: MetricStatisticDbEntry[];
}