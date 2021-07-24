
<template>
  <div class="histo" v-for="chart in charts" :key="chart" :id="chart">
    <apexcharts
      width="250"
      height="250"
      type="bar"
      :options="chart.chartOptions"
      :series="chart.series"
    ></apexcharts>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "LiveChart",
  components: {
    apexcharts: VueApexCharts,
  },
  setup() {
    const store = useStore();
    const coins = computed(() => {
      const coinList = store.state.charts.coins;
      return coinList.map((coin) => {
        return coin.label;
      });
    });

    const intervals = computed(() => {
      const ints = store.state.charts.intervals;
      return ints.map((int) => int.label);
    });
    const histogramData = computed(() => {
      console.log(store.state.charts.histogramData);
      return store.state.charts.histogramData;
    });
    console.log(histogramData.value);
    const charts = [];

    intervals.value.forEach((interval, idx) => {
      if(['3m','5m','15m','30m','1h','4h'].includes(interval)){
      const data = histogramData.value[interval].interval;
      const counts = histogramData.value[interval].data.counts;
      const bins = histogramData.value[interval].data.bins;
      const pbs = [];
      const nbs = [];
      const pcs = [];
      const ncs = [];

      bins.forEach((bin, idx) => {
        if (bin > 0) {
          pbs.push(bin);
          pcs.push(counts[idx]);
        } else {
          nbs.push(bin);
          ncs.push(counts[idx]);
        }
      });
      const ncss = [...Array(ncs.length).fill(0), ...pcs];
      console.log(ncss);

      console.log(pbs);

      console.log(data);
      const chart = reactive({
        chartOptions: {
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },

          stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",

            width: 2,
            dashArray: 0,
          },
          xaxis: {
            categories: [...nbs, ...pbs],
            tickAmount: 20,
            tickPlacement:'on',
            labels: {
              show: true,
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: false,
            },
          },
          tooltip: {
            theme: "dark",
            chart: {
              background: "black",
            },
            shared: false,
            followCursor: true,
            y: {
              formatter: function (val) {
                return val.toFixed(2);
              },
            },
          },
          yaxis: {
            labels: {
              show: false,
              formatter: function (val) {
                return val.toFixed(2);
              },
            },
          },
          chart: {
            id: "histo",
            background: "black",
            foreColor: "white",
            animations: {
              enabled: true,
            },
            zoom:{
              enabled:true,
              type:'x'
            }
          },

          markers: {
            size: 0,
          },
          title: {
            text: `Movement Sizes at: ${interval}`,
            align: "center",
          },
        },
        series: [
          { data: ncs, color: "lightgrey", name: interval },
          { data: ncss, color: "dodgerblue", name: interval },
        ],
      });
      console.log(chart);
      charts.push(chart)
    }});
    
    console.log(charts);

    setTimeout(() => {
      console.log("timeout");
      console.log(histogramData);
    });
    // setInterval(() => {

    // }, 5000);

    return {
      histogramData,
      intervals,
      charts,
    };
  },
};
</script>
<style scoped>
</style>