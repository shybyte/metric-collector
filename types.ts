export interface MetricDataPoint {
  name: string;
  value: number;
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