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
import '../../../node_modules/highcharts-histogram-bellcurve/histogram-bellcurve.js'
import { useStore } from "vuex";
export default {
  name: "TickPlot",
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
    const tickData = computed(() => {
      const data = store.state.live.messages;

      return data;
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
        text:"Histogram",
        style:{
          color:'lightgrey'
        }
      },
      panning:{
        enabled:true,
        type:'x'
      },
      xAxis: {
        categories: Array(50).fill(0),
      },
      credits: {
        enabled: false,
      },
      colors: colors,
      chart: {
        backgroundColor: "black",
        borderColor:'white'
      },
     series: [
    //    {
    //     name: 'Histogram',
    //     type: 'histogram',
    //     xAxis: 1,
    //     yAxis: 1,
    //     baseSeries: 's1',
    //     zIndex: -1
    // },
     {
        name: 'Data',
        type: 'scatter',
        data: computed(()=>store.state.charts.histogramData.kLines),
        id: 's1',
        marker: {
            radius: 1.5
        }
    }],
      })
 

    // const chartData = computed(() =>{
    //   return {
    //     series: [{
    //       name: 'Test Series',
    //       data: data.value,
    //     }],
    //   }
    // });

    const onRender = () => {
      console.log("Chart rendered");
    };

    const onUpdate = () => {
      console.log("Chart updated");
    };

    const onDestroy = () => {
      console.log("Chart destroyed");
    };

    return {
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
