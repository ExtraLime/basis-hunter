
<template>
  <div class="basis-plot">
    <apexcharts
      width="1000"
      height="350"
      type="line"
      :options="chartData.chartOptions"
      :series="chartData.series"
    ></apexcharts>
  </div>
</template>

<script>
import { computed, ref, reactive } from "vue";
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

    const initChartData = computed(() => {
      console.log(store.state.charts.initChartData);
      return store.state.charts.initChartData;
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
              categories: initChartData.value.labels,
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
              return val.toFixed(5);
            },
          },
        },
        yaxis: {
          title: {
            text: "Rate",
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(5);
            },
          },
        },
        chart: {
          id: "basis",
          background: "black",
          foreColor: "white",
          animations: {
            enabled: true,
          },
        },

        markers: {
          size: 0,
        },
        title: {
          text: "Recent Basis Rates",
          align: "center",
        },
      },
      series: coins.value.map(coin => {
                const data=initChartData.value.datasets.filter((data) => data.name === coin)
                return data[0]
      }) 





    });

    // setInterval(() => {
console.log(coins.value.map(coin => {
                const data=initChartData.value.datasets.filter((data) => data.name === coin)
                return data[0]}))
    // }, 5000);

    return {
      initChartData,
      chartData,
    };
  },
};
</script>
<style scoped>
</style>