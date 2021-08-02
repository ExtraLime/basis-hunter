<template>
  <div width="300">
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
      tooltip: {
        shared: true,
        backgroundColor: "black",
        borderColor: "lightgrey",
        color: "lightgrey",
      },
      title: {
        margin: 5,
        text: "Live Basis Rates",
        style: {
          color: "lightgrey",
        },
      },
      panning: {
        enabled: true,
        type: "x",
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
        borderColor: "white",
      },
      series: coins.value.map((coin, idx) => {
        return {
          name: coin,
          data: Array(50).fill(0),
          borderColor: colors[idx],
          marker: {
            enabled: false,
            enabledThreshold: 1,
            radius: 1,
          },
        };
      }),
    });
    setInterval(() => {
      for (let i = 0; i < coins.value.length; i++) {
        let p = tickData.value[`${coins.value[i]}USD_PERP`];
        let q = tickData.value[`${coins.value[i]}USD_210924`];

        chartData.series[i].data.shift();
        chartData.series[i].data.push(parseFloat((q - p) / p));
      }
      let t = new Date(tickData.value.timestamp);
      chartData.xAxis.categories.shift();
      chartData.xAxis.categories.push(t.toLocaleTimeString());
    }, 1000);
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
