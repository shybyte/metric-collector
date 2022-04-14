import { simpleStats } from "./deps.ts";
import { MetricDataPoint, MetricStatistic } from "./types.ts";

export function calcStats(
  metricsDataPoints: MetricDataPoint[],
): MetricStatistic[] {
  const valuesByMetric: Record<string, number[]> = {};
  for (const metricDataPoint of metricsDataPoints) {
    const values = valuesByMetric[metricDataPoint.name] || [];
    values.push(metricDataPoint.value);
    valuesByMetric[metricDataPoint.name] = values;
  }

  return Object.entries(valuesByMetric).map(([key, values]) => {
    return {
      name: key,
      mean: simpleStats.mean(values),
      median: simpleStats.median(values),
      min: simpleStats.min(values),
      max: simpleStats.max(values),
      standardDeviation: simpleStats.standardDeviation(values),
    };
  });
}
