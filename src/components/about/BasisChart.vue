<template>

  <div style="height: 600px; width: 600px">
    <vue3-chart-js :key='key' width="500" height="350" v-bind="{ ...lineChart }" />
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
import { useStore } from "vuex";
import { computed, reactive, ref, onMounted } from "vue";

// globally registered and available for all charts
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

export default {
  name: "App",
  components: {
    Vue3ChartJs,
  },
  setup() {
    const store = useStore();
    const key = ref('')
    const coin = ref('')
    onMounted(() => {
      store.dispatch("charts/setBasisChartData", "ETH");

    });
     const chartData = computed(() => {
      return store.state.charts.basisChartData;
      
    });
  setTimeout(()=>{
          lineChart.data.datasets[0].data = chartData.value.perp
      lineChart.data.labels = chartData.value.timestamp
      lineChart.data.datasets[1].data = chartData.value.qrt
  },2000)
   

    const lineChart = reactive({
      type: "line",
      // locally registered and available for this chart
      plugins: [],
      data: {
        labels: chartData.value.timestamp,
        datasets: [
          {
            label: "Perpetual",
            data: chartData.value.perp,
            borderColor: "grey",
            borderWidth:'1.2px',
            yAxisID: "y1",
   
          },
          {
            label: "Quarterly",
            data: chartData.value.qrt,
            borderColor: "darkgrey",
                       borderWidth:'1.2px',
            yAxisID: "y1",
          },
          {
            label: "Basis Rate",
            data: chartData.value.basis,
            borderColor: "dodgerblue",
                       borderWidth:'4px',
            yAxisID: "y",
          },
        ],
      },

      options: {
        responsive:true,
        maintainAspectRatio: true,
        scales:{
            y:{ id:'y',
                type:'linear',
                display:true,
                alignToPixels:true,
                position:'right',
                scaleLabel:{
                    display:true,
                    labelString:'ETHUSD'
                },
                                ticks:{
                    beginAtZero:true
                },
                                suggestedMin:-0.1,
                suggestedMax:.3
            },
            y1:{id:'y1',
                type:'linear',
                display: true,
                position:'left',
                grid:{
                    drawDownOnChart:false
                },
                ticks:{
                    beginAtZero:true
                },
                suggestedMin:200,
                suggestedMax:4500
            }

        },
        plugins: {
        //   pan: { 
        //       enabled: true,
        //       mode:'x',
        //       modifierKey:'ctrl' },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              drag:{
                  enabled:true,
              },
              mode: "xy",
            },
          },

          datalabels: {
            backgroundColor: function (context) {
              return context.dataset.backgroundColor;
            },
            borderRadius: 4,
            color: "white",
            font: {
              weight: "bold",
            },
            formatter: Math.round,
            padding: 6,
          },
        },
      },
    });

    console.log(lineChart, chartData.value.basis,key);
    return {
      lineChart,
      chartData,
      key
    };
  },
};
</script>
<style scoped>
.canvas {
  width: 450px;
}
</style>
