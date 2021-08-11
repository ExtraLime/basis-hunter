
<template>
  <div class="tick-plot">
    <apexcharts
      width="400"
      height="250"
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

    const chartData = reactive({
      chartOptions: {
        colors: [
          "#3001ff",
          "#FF4500",
          "#b8a228",
          "#ffd700",
          "#FF1493",
          "#0cb6a9",
          "#000080",
          "#a9a9a9",
          "#0f72e5",
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
              return '%'+ val.toFixed(3);
            },
          },
        },
        yaxis: {
          title: {
            text: "Rate",
          },
          labels: {
            formatter: function (val) {
              return '%'+val.toFixed(3);
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
          text: "Funding Rates",
          align: "left",
        },
      },
      series: coins.value.map((coin) => {
        return {
          name: coin,
          data: Array(25).fill(0),
        };
      }),
    });

    const tickData = computed(() => {
      const data = store.state.live.uFunding;

      return data;
    });
    setInterval(() => {
      //  let yMax = Math.max(...chartData.series.map(coin =>{
      //   return Math.max(...coin.data)
      // }))

      // let yMin = Math.min(...chartData.series.map(coin =>{
      //   return Math.min(...coin.data)
      // }))
      for (let i = 0; i < coins.value.length; i++) {
        let p = tickData.value[coins.value[i]];
        chartData.series[i].data.shift();
        chartData.series[i].data.push(p * 100);
      }
      let t = new Date();
      chartData.chartOptions.xaxis.categories.shift();
      chartData.chartOptions.xaxis.categories.push(t.toLocaleTimeString());
        //       chartData.chartOptions.yaxis.max = yMax
        // chartData.chartOptions.yaxis.min = yMin
      
    }, 5000);

    return {
      tickData,

      chartData,
    };
  },
};
</script>
<style scoped>
</style>