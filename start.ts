import { Application, oakCors, Router } from "./deps.ts";
import {addStatsToDBs, readDBs} from "./metric-db.ts";
import { renderMainPage } from "./pages.tsx";
import { calcStatsByOrigin } from "./stats.ts";
import { MetricDataPoint } from "./types.ts";
import * as path from 'https://deno.land/std/path/mod.ts';

export const mainModuleDir = path.dirname(path.fromFileUrl(Deno.mainModule));

let metricsDataPoints: MetricDataPoint[] = [];

const router = new Router();

router.get("/stats", async (ctx) => {
  const dbs = await readDBs();
  ctx.response.body = dbs;
});

router.get("/", (ctx) => {
  ctx.response.body = renderMainPage(metricsDataPoints);
});

router.post("/", async (ctx) => {
  const body: URLSearchParams = await ctx.request.body().value;
  const action = body.get('action')
  if (action === 'save') {
    console.log("Saving");
    await addStatsToDBs(calcStatsByOrigin(metricsDataPoints));
  }
  metricsDataPoints = [];
  ctx.response.redirect("/");
});

router.post("/api/metric", async (ctx) => {
  const body: MetricDataPoint = await ctx.request.body().value;
  metricsDataPoints.push(body);
  ctx.response.body = { ok: true };
});

const app = new Application();
app.use(
  oakCors({
    origin: "*",
  }),
);
app.use(router.routes());
app.use(router.allowedMethods());

// static content
app.use(async (context, next) => {
  const root = path.join(mainModuleDir, 'static');
  try {
    await context.send({ root })
  } catch {
    next()
  }
})

app.addEventListener(
  "listen",
  (_e) => console.log("Listening on http://localhost:8080"),
);
await app.listen({ port: 8080 });
