
<template>
  <div class="funding-plot">
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
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "USDTFundingChart",
  components: {
    apexcharts: VueApexCharts,
  },
  setup() {
    const store = useStore();

    const initChartData = computed(() => {
      return store.state.layout.fundingHistory;
    });
    const usdtData = initChartData.value.usdt;
    const coins = Object.keys(usdtData);
  const timestamps = usdtData.BTCUSDT.timestamps.map(tick => {
                    const date =new Date(tick*1000)
                    return date.toLocaleDateString()})

    const chartData = reactive({
      chartOptions: {
        colors: [
          "#3001ff",
          "#FF4500",
          "#b8a228",
          "#ffd700",
    
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
          categories: timestamps,
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
        },
        yaxis: {
          title: {
            text: "Rate",
          },
   
          labels: {
            formatter: function (val) {
              return parseFloat(val).toFixed(5);
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
          text: "Funding Rates from "+timestamps[0]+" to "+timestamps[timestamps.length-1],
          align: "center",
        },
      },
      series: coins.map((coin) => {
        const data = usdtData[`${coin}`].data;
        return { name: coin, data: data };
      }),
    });

    return {
      initChartData,
      chartData,
    };
  },
};
</script>
<style scoped>
</style>