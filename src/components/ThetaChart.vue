<template>
  <div width="500">
    <vue-highcharts
      type="chart"
      :options="chartData"
      :redrawOnUpdate="true"
      :oneToOneUpdate="true"
      :animateOnUpdate="true"
      @rendered="onRender"
      @update="onUpdate"
      @destroy="onDestroy"
    />
  </div>
</template>

<script>
import { onMounted, computed, reactive } from "vue";
import VueHighcharts from "vue3-highcharts";
import { useStore } from "vuex";
export default {
  name: "MyChart",
  components: {
    VueHighcharts,
  },
  setup() {
    const store = useStore();
    const storeData = computed(() => {
      return store.state.charts;
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
      series: [
        {
          name: "Basis",
          data: Array(50).fill(0),
          borderColor: "white",
          marker: {
            enabled: false,
            enabledThreshold: 1,
            radius: 1,
          },
        },
        {
          name: "Perpetual",
          data: Array(50).fill(0),
          borderColor: "white",
          marker: {
            enabled: false,
            enabledThreshold: 1,
            radius: 1,
          },
        },
      ],
    });
    onMounted(() => {
      store.dispatch("charts/getChartsData");
    });
    setTimeout(() => {
      const data = computed(() => {
        return store.state.charts.chartsData;
      });
      console.log(data);
      chartData.series = data.value.apexCharts.basis.series;
      console.log(chartData.series);
    }, 5000);
    // const data = computed(() => {
    //         return store.state.charts.chartsData
    //     })
    console.log(chartData.series);
    const onRender = () => {
      console.log("Chart rendered");
      //    chartData.series.data = data.value.apexCharts.basis.series[0].data
      //    console.log(chartData.series)
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
