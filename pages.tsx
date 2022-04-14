import { h, Helmet, renderSSR } from "./deps.ts";
import { calcStatsByOrigin } from "./stats.ts";
import { MetricDataPoint } from "./types.ts";

interface MainPageProps {
  metrics: MetricDataPoint[];
}

export const MainPage = (props: MainPageProps) => {
  return (
    <div>
      <h1>Metric Collector</h1>
      <form action="" method="post">
        <button name="action" value="save">Save</button>
        <button name="action" value="clear">Clear</button>
      </form>

      <h2>Values</h2>
      <pre>{JSON.stringify(props.metrics)}</pre>

      <h2>Stats</h2>
      <pre>{JSON.stringify(calcStatsByOrigin(props.metrics), null, 2)}</pre>
    </div>
  );
};

export function renderMainPage(metrics: MetricDataPoint[]) {
  const { body, head, footer } = Helmet.SSR(renderSSR(
    <MainPage metrics={metrics} />,
  ));

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Metric-Collector</title>
      ${head.join("\n")}
    </head>
    <body>
      ${body}
      ${footer.join("\n")}
    </body>
  </html>`;

  return html;
}
