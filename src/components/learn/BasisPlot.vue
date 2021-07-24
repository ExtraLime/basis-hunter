<template>
  <div width="500">
    <vue-highcharts
      type="chart"
      :options="chartData"
      :redrawOnUpdate="true"
      :oneToOneUpdate="false"
      :animateOnUpdate="true"
      @rendered="onRender"
      @update="onUpdate"
      @destroy="onDestroy"
    />
  </div>
</template>


<script>
import { computed, reactive } from "vue";
import VueHighcharts from "vue3-highcharts";
import { useStore } from "vuex";
export default {
  name: "BasisPlot",
  components: {
    VueHighcharts,
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
    const colors = [
      "#1C1CF0",
      "#3B7A57",
      "#D2691E",
      "#FFEF00",
      "#E30022",
      "#00CC99",
      "#F7E7CE",
      "#9FA91F",
      "#0047AB",
    ];
    const chartData = reactive({
      tooltip:{
        shared:true,
        backgroundColor:'black',
        borderColor:'lightgrey'
      },
      title:{
        margin:5,
        text:"Live Basis Rates",
        style:{
          color:'lightgrey'
        }
      },
      panning:{
        enabled:true,
        type:'x'
      },
      xAxis: {
        categories: initChartData.value.labels,
      },
      credits: {
        enabled: false,
      },
      colors: colors,
      chart: {
        backgroundColor: "black",
        borderColor:'white'
      },
      series: initChartData.value.datasets,
    });
    setTimeout(() =>{
        chartData.xAxis.categories = initChartData.value.labels
        chartData.series = initChartData.value.datasets
        console.log(chartData)
    },2000)
    setInterval(() => {
      for (let i = 0; i < coins.value.length; i++) {
        let p = tickData.value[`${coins.value[i]}USD_PERP`];
        let q = tickData.value[`${coins.value[i]}USD_210924`];

        chartData.series[i].data.shift();
        chartData.series[i].data.push(parseFloat((q - p) / p));
      }
             let t = new Date(tickData.value.timestamp)
             chartData.xAxis.categories.shift();
      chartData.xAxis.categories.push(t.toLocaleTimeString())
    }, 5000);
    const chartData = computed(() =>{
      return {
        series: [{
          name: 'Test Series',
          data: data.value,
        }],
      }
    });

    const onRender = () => {
      chartData.xAxis.categories = initChartData.value.labels
        chartData.series = initChartData.value.datasets
        console.log(chartData)
    };

    const onUpdate = () => {
      console.log("Chart updated");
    };

    const onDestroy = () => {
      console.log("Chart destroyed");
    };

    return {
      initChartData,
      chartData,
      onRender,
      onUpdate,
      onDestroy,
    };
  },
};
</script>

<style>
.vue-highcharts {
  width: 100%;
  color: dodgerblue;
  background-color: black;
}
</style>
