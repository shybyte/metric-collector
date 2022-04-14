import { MetricStatistic, MetricStatisticsDb } from "./types.ts";

export async function addStatsToDB(stats: MetricStatistic[]) {
  const data: MetricStatisticsDb = await Deno.readTextFile("data.json").then(
    (result) => JSON.parse(result),
    (error) => {
      console.warn("Error while reading db:", error);
      return { entries: [] };
    },
  );
  
  data.entries.push({
    date: new Date().toISOString(),
    metricStats: stats,
  });

  Deno.writeTextFile("data.json", JSON.stringify(data, null, 2));
}
