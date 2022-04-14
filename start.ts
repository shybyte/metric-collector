import { Application, oakCors, Router } from "./deps.ts";
import { addStatsToDB } from "./metric-db.ts";
import { renderMainPage } from "./pages.tsx";
import { calcStats } from "./stats.ts";
import { MetricDataPoint } from "./types.ts";

let metricsDataPoints: MetricDataPoint[] = [];

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = renderMainPage(metricsDataPoints);
});

router.post("/", async (ctx) => {
  const body: URLSearchParams = await ctx.request.body().value;
  const action = body.get('action')
  if (action === 'save') {
    console.log("Saving");
    await addStatsToDB(calcStats(metricsDataPoints));
  }
  metricsDataPoints = [];
  ctx.response.redirect("/");
});

router.post("/api/metric", async (ctx) => {
  console.log(ctx.request.headers);
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

app.addEventListener(
  "listen",
  (_e) => console.log("Listening on http://localhost:8080"),
);
await app.listen({ port: 8080 });
