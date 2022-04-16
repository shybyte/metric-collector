function initChart(title, metricStats) {
  const chartsContainerEl = document.getElementById('charts');
  const chartEl = document.createElement('div');
  chartEl.style.width = '100%';
  chartEl.style.height = '300px';
  chartsContainerEl.appendChild(chartEl);

  const option = {
    title: {
      text: title
    },
    tooltip: {},
    legend: {
      data: ['Duration in ms']
    },
    xAxis: {
      data: metricStats.map(it => new Date(it.date).toLocaleDateString('de-de',
        {year: '2-digit', month: 'numeric', day: 'numeric'}
      ))
    },
    yAxis: {},
    series: [
      {
        name: 'sales',
        type: 'boxplot',
        data: metricStats.map(it => [it.min, it.q1, it.median, it.q3, it.max])
      }
    ]
  };

  const myChart = echarts.init(chartEl);
  myChart.setOption(option);
}

async function start() {
  const dbs = await fetch('stats').then(r => r.json());
  console.log('dbs', dbs);
  const selectedOrigin = new URLSearchParams(location.search).get('origin') || dbs[0].origin;
  const originSelector = document.getElementById('originSelector');
  originSelector.innerHTML = dbs.map(db =>
    `<option value="${db.origin}"  ${db.origin === selectedOrigin ? 'selected' : ''}>${db.origin}</option>`).join('\n'
  );

  originSelector.addEventListener('change', () => {
    console.log('originSelector.value:', originSelector.value);
    const sp = new URLSearchParams(location.search);
    sp.set('origin', originSelector.value);
    console.log('sp:', sp.toString())
    location.search = '?' + sp.toString();
  })

  const selectedDB = dbs.find(it => it.origin === selectedOrigin);
  console.log('selectedDB', selectedDB);
  const statsByName = {};
  for (const {date, metricStats} of selectedDB.entries) {
    for (const stat of metricStats) {
      const stats = statsByName[stat.name] || [];
      stats.push({date, ...stat});
      statsByName[stat.name] = stats;
    }
  }

  console.log('statsByName:', statsByName)

  for (const [name, stats] of Object.entries(statsByName)) {
    initChart(name, stats);
  }
}

start();