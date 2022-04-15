import {MetricStatistic, MetricStatisticsDb, Origin} from "./types.ts";

export async function addStatsToDBs(statsByOrigin: Record<Origin, MetricStatistic[]>) {
  const now = new Date();
  for (const [origin, stats] of Object.entries(statsByOrigin)) {
    await addStatsToDB(origin, stats, now);
  }
}

async function addStatsToDB(origin: Origin, stats: MetricStatistic[], now: Date) {
  const file = "performance-stats/" + origin + ".json";
  const data: MetricStatisticsDb = await Deno.readTextFile(file).then(
    (result) => JSON.parse(result),
    (error) => {
      console.warn("Error while reading db:", error);
      return {entries: []};
    },
  );

  data.entries.push({
    date: now.toISOString(),
    metricStats: stats,
  });

  await Deno.writeTextFile(file, JSON.stringify(data, null, 2));
}
