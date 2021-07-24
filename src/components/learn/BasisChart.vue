<template>

  <div style="height: 400px; width: 1000px">
    <vue3-chart-js  width="500" height="350" v-bind="{ ...lineChart }" />
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
import { useStore } from "vuex";
import { computed, reactive, ref } from "vue";

// globally registered and available for all charts
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

export default {
  name: "App",
  components: {
    Vue3ChartJs,
  },
  setup() {
    const store = useStore();

const initChartData = computed(() => {
  console.log(store.state.charts.initChartData)
 return store.state.charts.initChartData;
    });
     const chartData = computed(() => {
      return store.state.charts.basisChartData;      
    });
      
    console.log(chartData)
    console.log(initChartData.value)
  setTimeout(()=>{
          lineChart.data.datasets = initChartData.value.datasets
      lineChart.data.labels = initChartData.value.labels
console.log(lineChart)
  },2000)
   console.log(initChartData.value.datasets)

    const lineChart = reactive({
      type: "line",
      // locally registered and available for this chart
      plugins: [],
      data: {
        labels: initChartData.value.labels,
        datasets: initChartData.value.datasets,
        // datasets: [
        //   {
        //     label: "Perpetual",
        //     data: chartData.value.perp,
        //     borderColor: "grey",
        //     borderWidth:'1.2px',
        //     yAxisID: "y1",
   
        //   },
        //   {
        //     label: "Quarterly",
        //     data: chartData.value.qrt,
        //     borderColor: "darkgrey",
        //                borderWidth:'1.2px',
        //     yAxisID: "y1",
        //   },
        //   {
        //     label: "Basis Rate",
        //     data: chartData.value.basis,
        //     borderColor: "dodgerblue",
        //                borderWidth:'4px',
        //     yAxisID: "y",
        //   },
        // ],
      },
      scales:{
            y:{ id:'y',
                type:'linear',
                display:true,
                alignToPixels:true,
                position:'right',
                scaleLabel:{
                    display:true,
                    labelString:'Basis Rates'
                },
                                ticks:{
                    beginAtZero:true
                },
                                suggestedMin:-0.05,
                suggestedMax:.15
            }
      },
      options: {
        responsive:true,
        maintainAspectRatio: true,

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
            color: ["#1C1CF0","#3B7A57",'#D2691E','#FFEF00','#E30022','#00CC99','#F7E7CE','#9FA91F','#0047AB'],
            font: {
              weight: "bold",
            },
            formatter: Math.round,
            padding: 6,
          },
        },
      },
    });

  
    return {
      lineChart,
      chartData,
      initChartData
    };
  },
};
</script>
<style scoped>
.canvas {
  width: 450px;
}
</style>
