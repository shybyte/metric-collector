export function groupByKey<T, V>(array: T[], getKey: (el: T) => string, getValue: (el: T) => V): Record<string, V[]> {
  const result: Record<string, V[]> = {};
  for (const metricDataPoint of array) {
    const key = getKey(metricDataPoint);
    const values = result[key] || [];
    values.push(getValue(metricDataPoint));
    result[key] = values;
  }
  return result;
}

export function mapValues<T, R>(record: Record<string, T>, map: (value: T) => R): Record<string, R> {
  const result: Record<string, R> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = map(value);
  }
  return result;
}
