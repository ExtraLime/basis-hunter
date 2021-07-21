<template>
  <p>
    ChartJs
  </p>
 <div style="height:600px;width: 600px;">
      <vue3-chart-js width="500"
      height="350" ref="lineChartRef" v-bind="{ ...lineChart }" /></div>
 
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import zoomPlugin from "chartjs-plugin-zoom";
import { useStore } from 'vuex'
import {computed,reactive, ref} from 'vue'

// globally registered and available for all charts
Vue3ChartJs.registerGlobalPlugins([zoomPlugin]);

export default {
  name: "App",
  components: {
    Vue3ChartJs,
  },
  setup() {
    
      const store = useStore()
        const coins = computed(() => {
      const coinList = store.state.charts.coins;
      return coinList.map((coin) => {
        return coin.label;
      });
    });
    const colors = ["#1C1CF0","#3B7A57",'#D2691E','#FFEF00','#E30022','#00CC99','#F7E7CE','#9FA91F','#0047AB']    
    const lineChartRef = ref(null)
    const lineChart = reactive({
      type: "line",
      // locally registered and available for this chart
      plugins: [],
      data: {
        labels: Array(50).fill(),
        datasets: coins.value.map((coin,idx) => {
        return {
          label: coin,
          data: Array(50).fill(0),
          borderColor:colors[idx]
        };
      }),
      },
      options: {
        plugins: {
            pan:{enabled:true},
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "y",
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
    const tickData = computed(() => {
      const data = store.state.live.messages;

      return data;
    });
    const updateChart = () => {
        
    }
setInterval(() => {
   for(let i=0;i<coins.value.length;i++){
    let p = tickData.value[`${coins.value[i]}USD_PERP`];
        let q = tickData.value[`${coins.value[i]}USD_210924`];
        lineChart.data.datasets[i].data.shift();
        lineChart.data.datasets[i].data.push(parseFloat((q - p) / p))
       }
               let t = tickData.value.timestamp
               lineChart.data.labels.shift();
        lineChart.data.labels.push(t)  

    
    }, 5000);
console.log(lineChart)
    return {
      lineChart,
      lineChartRef
    };
  },
};
</script>
<style scoped>
.canvas {
    width:450px;
}
</style>
