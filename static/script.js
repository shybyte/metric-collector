function omitKeys(object, keys) {
  const result = {...object};
  for (const key of keys) {
    delete result[key];
  }
  console.log('result:', result)
  return result;
}


function initStackedChart(statsByName) {
  const chartEl = document.getElementById('stackedChart');


  const statNames = Object.keys(statsByName);
  console.log('statNames:', statNames)

  const option = {
    title: {
      text: 'Stacked Duration'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: statNames
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: Object.values(statsByName)[0].map(it => new Date(it.date).toLocaleDateString('de-de',
          {year: '2-digit', month: 'numeric', day: 'numeric'}
        ))
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: Object.entries(statsByName).map(([name, stats]) => ({
        name: name,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: stats.map(it => it.mean)
      }
    )),
  };
  const myChart = echarts.init(chartEl);
  myChart.setOption(option);
}


function initBoxPlotChart(title, metricStats) {
  const chartsContainerEl = document.getElementById('boxplots');
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
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
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

  initStackedChart(omitKeys(statsByName, ['render-layout-app']));

  for (const [name, stats] of Object.entries(statsByName)) {
    initBoxPlotChart(name, stats);
  }
}

start();