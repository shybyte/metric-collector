import {simpleStats} from "./deps.ts";
import {MetricDataPoint, MetricStatistic, Origin} from "./types.ts";
import {groupByKey, mapValues} from "./utils.ts";

export function calcStatsByOrigin(metricsDataPoints: MetricDataPoint[]): Record<Origin, MetricStatistic[]> {
  const dataPointsByOrigin: Record<Origin, MetricDataPoint[]> = groupByKey(metricsDataPoints, el => el.origin, el => el);
  return mapValues(dataPointsByOrigin, calcStats);
}

function calcStats(
  metricsDataPoints: MetricDataPoint[],
): MetricStatistic[] {
  const valuesByMetric = groupByKey(metricsDataPoints, el => el.name, el => el.value);
  return Object.entries(valuesByMetric).map(([key, values]) => {
    return {
      name: key,
      mean: simpleStats.mean(values),
      standardDeviation: simpleStats.standardDeviation(values),
      min: simpleStats.min(values),
      q1: simpleStats.quantile(values, 0.25),
      median: simpleStats.median(values),
      q3: simpleStats.quantile(values, 0.75),
      max: simpleStats.max(values),
    };
  });
}
