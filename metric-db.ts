import {MetricStatistic, MetricStatisticsDb, Origin} from "./types.ts";

const performanceStatsFolder = "performance-stats/";

export async function readDBs(): Promise<MetricStatisticsDb[]> {
  const result: MetricStatisticsDb[] = [];
  for await (const dirEntry of Deno.readDir(performanceStatsFolder)) {
    if (dirEntry.name.endsWith('.json')) {
      const db = await Deno.readTextFile(performanceStatsFolder + dirEntry.name)
        .then(r => JSON.parse(r));
      result.push(db);
    }
  }
  return result;
}

export async function addStatsToDBs(statsByOrigin: Record<Origin, MetricStatistic[]>) {
  const now = new Date();
  for (const [origin, stats] of Object.entries(statsByOrigin)) {
    await addStatsToDB(origin, stats, now);
  }
}

async function addStatsToDB(origin: Origin, stats: MetricStatistic[], now: Date) {
  const file = performanceStatsFolder + origin + ".json";
  const data: MetricStatisticsDb = await Deno.readTextFile(file).then(
    (result) => JSON.parse(result),
    (error) => {
      console.warn("Error while reading db:", error);
      return {origin: origin, entries: []};
    },
  );

  data.entries.push({
    date: now.toISOString(),
    metricStats: stats,
  });

  await Deno.writeTextFile(file, JSON.stringify(data, null, 2));
}
