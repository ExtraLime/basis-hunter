
<template>
  <div class="tick-plot">
    <apexcharts
      width="350"
      height="350"
      type="line"
      :options="chartData.chartOptions"
      :series="chartData.series"
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

    const chartData = reactive({
      chartOptions: {
        colors: [
          "#1C1CF0",
          "#3B7A57",
          "#D2691E",
          "#FFEF00",
          "#E30022",
          "#00CC99",
          "#F7E7CE",
          "#9FA91F",
          "#0047AB",
        ],
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",

          width: 2,
          dashArray: 0,
        },
        xaxis: {
          categories: Array(30).fill(0),
          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        tooltip: {
          style: {
            fontSize: "10px",
            backgroundColor: "pink",
          },
          theme: "dark",
          chart: {
            background: "black",
          },
          shared: true,
          y: {
            formatter: function (val) {
              return "%" + val.toFixed(5);
            },
          },
        },
        yaxis: {
          title: {
            text: "Rate",
          },
          labels: {
            formatter: function (val) {
              return "%" + val.toFixed(3);
            },
          },
        },
        chart: {
          id: "basis",
          background: "black",
          foreColor: "white",
          animations: {
            enabled: false,
          },
        },

        markers: {
          size: 0,
        },
        title: {
          text: "Live Basis Rates",
          align: "left",
        },
      },
      series: coins.value.map((coin) => {
        return {
          name: coin,
          data: Array(30).fill(0),
        };
      }),
    });

    const tickData = computed(() => {
      const data = store.state.live.messages;

      return data;
    });
    setInterval(() => {
      // let yMax = Math.max(
      //   ...chartData.series.map((coin) => {
      //     return Math.max(...coin.data);
      //   })
      // );
  
      // let yMin = Math.min(
      //   ...chartData.series.map((coin) => {
      //     return Math.min(...coin.data);
      //   })
      // );
  
      for (let i = 0; i < coins.value.length; i++) {
        let p = tickData.value[`${coins.value[i]}USD_PERP`];
        let q = tickData.value[`${coins.value[i]}USD_210924`];
        chartData.series[i].data.shift();
  

        chartData.series[i].data.push((q - p) / p);
      }
      let t = new Date(tickData.value.timestamp);
      chartData.chartOptions.xaxis.categories.shift();
      chartData.chartOptions.xaxis.categories.push(t.toLocaleTimeString());
      // chartData.chartOptions.yaxis.max = yMax;
      // chartData.chartOptions.yaxis.min = yMin;
    }, 2000);

    return {
      tickData,
      chartData,
    };
  },
};
</script>
<style scoped>
</style>